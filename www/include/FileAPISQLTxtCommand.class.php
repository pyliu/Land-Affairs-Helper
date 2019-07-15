<?php
require_once("FileAPICommand.class.php");
require_once("Query.class.php");

class FileAPISQLTxtCommand extends FileAPICommand {
    private $sql;
    function __construct($sql) {
        $this->sql = $sql;
    }

    function __destruct() {}

    private function txt($data, $print_count = true) {
        header("Content-Type: text/txt");
        $out = fopen("php://output", 'w'); 
        if (is_array($data)) {
            $count = 0;
            foreach ($data as $row) {
                //array_walk($row, array($this, "cleanData"));
                $flat_text = implode(",", array_values($row));
                fwrite($out, $flat_text."\n");
                $count++;
            }
            if ($print_count) {
                fwrite($out, mb_convert_encoding("##### TAG #####共產製 ".$count." 筆資料", "big5", "utf-8"));
            }
        } else {
            fwrite($out, mb_convert_encoding("錯誤說明：傳入之參數非陣列格式無法匯出！\n", "big5", "utf-8"));
            fwrite($out, print_r($data, true));
        }
        fclose($out);
    }

    public function execute() {
        $q = new Query();
        // get raw big5 data
        $data = $q->getSelectSQLData($this->sql, true);
        $this->txt($data);
    }
}
?>
