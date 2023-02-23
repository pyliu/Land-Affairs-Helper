<?php
require_once('init.php');
require_once('SQLiteDBFactory.class.php');

class SQLiteRegForeignerPDF {
    private $db;

    private function prepareArray(&$stmt) {
        $result = $stmt->execute();
        $return = [];
        while($row = $result->fetchArray(SQLITE3_ASSOC)) {
            $return[] = $row;
        }
        return $return;
    }

    function __construct() {
        $this->db = new SQLite3(SQLiteDBFactory::getRegForeignerPDFDB());
        $this->db->exec("PRAGMA cache_size = 100000");
        $this->db->exec("PRAGMA temp_store = MEMORY");
        $this->db->exec("BEGIN TRANSACTION");
    }

    function __destruct() {
        $this->db->exec("END TRANSACTION");
        $this->db->close();
    }

    public function getLastInsertedId() {
        return $this->db->lastInsertRowID();
    }

    public function exists($year, $number, $fid) {
        return $this->db->querySingle("SELECT id from reg_foreigner_pdf WHERE year = '$year' and number = '$number' and fid = '$fid'");
    }

    public function get($st, $ed, $keyword = '') {
        $st_date = date("Y-m-d", $st);
        $ed_date = date("Y-m-d", $ed);
        Logger::getInstance()->info(__METHOD__.": 搜尋 $st_date ~ $ed_date 區間資料，關鍵字: $keyword");
        $result = array();
        if (empty($keyword)) {
            if($stmt = $this->db->prepare('SELECT * from reg_foreigner_pdf WHERE createtime BETWEEN :bv_createtime_st AND :bv_createtime_ed')) {
                $stmt->bindParam(':bv_createtime_st', $st);
                $stmt->bindParam(':bv_createtime_ed', $ed);
                $result = $this->prepareArray($stmt);
            } else {
                Logger::getInstance()->error(__METHOD__.": 無法取得 $st_date ~ $ed_date 資料！ (".SQLiteDBFactory::getRegForeignerPDFDB().")");
            }
        } else {
            if($stmt = $this->db->prepare('SELECT * from reg_foreigner_pdf WHERE createtime BETWEEN :bv_createtime_st AND :bv_createtime_ed AND (note LIKE :bv_keyword OR fname LIKE :bv_keyword OR fid LIKE :bv_keyword)')) {
                $stmt->bindParam(':bv_createtime_st', $st);
                $stmt->bindParam(':bv_createtime_ed', $ed);
                $stmt->bindValue(':bv_keyword', "%$keyword%");
                $result = $this->prepareArray($stmt);
            } else {
                Logger::getInstance()->error(__METHOD__.": 無法取得 $st_date ~ $ed_date 內含 %$keyword% 資料！ (".SQLiteDBFactory::getRegForeignerPDFDB().")");
            }
        }
        return $result;
    }

    public function add($post) {
        $id = $this->exists($post['year'], $post['number'], $post['fid']);
        if ($id) {
            Logger::getInstance()->warning(__METHOD__.": 外國人資料已存在，將更新它。(id: $id)");
            $post['id'] = $id;
            return $this->update($post);
        } else {
            $stm = $this->db->prepare("
                INSERT INTO reg_foreigner_pdf ('year', 'number', 'fid', 'fname', 'note', 'createtime', 'modifytime')
                VALUES (:year, :number, :fid, :fname, :note, :createtime, :modifytime)
            ");
            $stm->bindParam(':year', $post['year']);
            $stm->bindValue(':number', str_pad($post['number'], 6, '0', STR_PAD_LEFT));
            $stm->bindParam(':fid', $post['fid']);
            $stm->bindParam(':fname', $post['fname']);
            $stm->bindParam(':note', $post['note']);
            $stm->bindValue(':createtime', time());
            $stm->bindValue(':modifytime', time());

            return $stm->execute() === FALSE ? false : $this->getLastInsertedId();
        }
        return false;
    }

    public function update($post) {
        $id = $post['id'];
        $year = $post['year'];
        $number = $post['number'];
        $fid = $post['fid'];
        Logger::getInstance()->warning(__METHOD__.": 更新外國人資料。(id: $id, year: $year, number: $number, fid: $fid)");
        $stm = $this->db->prepare("UPDATE reg_foreigner_pdf SET year = :year, number = :number, fid = :fid, fname = :fname, note = :note, modifytime = :modifytime WHERE id = :id");
        $stm->bindParam(':id', $id);
        $stm->bindParam(':year', $year);
        $stm->bindParam(':number', str_pad($number, 6, '0', STR_PAD_LEFT));
        $stm->bindParam(':fid', $fid);
        $stm->bindParam(':fname', $post['fname']);
        $stm->bindParam(':note', $post['note']);
        $stm->bindValue(':modifytime', time());
        return $stm->execute() !== FALSE;
    }

    public function delete($params) {
        if (is_array($params)) {
            $year = $params['year'];
            $number = $params['number'];
            $fid = $params['fid'];
            $stm = $this->db->prepare("DELETE FROM reg_foreigner_pdf WHERE year = :year and number = :number and fid = :fid");
            $stm->bindParam(':year', $year);
            $stm->bindParam(':number', $number);
            $stm->bindParam(':fid', $fid);
            return $stm->execute() !== FALSE;
        } else {
            // not array, treat it as string
            $id = $params;
            $stm = $this->db->prepare("DELETE FROM reg_foreigner_pdf WHERE id = :id");
            $stm->bindParam(':id', $id);
            return $stm->execute() !== FALSE;
        }
    }
}
