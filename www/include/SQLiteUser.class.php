<?php
require_once('init.php');
define('DIMENSION_SQLITE_DB', ROOT_DIR.DIRECTORY_SEPARATOR."assets".DIRECTORY_SEPARATOR."db".DIRECTORY_SEPARATOR."dimension.db");

class SQLiteUser {
    private $db;

    private function exists($id) {
        $ret = $this->db->querySingle("SELECT id from user WHERE id = '".trim($id)."'");
        return !empty($ret);
    }

    private function bindUserParams(&$stm, &$row, $update = false) {
        $stm->bindParam(':id', $row['DocUserID']);
        $stm->bindParam(':name', $row['AP_USER_NAME']);
        $stm->bindValue(':sex', $row['AP_SEX'] == '男' ? 1 : 0);
        $stm->bindParam(':addr', $row['AP_ADR']);
        $stm->bindParam(':tel', $row['AP_TEL'], SQLITE3_TEXT);
        $stm->bindValue(':ext', empty($row['AP_EXT']) ? '153' : $row['AP_EXT'], SQLITE3_TEXT); // 總機 153
        $stm->bindParam(':cell', $row['AP_SEL'], SQLITE3_TEXT);
        $stm->bindParam(':unit', $row['AP_UNIT_NAME']);
        $stm->bindParam(':title', $row['AP_JOB']);
        $stm->bindParam(':work', $row['AP_WORK']);
        $stm->bindParam(':exam', $row['AP_TEST']);
        $stm->bindParam(':education', $row['AP_HI_SCHOOL']);
        $stm->bindParam(':birthday', $row['AP_BIRTH']);

        $tokens = preg_split("/\s+/", $row['AP_ON_DATE']);
        if (count($tokens) == 3) {
            $rewrite = $tokens[2]."/".str_pad($tokens[0], 2, '0', STR_PAD_LEFT)."/".str_pad($tokens[1], 2, '0', STR_PAD_LEFT);
            $stm->bindParam(':onboard_date', $rewrite);
        } else {
            $stm->bindParam(':onboard_date', $row['AP_ON_DATE']);
        }
        
        $stm->bindParam(':offboard_date', $row['AP_OFF_DATE']);
        $stm->bindParam(':ip', $row['AP_PCIP']);

        // $stm->bindValue(':pw_hash', '827ddd09eba5fdaee4639f30c5b8715d');    // HB default
        
        $authority = $this->getAuthority($row['DocUserID']);
        // add admin privilege
        if (in_array($row['AP_PCIP'], SYSTEM_CONFIG["ADM_IPS"])) {
            $authority = $authority | AUTHORITY::ADMIN;
        }
        // add chief privilege
        if (in_array($row['AP_PCIP'], SYSTEM_CONFIG["CHIEF_IPS"])) {
            $authority = $authority | AUTHORITY::CHIEF;
        }
        $stm->bindParam(':authority', $authority);
    }

