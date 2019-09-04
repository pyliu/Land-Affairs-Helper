<?php
require_once("FileAPICommand.class.php");
require_once("Query.class.php");

class FileAPISQLCsvCommand extends FileAPICommand {
    private $sql;
    function __construct($sql) {
        $this->sql = $sql;
        // parent class has $colsNameMapping var for translating column header
        $this->colsNameMapping = include("Config.ColsNameMapping.CRSMS.php");
        $this->colsNameMapping += include("Config.ColsNameMapping.CMSMS.php");
        $this->colsNameMapping += include("Config.ColsNameMapping.CMSDS.php");
        $this->colsNameMapping += include("Config.ColsNameMapping.CABRP.php");
        $this->colsNameMapping += include("Config.ColsNameMapping.EXPAA.php");
        $this->colsNameMapping += include("Config.ColsNameMapping.EXPAB.php");
        $this->colsNameMapping += include("Config.ColsNameMapping.EXPAC.php");
        $this->colsNameMapping += include("Config.ColsNameMapping.EXPBA.php");
        $this->colsNameMapping += include("Config.ColsNameMapping.EXPBB.php");
        $this->colsNameMapping += include("Config.ColsNameMapping.EXPCA.php");
        $this->colsNameMapping += include("Config.ColsNameMapping.EXPCB.php");
        $this->colsNameMapping += include("Config.ColsNameMapping.EXPCC.php");
        $this->colsNameMapping += include("Config.ColsNameMapping.EXPD.php");
        $this->colsNameMapping += include("Config.ColsNameMapping.EXPE.php");
        $this->colsNameMapping += include("Config.ColsNameMapping.EXPF.php");
        $this->colsNameMapping += include("Config.ColsNameMapping.EXPG.php");
        $this->colsNameMapping += include("Config.ColsNameMapping.RKEYN.php"); 
        $this->colsNameMapping += include("Config.ColsNameMapping.RLNID.php");
        $this->colsNameMapping += include("Config.ColsNameMapping.PSCRN.php");
        $this->colsNameMapping += include("Config.ColsNameMapping.OTHERS.php");
    }

    function __destruct() {}

    private function outputCSV($data, $skip_header = false) {
        header("Content-Type: text/csv");
        $out = fopen("php://output", 'w'); 
        if (is_array($data)) {
            $firstline_flag = false;
            foreach ($data as $row) {
                if (!$skip_header && !$firstline_flag) {
                    if (!is_array($row)) {
                        fputcsv($out, array_values(array(iconv("utf-8", "big5", "錯誤說明"))), ',', '"');
                        fputcsv($out, array_values(array(iconv("utf-8", "big5", "第一列的資料非陣列，無法轉換為CSV檔案"))), ',', '"');
                        break;
                    }
                    $firstline = array_map(array($this, "mapColumns"), array_keys($row));
                    //$firstline = array_map("self::mapColumns", array_keys($row));
                    fputcsv($out, $firstline, ',', '"');
                    $firstline_flag = true;
                }
                fputcsv($out, array_values($row), ',', '"');
            }
        } else {
            fputcsv($out, array_values(array(iconv("utf-8", "big5", "錯誤說明"))), ',', '"');
            fputcsv($out, array_values(array(iconv("utf-8", "big5", "傳入之參數非陣列格式無法匯出！"))), ',', '"');
        }
        fclose($out);
    }

    public function execute() {
        $q = new Query();
        // get raw big5 data for file output
        $data = $q->getSelectSQLData($this->sql, true);
        $this->outputCSV($data);
    }
}
?>
