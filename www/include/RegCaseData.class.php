<?php
require_once("init.php");
require_once("OraDB.class.php");

class RegCaseData {
    static private $operators;

    private $row;

    private function getIDorName($id) {
        return empty(RegCaseData::$operators[$id]) ? $id : RegCaseData::$operators[$id];
    }

    private function getDueTime($begin) {
        /*
        // RM27 - 案件辦理期限 (8 hrs a day)
        $days = round($this->row["RM27"] / 8, 0, PHP_ROUND_HALF_DOWN);
        $hours = $this->row["RM27"] % 8;
        $due_in_secs = $hours * 60 * 60 + $days * 24 * 60 * 60;
        // 遇到weekend需加上兩天時間
        if ($days > 0) {
            for ($i = 1; $i <= $days; $i++) {
                $due_date = date("N", $begin + $i * 24 * 60 * 60);
                if ($due_date > 5) {
                    $due_in_secs += 2 * 24 * 60 * 60;
                    break;
                }
            }
        }
        return $due_in_secs;
        */
        // RM29_1 - 限辦日
        $Y = substr($this->row["RM29_1"], 0, 3) + 1911;
        $M = substr($this->row["RM29_1"], 3, 2);
        $D = substr($this->row["RM29_1"], 5, 2);
        // RM29_2 - 限辦時間
        $H = substr($this->row["RM29_2"], 0, 2);
        $i = substr($this->row["RM29_2"], 2, 2);
        $s = substr($this->row["RM29_2"], 4, 2);
        $due_in_secs = mktime($H, $i, $s, $M, $D, $Y);
        return $due_in_secs - $begin;
    }

    private function convertCharset() {
        $convert = array();
        foreach ($this->row as $key=>$value) {
            $convert[$key] = empty($value) ? $value : iconv("big5", "utf-8", $value);
        }
        return $convert;
    }

    function __construct($db_record) {
        $this->row = $db_record;
        if (is_null(RegCaseData::$operators)) {
            RegCaseData::$operators = OraDB::getDBUserList();
        }
    }

    function __destruct() {
        $this->row = null;
    }

    static public function toDate($str) {
        $len = strlen($str);
        if ($len == 7) {
            return substr($str, 0, 3) . "-" . substr($str, 3, 2) . "-" . substr($str, 5, 2);
        } else if ($len == 6) {
            return substr($str, 0, 2) . ":" . substr($str, 2, 2) . ":" . substr($str, 4, 2);
        } else if ($len == 13) {
            return substr($str, 0, 3) . "-" . substr($str, 3, 2) . "-" . substr($str, 5, 2) . " " . substr($str, 7, 2) . ":" . substr($str, 9, 2) . ":" . substr($str, 11, 2);
        }
        return "N/A";
    }

    public function getJsonData($flag = 0) {
        return json_encode($this->convertCharset(), $flag);
    }

    private function getTableHtml() {
        $str = "<table id='case_results' border='1' class='table-hover text-center col-lg-12'>\n";
        $str .= "<thead id='case_table_header'><tr class='header'>".
            "<th id='fixed_th1'>收件字號</th>\n".
            "<th id='fixed_th2'>收件日期</th>\n".
            "<th id='fixed_th3'>限辦</th>\n".
            "<th id='fixed_th4'>辦理情形</th>\n".
            "<th id='fixed_th5'>收件人員</th>\n".
            "<th id='fixed_th6'>作業人員</th>\n".
            "<th id='fixed_th7'>初審人員</th>\n".
            "<th id='fixed_th8'>複審人員</th>\n".
            "<th id='fixed_th9'>准登人員</th>\n".
            "<th id='fixed_th10'>登記人員</th>\n".
            "<th id='fixed_th11'>校對人員</th>\n".
            "<th id='fixed_th12'>結案人員</th>\n".
            "</tr></thead>\n";
        $str .= "<tbody>\n";
        $str .= "<tr class='".$this->getStatusCss()."'>\n";
        $str .= "<td class='text-center px-3 ".($this->isDanger() ? "text-danger" : "")."'>".$this->getReceiveSerial()."</td>\n".
            "<td data-toggle='tooltip'>".$this->getReceiveDate()."</td>\n".
            "<td data-toggle='tooltip' data-placement='right' title='限辦期限：".$this->getDueDate()."'>".$this->getDueHrs()."</td>\n".
            "<td data-toggle='tooltip'>".$this->getStatus()."</td>\n".
            "<td ".$this->getReceptionistTooltipAttr().">".$this->getReceptionist()."</td>\n".
            "<td ".$this->getCurrentOperatorTooltipAttr().">".$this->getCurrentOperator()."</td>\n".
            "<td ".$this->getFirstReviewerTooltipAttr().">".$this->getFirstReviewer()."</td>\n".
            "<td ".$this->getSecondReviewerTooltipAttr().">".$this->getSecondReviewer()."</td>\n".
            "<td ".$this->getPreRegisterTooltipAttr().">".$this->getPreRegister()."</td>\n".
            "<td ".$this->getRegisterTooltipAttr().">".$this->getRegister()."</td>\n".
            "<td ".$this->getCheckerTooltipAttr().">".$this->getChecker()."</td>\n".
            "<td ".$this->getCloserTooltipAttr().">".$this->getCloser()."</td>\n";
        $str .= "</tr>\n";
        $str .= "</tbody>\n";
        $str .= "</table>\n";
        return $str;
    }

