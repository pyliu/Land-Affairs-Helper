<?php
require_once("init.php");
require_once("OraDB.class.php");

class LXHWEB {
    private $db;

    function __construct($conn_type = CONNECTION_TYPE::L3HWEB) {
        $this->db = new OraDB($conn_type);
    }

    function __destruct() {
        $this->db->close();
        $this->db = null;
    }
    /**
     * 各所同步異動更新時間
     */
    public function querySiteUpdateTime($site = '') {
        $prefix = "
            SELECT
                SUBSTR(sowner, 3, 2) AS SITE,
                TO_CHAR(min(snaptime), 'yyyy-mm-dd hh24:mi:ss') as UPDATE_DATETIME
            FROM sys.snap_reftime$
        ";
        $where = "";
        if (!empty($site) && 2 == strlen($site)) {
            $site = strtoupper($site);
            $where = " WHERE SUBSTR(sowner, 3, 2) = '".strtoupper($site)."' ";
        }
        $postfix = "
            GROUP BY sowner
            ORDER BY SITE, UPDATE_DATETIME
        ";
        $this->db->parse($prefix.$where.$postfix);
		$this->db->execute();
		return $this->db->fetchAll();
    }
    /**
     * 查詢各所表格更新時間
     */
    
    public function queryTableUpdateTime($site = '') {
        $prefix = "
            SELECT 
                SUBSTR(sowner, 3, 2) AS \"所別\",
                vname AS \"表格\",
                TO_CHAR(snaptime, 'yyyy-mm-dd hh24:mi:ss') as \"更新時間\"
            FROM sys.snap_reftime$
        ";
        $where = "";
        if (!empty($site) && 2 == strlen($site)) {
            $site = strtoupper($site);
            $where = " WHERE SUBSTR(sowner, 3, 2) = '".strtoupper($site)."' ";
        }
        $postfix = "
            ORDER BY \"所別\", \"更新時間\"
        ";
        $this->db->parse($prefix.$where.$postfix);
		$this->db->execute();
		return $this->db->fetchAll();
    }
    /**
     * 查詢是否有BROKEN狀態之TABLE
     */
    public function queryBrokenTable() {
        $sql = "
            SELECT
                SUBSTR(rowner, 3, 2) AS \"所別\",
                rname AS \"表格名稱\",
                broken AS \"損毀狀態\"
            FROM dba_refresh
            WHERE broken = 'Y'
            ORDER BY \"所別\", \"表格名稱\"
        ";
        $this->db->parse($sql);
		$this->db->execute();
		return $this->db->fetchAll();
    }
}