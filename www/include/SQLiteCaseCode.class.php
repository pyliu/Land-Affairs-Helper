<?php
require_once('init.php');
require_once('System.class.php');
require_once('SQLiteDBFactory.class.php');

class SQLiteCaseCode {
    private $db;

    private function bindParams(&$stm, &$row) {
        if ($stm === false) {
            Logger::getInstance()->error(__METHOD__.": bindUserParams because of \$stm is false.");
            return;
        }

        $stm->bindParam(':id', $row['KCDE_2']);
        $stm->bindParam(':name', $row['KCNT']);
        $stm->bindValue(':attr', $row['KRMK']);
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
        $db_path = SQLiteDBFactory::getCaseCodeDB();
        $this->db = new SQLite3($db_path);
        $this->db->exec("PRAGMA cache_size = 100000");
        $this->db->exec("PRAGMA temp_store = MEMORY");
        $this->db->exec("BEGIN TRANSACTION");
    }

    function __destruct() {
        $this->db->exec("END TRANSACTION");
        $this->db->close();
    }

    public function exists($id) {
        $ret = $this->db->querySingle("SELECT KCDE_2 from CaseCode WHERE KCDE_2 = '".trim($id)."'");
        return !empty($ret);
    }

    public function clean() {
        $stm = $this->db->prepare(" DELETE FROM CaseCode");
        return $stm->execute() === FALSE ? false : true;
    }

    public function replace(&$row) {
        $stm = $this->db->prepare("
            REPLACE INTO CaseCode ('KCDE_2', 'KCNT', 'KRMK')
            VALUES (:id, :name, :attr)
        ");
        $this->bindParams($stm, $row);
        return $stm->execute() === FALSE ? false : true;
    }

    // TODO: get various code by KRMK ..
}