    public function getJsonHtmlData($flag = 0) {
        // database charset is big5, so we need to convert it to utf-8 for frontend
        //$row = $this->convertCharset();
        $row = $this->row;
        $result = array(
            "收件字號" => $row["RM01"].$row["RM02"].$row["RM03"],
            "收件時間" => RegCaseData::toDate($row["RM07_1"])." ".RegCaseData::toDate($row["RM07_2"]),
			"登記原因" => $row["KCNT"],
            "限辦期限" => "<span class='".$this->getStatusCss()."'>".$this->getDueDate()."</span>",
            "作業人員" => $this->getCurrentOperator(),
            "辦理情形" => $this->getStatus(),
            "權利人統編" => empty($row["RM18"]) ? "" : $row["RM18"],
            "權利人姓名" => empty($row["RM19"]) ? "" : $row["RM19"],
            "義務人統編" => empty($row["RM21"]) ? "" : $row["RM21"],
            "義務人姓名" => empty($row["RM22"]) ? "" : $row["RM22"],
            "義務人人數" => empty($row["RM23"]) ? "" : $row["RM23"],
            "手機號碼" => empty($row["RM102"]) ? "" : $row["RM102"],
            "代理人統編" => empty($row["RM24"]) ? "" : $row["RM24"],
			"代理人姓名" => empty($row["AB02"]) ? "" : $row["AB02"],
			"段代碼" =>  empty($row["RM11"]) ? "" : $row["RM11"],
			"段小段" =>  empty($row["RM11_CNT"]) ? "" : $row["RM11_CNT"],
            "地號" =>  empty($row["RM12"]) ? "" : substr($row["RM12"], 0, 4)."-".substr($row["RM12"], 4),
            "建號" =>  empty($row["RM15"]) ? "" : substr($row["RM15"], 0, 5)."-".substr($row["RM15"], 5),
            "件數" =>  empty($row["RM32"]) ? "" : $row["RM32"],
            "登記處理註記" => empty(REG_NOTE[$row["RM39"]]) ? "" : REG_NOTE[$row["RM39"]],
            "地價處理註記" => empty(VAL_NOTE[$row["RM42"]]) ? "" : VAL_NOTE[$row["RM42"]],
            "跨所" => $row["RM99"],
            "資料管轄所" => OFFICE[$row["RM100"]],
            "資料收件所" => OFFICE[$row["RM101"]],
            "結案已否" => $row["RM31"],
            "tr_html" => $this->getTableHtml(),
            "raw" => $row
        );
        return json_encode($result, $flag);
    }

    public function isDanger() {
        return empty(REG_WORD[$this->row["RM02"]]);
    }
	
    public function getReceiveSerial() {
        // 收件年+字（代碼）+號（6碼）
        if ($this->isDanger()) {
			return $this->row["RM01"]."年 ".$this->row["RM02"]." 第 ".$this->row["RM03"]." 號";
        }
        return "<strong>".$this->row["RM01"]."</strong>年 ".REG_WORD[$this->row["RM02"]]."(<strong>".$this->row["RM02"]."</strong>)字 第 <strong>".$this->row["RM03"]."</strong> 號";
    }
	
    public function getReceiveDate() {
        return RegCaseData::toDate($this->row["RM07_1"]);
    }

    public function getReceiveTime() {
        return RegCaseData::toDate($this->row["RM07_2"]);
    }

    public function getDueHrs() {
        return str_pad($this->row["RM27"], 2, "0", STR_PAD_LEFT)." ".($this->row["RM27"] > 1 ? "hrs" : "hr");
    }

