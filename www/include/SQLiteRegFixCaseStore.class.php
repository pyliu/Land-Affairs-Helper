<?php
require_once('init.php');
require_once('SQLiteDBFactory.class.php');
require_once('System.class.php');

class SQLiteRegFixCaseStore {
    private $db;

    private function bindParams(&$stm, &$row) {
        if ($stm === false) {
            Logger::getInstance()->error(__METHOD__.": bindUserParams because of \$stm is false.");
            return false;
        }

        $stm->bindParam(':case_no', $row['case_no']);
        $stm->bindParam(':notify_delivered_date', $row['notify_delivered_date']);
        $stm->bindParam(':note', $row['note']);

        return true;
    }

    private function replace(&$row) {
        $stm = $this->db->prepare("
            REPLACE INTO reg_fix_case_store ('case_no', 'notify_delivered_date', 'note')
            VALUES (:case_no, :notify_delivered_date, :note)
        ");
        if ($this->bindParams($stm, $row)) {
            return $stm->execute() === FALSE ? false : true;
        }
        return false;
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
        $this->db = new SQLite3(SQLiteDBFactory::getRegFixCaseStoreDB());
        $this->db->exec("PRAGMA cache_size = 100000");
        $this->db->exec("PRAGMA temp_store = MEMORY");
        $this->db->exec("BEGIN TRANSACTION");
    }

    function __destruct() {
        $this->db->exec("END TRANSACTION");
        $this->db->close();
    }

    public function exists($case_no) {
        $ret = $this->db->querySingle("SELECT case_no from reg_fix_case_store WHERE case_no = '".trim($case_no)."'");
        return !empty($ret);
    }

    public function getRegFixCaseRecord($case_no) {
        if($stmt = $this->db->prepare('SELECT * from reg_fix_case_store WHERE case_no = :bv_case_no')) {
            $stmt->bindParam(':bv_case_no', $case_no);
            return $this->prepareArray($stmt);
        } else {
            Logger::getInstance()->error(__METHOD__.": 取得 $case_no 補正紀錄資料失敗！ (".SQLiteDBFactory::getRegFixCaseStoreDB().")");
        }
        return false;
    }
}