    private function inst(&$row) {
        $stm = $this->db->prepare("
            INSERT INTO user ('id', 'name', 'sex', 'addr', 'tel', 'ext', 'cell', 'unit', 'title', 'work', 'exam', 'education', 'onboard_date', 'offboard_date', 'ip', 'pw_hash', 'authority', 'birthday')
            VALUES (:id, :name, :sex, :addr, :tel, :ext, :cell, :unit, :title, :work, :exam, :education, :onboard_date, :offboard_date, :ip, '827ddd09eba5fdaee4639f30c5b8715d', :authority, :birthday)
        ");
        $this->bindUserParams($stm, $row);
        return $stm->execute() === FALSE ? false : true;
    }

    private function update(&$row) {
        $stm = $this->db->prepare("
            UPDATE user SET
                name = :name,
                sex = :sex,
                addr = :addr,
                tel = :tel,
                ext = :ext,
                cell = :cell,
                unit = :unit,
                title = :title,
                work = :work,
                exam = :exam,
                education = :education,
                onboard_date = :onboard_date, 
                offboard_date = :offboard_date,
                ip = :ip,
                birthday = :birthday,
                authority = :authority
            WHERE id = :id
        ");
        $this->bindUserParams($stm, $row, true);
        return $stm->execute() === FALSE ? false : true;
    }

    private function prepareArray(&$stmt) {
        $result = $stmt->execute();
        $return = [];
        while($row = $result->fetchArray(SQLITE3_ASSOC)) {
            $return[] = $row;
        }
        return $return;
    }

    function __construct() {
        $this->db = new SQLite3(DIMENSION_SQLITE_DB);
    }

    function __destruct() { $this->db->close(); }

    public function import(&$row) {
        if (empty($row['DocUserID'])) {
            global $log;
            $log->warning(__METHOD__.": DocUserID is empty. Import user procedure can not be proceeded.");
            $log->warning(__METHOD__.": ".print_r($row, true));
            return false;
        }
        if ($this->exists($row['DocUserID'])) {
            // update
            return $this->update($row);
        } else {
            // insert
            return $this->inst($row);
        }
    }

    public function getAuthority($id) {
        return  $this->db->querySingle("SELECT authority from user WHERE id = '".trim($id)."'") ?? AUTHORITY::NORMAL;
    }

    public function getOnboardUsers() {
        if($stmt = $this->db->prepare("SELECT * FROM user WHERE offboard_date is NULL or offboard_date = '' ORDER BY id")) {
            return $this->prepareArray($stmt);
        } else {
            global $log;
            $log->error(__METHOD__.": 取得在職使用者資料失敗！");
        }
        return false;
    }

    public function getOffboardUsers() {
        if($stmt = $this->db->prepare("SELECT * FROM user WHERE offboard_date != '' ORDER BY id")) {
            return $this->prepareArray($stmt);
        } else {
            global $log;
            $log->error(__METHOD__.": 取得離職使用者資料失敗！");
        }
        return false;
    }

    public function getAllUsers() {
        if($stmt = $this->db->prepare("SELECT * FROM user ORDER BY id")) {
            return $this->prepareArray($stmt);
        } else {
            global $log;
            $log->error(__METHOD__.": 取得全部使用者資料失敗！");
        }
        return false;
    }

    public function getChiefs() {
        if($stmt = $this->db->prepare("SELECT * FROM user WHERE (offboard_date is NULL OR offboard_date = '') AND authority & :chief_bit ORDER BY id")) {
            $stmt->bindValue(':chief_bit', AUTHORITY::CHIEF, SQLITE3_INTEGER);
            return $this->prepareArray($stmt);
        } else {
            global $log;
            $log->error(__METHOD__.": 取得主管資料失敗！");
        }
        return false;
    }
    public function getChief($unit) {
        if($stmt = $this->db->prepare("SELECT * FROM user WHERE (offboard_date is NULL OR offboard_date = '') AND authority & :chief_bit AND unit = :unit ORDER BY id")) {
            $stmt->bindValue(':chief_bit', AUTHORITY::CHIEF, SQLITE3_INTEGER);
            $stmt->bindParam(':unit', $unit, SQLITE3_TEXT);
            return $this->prepareArray($stmt);
        } else {
            global $log;
            $log->error(__METHOD__.": 取得${unit}主管資料失敗！");
        }
        return false;
    }

    public function getStaffs($unit) {
        if($stmt = $this->db->prepare("SELECT * FROM user WHERE (offboard_date is NULL or offboard_date = '') AND unit = :unit ORDER BY id")) {
            $stmt->bindParam(':unit', $unit, SQLITE3_TEXT);
            return $this->prepareArray($stmt);
        } else {
            global $log;
            $log->error(__METHOD__.": 取得${unit}人員資料失敗！");
        }
        return false;
    }

    public function getTreeData($unit) {
        $chief = $this->getChief($unit)[0];
        $chief['staffs'] = array();
        $staffs = $this->getStaffs($unit);
        foreach ($staffs as $staff) {
            if ($staff['id'] == $chief['id']) continue;
            $chief['staffs'][] = $staff;
        }
        return $chief;
    }

    public function getTopTreeData() {
        $director = $this->getTreeData('主任室');
        $secretary = $this->getTreeData('秘書室');
        $director['staffs'][] = &$secretary;
        $secretary['staffs'][] = $this->getTreeData('登記課');
        $secretary['staffs'][] = $this->getTreeData('測量課');
        $secretary['staffs'][] = $this->getTreeData('地價課');
        $secretary['staffs'][] = $this->getTreeData('行政課');
        $secretary['staffs'][] = $this->getTreeData('資訊課');
        $secretary['staffs'][] = $this->getTreeData('會計室');
        $secretary['staffs'][] = $this->getTreeData('人事室');
        return $director;
    }

    public function getUser($id) {
        if($stmt = $this->db->prepare("SELECT * FROM user WHERE id = :id")) {
            $stmt->bindParam(':id', $id);
            return $this->prepareArray($stmt);
        } else {
            global $log;
            $log->error(__METHOD__.": 取得使用者($id)資料失敗！");
        }
        return false;
        
    }

    public function getUserByName($name) {
        if($stmt = $this->db->prepare("SELECT * FROM user WHERE name = :name")) {
            $stmt->bindParam(':name', $name);
            return $this->prepareArray($stmt);
        } else {
            global $log;
            $log->error(__METHOD__.": 取得使用者($name)資料失敗！");
        }
        return false;
        
    }

    public function getUserByIP($ip) {
        if($stmt = $this->db->prepare("SELECT * FROM user WHERE ip = :ip")) {
            $stmt->bindParam(':ip', $ip);
            return $this->prepareArray($stmt);
        } else {
            global $log;
            $log->error(__METHOD__.": 取得使用者($ip)資料失敗！");
        }
        return false;
        
    }
}
?>
