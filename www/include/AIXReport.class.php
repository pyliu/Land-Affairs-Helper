<?php
require_once("init.php");
require_once("OraDB.class.php");

class AIXReport {
    private $db;

    function __construct() {
        $this->db = new OraDB();
    }

    function __destruct() {
        $this->db = null;
    }
    /**
     * AI00701 - 建物標示部資料
     */
    public function getAI00701($start_sec, $end_sec, $st_num = "00000000", $end_num = "99999999") {
        $this->db->parse("
            SELECT 
                LPAD(DD45, 1, ' ') ||
                LPAD(DD46, 2, '0') ||
                LPAD(DD48, 4, '0') ||
                LPAD(DD49, 8, ' ') ||
                LPAD(DD05, 7, ' ') ||
                LPAD(DD06, 2, ' ') ||
                LPAD(DD08*100, 8, ' ') ||
                RPAD(CASE
                    WHEN DD09 IS NULL THEN ' '
                    WHEN DD09 = '' THEN ' '
                    ELSE DD09
                END, 60, ' ') ||
                LPAD(DD11, 1, ' ') ||
                LPAD(DD12, 2, ' ') ||
                LPAD(DD13, 3 , '0') ||
                LPAD(DD16, 7, ' ') AS AI00701 FROM SRDBID
            WHERE (DD48 || DD49 between :bv_st and :bv_ed)
            ORDER BY DD48, DD49
        ");
        // padding ex: 036200000000
        $this->db->bind(":bv_st", str_pad($start_sec, 4, "0", STR_PAD_LEFT).$st_num);
        // padding ex: 0363999999999
		$this->db->bind(":bv_ed", str_pad($end_sec, 4, "0", STR_PAD_LEFT).$end_num);
		$this->db->execute();
		return $this->db->fetchAll();
    }
}
?>