    public function getDueDate() {
        /*
        // RM07_1 - 收件日
        $Y = substr($this->row["RM07_1"], 0, 3) + 1911;
        $M = substr($this->row["RM07_1"], 3, 2);
        $D = substr($this->row["RM07_1"], 5, 2);
        // RM07_2 - 收件時間
        $H = substr($this->row["RM07_2"], 0, 2);
        $i = substr($this->row["RM07_2"], 2, 2);
        $s = substr($this->row["RM07_2"], 4, 2);

        $begin = mktime($H, $i, $s, $M, $D, $Y);
        $due_in_secs = $begin + $this->getDueTime($begin);
        
        return (date("Y", $due_in_secs) - 1911).date("-m-d H:i:s", $due_in_secs);
        */
        return $this->toDate($this->row["RM29_1"])." ".$this->toDate($this->row["RM29_2"]);
    }

    public function getCaseReason() {
        return $this->row["KCNT"];
    }

    public function getStatus() {
        return CASE_STATUS[$this->row["RM30"]];
    }

    public function getStatusCss() {
        // RM30 - 案件辦理情形
        if ($this->row["RM30"] == "F" || $this->row["RM30"] == "Z"  || $this->row["RM31"] == "A") {
            return "bg-success text-white";
        }
        
        // RM07_1 - 收件日
        $Y = substr($this->row["RM07_1"], 0, 3) + 1911;
        $M = substr($this->row["RM07_1"], 3, 2);
        $D = substr($this->row["RM07_1"], 5, 2);
        // RM07_2 - 收件時間
        $H = substr($this->row["RM07_2"], 0, 2);
        $i = substr($this->row["RM07_2"], 2, 2);
        $s = substr($this->row["RM07_2"], 4, 2);
        
        $now         = mktime();
        $begin       = mktime($H, $i, $s, $M, $D, $Y);
        $due_in_secs = $this->getDueTime($begin);
        
        // overdue
        if ($now - $begin > $due_in_secs) {
            return "bg-danger text-white";
        }
        // reach the due (within 4hrs)
        if ($now - $begin > $due_in_secs - 4 * 60 * 60) {
            return "bg-warning";
        }
    }

    public function getReceptionist() {
        return $this->getIDorName($this->row["RM96"]);
    }

    public function getReceptionistTooltipAttr() {
        return empty($this->row["RM96"]) || $this->row["RM96"] == "XXXXXXXX" ? "" : "data-toggle='tooltip' title='收件人員：".$this->row["RM96"]."'";
    }

    public function getCurrentOperator() {
        return $this->getIDorName($this->row["RM30_1"]);
    }

    public function getCurrentOperatorTooltipAttr() {
        return empty($this->row["RM30_1"]) || $this->row["RM30_1"] == "XXXXXXXX" ? "" : "data-toggle='tooltip' title='作業人員：".$this->row["RM30_1"]."'";
    }

    public function getFirstReviewer() {
        return $this->getIDorName($this->row["RM45"]);
    }

    public function getFirstReviewerTooltipAttr() {
        return empty($this->row["RM45"]) || $this->row["RM45"] == "XXXXXXXX" ? "" : "data-toggle='tooltip' title='初審人員：".$this->row["RM45"]."'";
    }

    public function getSecondReviewer() {
        return $this->getIDorName($this->row["RM47"]);
    }

    public function getSecondReviewerTooltipAttr() {
        return empty($this->row["RM47"]) || $this->row["RM47"] == "XXXXXXXX" ? "" : "data-toggle='tooltip' title='複審人員：".$this->row["RM47"]."'";
    }

    public function getPreRegister() {
        return $this->getIDorName($this->row["RM63"]);
    }

    public function getPreRegisterTooltipAttr() {
        return empty($this->row["RM63"]) || $this->row["RM63"] == "XXXXXXXX" ? "" : "data-toggle='tooltip' title='准登人員：".$this->row["RM63"]."'";
    }

    public function getRegister() {
        return $this->getIDorName($this->row["RM55"]);
    }

    public function getRegisterTooltipAttr() {
        return empty($this->row["RM55"]) || $this->row["RM55"] == "XXXXXXXX" ? "" : "data-toggle='tooltip' title='登記人員：".$this->row["RM55"]."'";
    }

    public function getChecker() {
        return $this->getIDorName($this->row["RM57"]);
    }

    public function getCheckerTooltipAttr() {
        return empty($this->row["RM57"]) || $this->row["RM57"] == "XXXXXXXX" ? "" : "data-toggle='tooltip' title='校對人員：".$this->row["RM57"]."'";
    }

    public function getCloser() {
        return $this->getIDorName($this->row["RM59"]);
    }

    public function getCloserTooltipAttr() {
        return empty($this->row["RM59"]) || $this->row["RM59"] == "XXXXXXXX" ? "" : "data-toggle='tooltip' title='結案人員：".$this->row["RM59"]."'";
    }
}
?>
