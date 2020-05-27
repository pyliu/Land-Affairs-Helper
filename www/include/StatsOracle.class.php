<?php
require_once('init.php');
require_once("OraDB.class.php");

class StatsOracle {
    private $db;

    private function checkYearMonth($year_month) {
        global $log;
		    if (empty($year_month) || strlen($year_month) != 5) {
            $log->error(__METHOD__.": $year_month foramt is not correct.");
            return false;
        }
        return true;
    }

    function __construct() {
        $this->db = new OraDB();
    }

    function __destruct() { }

    public function getRefundCount($year_month) {
        if (!$this->checkYearMonth($year_month)) {
            return false;
        }
        $this->db->parse("
            -- 主動申請退費
            SELECT '主動申請退費' AS \"text\", COUNT(*) AS \"count\" FROM MOIEXP.EXPBA t
            WHERE t.BA32 LIKE :bv_cond || '%' and t.BA42 = '01'  --溢繳規費
        ");
        $this->db->bind(":bv_cond", $year_month);
        $this->db->execute();
        return $this->db->fetchAll(true);   // true => fetch raw data instead of converting to UTF-8
    }

    public function getCourtCaseCount($year_month) {
        if (!$this->checkYearMonth($year_month)) {
            return false;
        }
        $this->db->parse("
            -- 法院囑託案件，登記原因為查封(33)、塗銷查封(34)
            SELECT '法院囑託案件' AS \"text\", COUNT(*) AS \"count\"
            FROM MOICAS.CRSMS t
            WHERE t.RM07_1 LIKE :bv_cond || '%'
            AND t.RM09 in ('33', '34')
		    ");
        $this->db->bind(":bv_cond", $year_month);
        $this->db->execute();
        return $this->db->fetchAll(true);   // true => fetch raw data instead of converting to UTF-8
    }

    public function getSurRainCount($year_month) {
        if (!$this->checkYearMonth($year_month)) {
            return false;
        }
        $this->db->parse("
            -- 測量因雨延期
            select '測量因雨延期案件' AS \"text\", COUNT(*) AS \"count\" from SCMSMS t
            left join SCMSDS q on MM01 = MD01 and MM02 = MD02 and MM03 = MD03
            where t.MM04_1 LIKE :bv_cond || '%'
            and MD12 = '1'
		    ");
        $this->db->bind(":bv_cond", $year_month);
        $this->db->execute();
        return $this->db->fetchAll(true);   // true => fetch raw data instead of converting to UTF-8
    }

    public function getRegFixCount($year_month) {
        if (!$this->checkYearMonth($year_month)) {
            return false;
        }
        $this->db->parse("
            -- 補正統計
            SELECT DISTINCT COUNT(*) AS \"count\", '登記補正案件' AS \"text\"
            FROM MOICAS.CRSMS
            WHERE MOICAS.CRSMS.RM07_1 LIKE :bv_cond || '%'
            AND MOICAS.CRSMS.RM51 Is Not Null
            AND MOICAS.CRSMS.RM52 Is Not Null
        ");
        $this->db->bind(":bv_cond", $year_month);
        $this->db->execute();
        return $this->db->fetchAll(true);   // true => fetch raw data instead of converting to UTF-8
    }

    public function getRegRejectCount($year_month) {
        if (!$this->checkYearMonth($year_month)) {
            return false;
        }
        $this->db->parse("
            -- 駁回統計
            SELECT DISTINCT COUNT(*) AS \"count\", '登記駁回案件' AS \"text\"
            FROM MOICAS.CRSMS
            WHERE MOICAS.CRSMS.RM07_1 LIKE :bv_cond || '%'
            AND MOICAS.CRSMS.RM48_1 Is Not Null
            AND MOICAS.CRSMS.RM48_2 Is Not Null
        ");
        $this->db->bind(":bv_cond", $year_month);
        $this->db->execute();
        return $this->db->fetchAll(true);   // true => fetch raw data instead of converting to UTF-8
    }

    public function getRegReasonCount($year_month) {
        if (!$this->checkYearMonth($year_month)) {
            return false;
        }
        $this->db->parse("
            -- 合併 11、分割  06、第一次登記 02、滅失 21、逕為分割 07、遺漏更正 CN、判決共有物分割  35、和解共有物分割 36、調解共有物分割 37
            -- 住址變更 48、拍賣 67、清償 AF、徵收  70、管理機關變更  46
            SELECT t.RM09 AS \"id\", q.kcnt AS \"text\", COUNT(*) AS \"count\"
            FROM MOICAS.CRSMS t
            LEFT JOIN MOICAD.RKEYN q ON q.kcde_1 = '06' AND t.rm09 = q.kcde_2
            WHERE
              t.RM09 in ('11', '06', '02', '21', '07', 'CN', '35', '36', '37', '48', '67', 'AF', '70', '46')
              AND t.RM07_1 LIKE :bv_cond || '%'
            GROUP BY t.RM09, q.kcnt
        ");
        $this->db->bind(":bv_cond", $year_month);
        $this->db->execute();
        return $this->db->fetchAll();   // true => fetch raw data instead of converting to UTF-8
    }

    public function getRegCaseCount($year_month) {
        if (!$this->checkYearMonth($year_month)) {
            return false;
        }
        $this->db->parse("
            SELECT t.RM09 AS \"id\", q.kcnt AS \"text\", COUNT(*) AS \"count\"
            FROM MOICAS.CRSMS t
            LEFT JOIN MOICAD.RKEYN q
            ON q.kcde_1 = '06'
            AND t.rm09 = q.kcde_2
            WHERE t.RM07_1 LIKE :bv_cond || '%'
            GROUP BY t.RM09, q.kcnt
        ");
        $this->db->bind(":bv_cond", $year_month);
        $this->db->execute();
        return $this->db->fetchAll();   // true => fetch raw data instead of converting to UTF-8
    }

    
    public function getRegRemoteCount($year_month) {
        if (!$this->checkYearMonth($year_month)) {
            return false;
        }
        $this->db->parse("
            SELECT
                '遠途先審案件' AS \"text\", COUNT(*) AS \"count\"
            FROM MOICAS.CRSMS t
                LEFT JOIN MOICAD.RLNID u ON t.RM18 = u.LIDN  -- 權利人
                LEFT JOIN MOICAS.CABRP v ON t.RM24 = v.AB01  -- 代理人
                LEFT JOIN MOIADM.RKEYN w ON t.RM09 = w.KCDE_2 AND w.KCDE_1 = '06'   -- 登記原因
            WHERE 
                --t.RM02 = 'HB06' AND 
                t.RM07_1 LIKE :bv_cond || '%' AND 
                (u.LADR NOT LIKE '%桃園市%' AND u.LADR NOT LIKE '%桃園縣%') AND 
                (v.AB03 NOT LIKE '%桃園市%' AND v.AB03 NOT LIKE '%桃園縣%')
        ");
        $this->db->bind(":bv_cond", $year_month);
        $this->db->execute();
        return $this->db->fetchAll(true);   // true => fetch raw data instead of converting to UTF-8
    }
}
?>
