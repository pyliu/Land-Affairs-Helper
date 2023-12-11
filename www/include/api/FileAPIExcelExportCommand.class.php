﻿<?php
require_once(dirname(dirname(__FILE__)).DIRECTORY_SEPARATOR."init.php");
require_once(INC_DIR.DIRECTORY_SEPARATOR."Cache.class.php");
require_once(INC_DIR.DIRECTORY_SEPARATOR."Query.class.php");
require_once(INC_DIR.DIRECTORY_SEPARATOR."System.class.php");
require_once(INC_DIR.DIRECTORY_SEPARATOR."RegCaseData.class.php");
require_once(INC_DIR.DIRECTORY_SEPARATOR."SQLiteUser.class.php");
require_once(ROOT_DIR.'/vendor/autoload.php');
require_once("FileAPICommand.class.php");

use PhpOffice\PhpSpreadsheet\Spreadsheet;
use PhpOffice\PhpSpreadsheet\Writer\Xlsx;
use PhpOffice\PhpSpreadsheet\IOFactory;

class FileAPIExcelExportCommand extends FileAPICommand {
    private $query;
    private $cache;
    private $mock_mode;
    private $type;

    private function test() {
        // $spreadsheet = IOFactory::load('test.xlsx');
        // $worksheet = $spreadsheet->getActiveSheet();
        // $worksheet->getCell('A1')->setValue('套用樣板測試');

        $spreadsheet = new Spreadsheet();
        $sheet       = $spreadsheet->getActiveSheet();
        $sheet->setCellValue('A1', '這是第一格');
        $sheet->getCell('A2')->setValue('這是第2格');

        $writer = new Xlsx($spreadsheet);
        $expfile = EXPORT_DIR.DIRECTORY_SEPARATOR.$this->filename.'.xlsx';
        $writer->save($expfile);
        unset($writer);

        // $writer = new Xlsx($spreadsheet);
        // $writer->save('export/hello world.xlsx');
        ob_end_clean();
        header('Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        // header('Content-Type: application/vnd.ms-excel');
        header('Content-Disposition: attachment;filename="'.$this->filename.'.xlsx"');
        header('Cache-control: no-cache, pre-check=0, post-check=0, max-age=0');
        // https://stackoverflow.com/questions/34381816/phpexcel-return-a-corrupted-file
        // need to add this line to prevent corrupted file
        ob_end_clean();

        $writer = IOFactory::createWriter(IOFactory::load($expfile), 'Xlsx');
        $writer->save('php://output');
        // $writer = IOFactory::createWriter($spreadsheet, 'Xlsx');
        // $writer->save('php://output');
        // readfile($expfile);
    }

    private function write_export_tmp_file(&$spreadsheet, $filename = 'tmp.xlsx') {
        // also write a copy to export folder
        $writer = new Xlsx($spreadsheet);
        $writer->save(EXPORT_DIR.DIRECTORY_SEPARATOR.$filename);
        //zipExports();
    }

    private function write_php_output(&$spreadsheet, $filename = 'tmp.xlsx') {
        ob_end_clean();
        header('Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        header('Content-Disposition: attachment;filename="'.$filename.'"');
        header('Cache-Control: max-age=0');
        //ob_end_clean();

        $writer = IOFactory::createWriter($spreadsheet, 'Xlsx');
        $writer->save('php://output');
    }

    private function write_col_data(&$worksheet, &$rows) {
        $row_num = 1;
        foreach( array_values($rows) as $index => $row ) {
            $row_num = $index + 3;  // template has the header and title row, so add 3
            $col_char = 'A';
            foreach( $row as $col ) {
                // tell PhpSpreadsheet it should be treated as a string
                $worksheet->setCellValueExplicit(
                    ($col_char++).$row_num,
                    $col,
                    \PhpOffice\PhpSpreadsheet\Cell\DataType::TYPE_STRING
                );
            }
        }
    }

    private function write_meta_output(&$spreadsheet, &$xlsx_item, $title, $filename = '') {
        global $today;
        if (empty($xlsx_item["query_month"])) {
			$xlsx_item["query_month"] = substr($today, 0, 5);
        }
        $spreadsheet->getProperties()
            ->setCreator("地政智慧控管系統")
            ->setLastModifiedBy("地政智慧控管系統")
            ->setTitle("地政系統WEB版 $title 匯出")
            ->setSubject("地政系統WEB版 $title 匯出")
            ->setDescription(
                "document for Office 2007 XLSX, generated by PHPSpreadsheet classes."
            )
            ->setKeywords("office 2007 openxml php xlsx")
            ->setCategory("export");

        $filename = empty($filename) ? $today.'_'.$xlsx_item["query_month"].'_'.$xlsx_item['text'].'.xlsx' : $filename;
        $this->write_export_tmp_file($spreadsheet, $filename);
        $this->write_php_output($spreadsheet, $filename);
    }

    private function write_reg_case_xlsx(&$rows, &$xlsx_item, $title) {
        // from init.php
        global $today;

        Logger::getInstance()->info('查到 '.count($rows).' 筆資料');
        $baked = [];
        foreach ($rows as $row) {
            $data = new RegCaseData($row);
            $baked[] = $data->getBakedData();
        }

        $spreadsheet = IOFactory::load($xlsx_item['tpl']);
        $worksheet = $spreadsheet->getActiveSheet();
        $row_num = 1;
        foreach( $baked as $index => $row ) {
            $row_num = $index + 3;  // template has the header and title row, so add 3
            $worksheet->setCellValueExplicit(
                'A'.$row_num,
                $row['收件字號'],
                \PhpOffice\PhpSpreadsheet\Cell\DataType::TYPE_STRING
            );
            $worksheet->setCellValueExplicit(
                'B'.$row_num,
                $row['收件時間'],
                \PhpOffice\PhpSpreadsheet\Cell\DataType::TYPE_STRING
            );
            $worksheet->setCellValueExplicit(
                'C'.$row_num,
                $row['登記原因'],
                \PhpOffice\PhpSpreadsheet\Cell\DataType::TYPE_STRING
            );
            $worksheet->setCellValueExplicit(
                'D'.$row_num,
                $row['辦理情形'],
                \PhpOffice\PhpSpreadsheet\Cell\DataType::TYPE_STRING
            );
            $worksheet->setCellValueExplicit(
                'E'.$row_num,
                $row['收件人員'],
                \PhpOffice\PhpSpreadsheet\Cell\DataType::TYPE_STRING
            );
            $worksheet->setCellValueExplicit(
                'F'.$row_num,
                $row['作業人員'],
                \PhpOffice\PhpSpreadsheet\Cell\DataType::TYPE_STRING
            );
            $worksheet->setCellValueExplicit(
                'G'.$row_num,
                $row['初審人員'],
                \PhpOffice\PhpSpreadsheet\Cell\DataType::TYPE_STRING
            );
            $worksheet->setCellValueExplicit(
                'H'.$row_num,
                $row['複審人員'],
                \PhpOffice\PhpSpreadsheet\Cell\DataType::TYPE_STRING
            );
            $worksheet->setCellValueExplicit(
                'I'.$row_num,
                $row['准登人員'],
                \PhpOffice\PhpSpreadsheet\Cell\DataType::TYPE_STRING
            );
            $worksheet->setCellValueExplicit(
                'J'.$row_num,
                $row['登錄人員'],
                \PhpOffice\PhpSpreadsheet\Cell\DataType::TYPE_STRING
            );
            $worksheet->setCellValueExplicit(
                'K'.$row_num,
                $row['校對人員'],
                \PhpOffice\PhpSpreadsheet\Cell\DataType::TYPE_STRING
            );
            $worksheet->setCellValueExplicit(
                'L'.$row_num,
                $row['結案人員'],
                \PhpOffice\PhpSpreadsheet\Cell\DataType::TYPE_STRING
            );
            $worksheet->setCellValueExplicit(
                'M'.$row_num,
                $row['結案狀態'],
                \PhpOffice\PhpSpreadsheet\Cell\DataType::TYPE_STRING
            );
        }
        $this->write_meta_output($spreadsheet, $xlsx_item, $title);
    }

    private function stats_export_reg_reason(&$xlsx_item) {
        // from init.php
        global $log, $today;
        
        if (empty($xlsx_item["query_month"])) {
			$xlsx_item["query_month"] = substr($today, 0, 5);
        }
        
		$reason_code = $xlsx_item['id'];
		$query_month = $xlsx_item['query_month'];
		Logger::getInstance()->info("匯出登記案件 BY MONTH【 $reason_code, $query_month 】");
		$rows = $this->mock_mode ? $this->cache->get('reg_reason_cases_by_month') : $this->query->queryReasonCasesByMonth($reason_code, $query_month);
        if (!$this->mock_mode) $this->cache->set('reg_reason_cases_by_month', $rows);
        
        $xlsx_item['tpl'] = ROOT_DIR.'/assets/xlsx/stats_reg_reason.xl.tpl.xlsx';
        $this->write_reg_case_xlsx($rows, $xlsx_item, "每月登記案件");
    }

    private function stats_export_reg_fix(&$xlsx_item) {
        global $log, $today;

        if (empty($xlsx_item["query_month"])) {
			$xlsx_item["query_month"] = substr($today, 0, 5);
        }
        
        $query_month = $xlsx_item["query_month"];
		Logger::getInstance()->info("匯出登記補正案件 BY MONTH【 $query_month 】");
		$rows = $this->mock_mode ? $this->cache->get('reg_fix_cases_by_month') : $this->query->queryFixCasesByMonth($query_month);
		if (!$this->mock_mode) $this->cache->set('reg_fix_cases_by_month', $rows);
        
        $xlsx_item['tpl'] = ROOT_DIR.'/assets/xlsx/stats_reg_fix.tpl.xlsx';
        $this->write_reg_case_xlsx($rows, $xlsx_item, "每月登記補正案件");
    }

    private function stats_export_reg_reject(&$xlsx_item) {
        global $log, $today;

        if (empty($xlsx_item["query_month"])) {
			$xlsx_item["query_month"] = substr($today, 0, 5);
        }
        
        $query_month = $xlsx_item["query_month"];
		Logger::getInstance()->info("匯出登記駁回案件 BY MONTH【 $query_month 】");
		$rows = $this->mock_mode ? $this->cache->get('reg_reject_cases_by_month') : $this->query->queryRejectCasesByMonth($query_month);
		if (!$this->mock_mode) $this->cache->set('reg_reject_cases_by_month', $rows);

        $xlsx_item['tpl'] = ROOT_DIR.'/assets/xlsx/stats_reg_reject.tpl.xlsx';
        $this->write_reg_case_xlsx($rows, $xlsx_item, "每月登記駁回案件");
    }

    private function stats_export_court(&$xlsx_item) {
        global $log, $today;

        if (empty($xlsx_item["query_month"])) {
			$xlsx_item["query_month"] = substr($today, 0, 5);
        }
        
        $query_month = $xlsx_item["query_month"];
		Logger::getInstance()->info("匯出登記法院囑託案件 BY MONTH【 $query_month 】");
		$rows = $this->mock_mode ? $this->cache->get('reg_court_cases_by_month') : $this->query->queryCourtCasesByMonth($query_month);
		if (!$this->mock_mode) $this->cache->set('reg_court_cases_by_month', $rows);

        $xlsx_item['tpl'] = ROOT_DIR.'/assets/xlsx/stats_court.tpl.xlsx';
        $this->write_reg_case_xlsx($rows, $xlsx_item, "每月登記法院囑託案件");
    }

    private function stats_export_reg_subcase(&$xlsx_item) {
        // from init.php
        global $log, $today;
        if (empty($xlsx_item["query_month"])) {
			$xlsx_item["query_month"] = substr($today, 0, 5);
        }
        
        $query_month = $xlsx_item["query_month"];
		Logger::getInstance()->info("匯出本所處理跨所子號案件 BY MONTH【 $query_month 】");
		$rows = $this->mock_mode ? $this->cache->get('reg_subcases_by_month') : $this->query->queryRegSubCasesByMonth($query_month);
		if (!$this->mock_mode) $this->cache->set('reg_subcases_by_month', $rows);
        
        Logger::getInstance()->info('查到 '.count($rows).' 筆資料');
        
        $spreadsheet = IOFactory::load(ROOT_DIR.'/assets/xlsx/stats_reg_subcase.tpl.xlsx');
        $worksheet = $spreadsheet->getActiveSheet();

        $this->write_col_data($worksheet, $rows);
        $this->write_meta_output($spreadsheet, $xlsx_item, "每月本所處理跨所子號案件");
    }

    private function stats_export_reg_remote(&$xlsx_item) {
        // from init.php
        global $log, $today;
        if (empty($xlsx_item["query_month"])) {
			$xlsx_item["query_month"] = substr($today, 0, 5);
        }
        
        $query_month = $xlsx_item["query_month"];
		Logger::getInstance()->info("匯出遠途先審案件 BY MONTH【 $query_month 】");
		$rows = $this->mock_mode ? $this->cache->get('reg_remote_cases_by_month') : $this->query->queryRegRemoteCasesByMonth($query_month);
		if (!$this->mock_mode) $this->cache->set('reg_remote_cases_by_month', $rows);
        
        Logger::getInstance()->info('查到 '.count($rows).' 筆資料');
        
        $spreadsheet = IOFactory::load(ROOT_DIR.'/assets/xlsx/stats_reg_remote.tpl.xlsx');
        $worksheet = $spreadsheet->getActiveSheet();

        $this->write_col_data($worksheet, $rows);
        $this->write_meta_output($spreadsheet, $xlsx_item, "每月遠途先審案件");
    }

    private function stats_export_regf(&$xlsx_item) {
        // from init.php
        global $log, $today;
        if (empty($xlsx_item["query_month"])) {
			$xlsx_item["query_month"] = substr($today, 0, 5);
        }
        
        $query_month = $xlsx_item["query_month"];
		Logger::getInstance()->info("匯出外國人地權登記統計檔 BY MONTH【 $query_month 】");
		$rows = $this->mock_mode ? $this->cache->get('regf_by_month') : $this->query->queryRegfCasesByMonth($query_month);
		if (!$this->mock_mode) $this->cache->set('regf_by_month', $rows);
        
        Logger::getInstance()->info('查到 '.count($rows).' 筆資料');
        
        $spreadsheet = IOFactory::load(ROOT_DIR.'/assets/xlsx/stats_regf.tpl.xlsx');
        $worksheet = $spreadsheet->getActiveSheet();

        $this->write_col_data($worksheet, $rows);
        $this->write_meta_output($spreadsheet, $xlsx_item, "每月外國人地權登記統計檔");
    }

    private function stats_export_sur_rain(&$xlsx_item) {
        // from init.php
        global $log, $today;
        if (empty($xlsx_item["query_month"])) {
			$xlsx_item["query_month"] = substr($today, 0, 5);
        }
        
        $query_month = $xlsx_item["query_month"];
		Logger::getInstance()->info("匯出測量因雨延期案件 BY MONTH【 $query_month 】");
		$rows = $this->mock_mode ? $this->cache->get('sur_rain_cases_by_month') : $this->query->querySurRainCasesByMonth($query_month);
		if (!$this->mock_mode) $this->cache->set('sur_rain_cases_by_month', $rows);
        
        Logger::getInstance()->info('查到 '.count($rows).' 筆資料');
        
        $spreadsheet = IOFactory::load(ROOT_DIR.'/assets/xlsx/stats_sur_rain.tpl.xlsx');
        $worksheet = $spreadsheet->getActiveSheet();

        $this->write_col_data($worksheet, $rows);
        $this->write_meta_output($spreadsheet, $xlsx_item, "每月測量因雨延期案件");
    }

    private function stats_export_refund(&$xlsx_item) {
        // from init.php
        global $log, $today;
        if (empty($xlsx_item["query_month"])) {
			$xlsx_item["query_month"] = substr($today, 0, 5);
        }
        
        $query_month = $xlsx_item["query_month"];
		Logger::getInstance()->info("匯出退費案件 BY MONTH【 $query_month 】");
		$rows = $this->mock_mode ? $this->cache->get('expba_refund_cases_by_month') : $this->query->queryEXPBARefundCasesByMonth($query_month);
		if (!$this->mock_mode) $this->cache->set('expba_refund_cases_by_month', $rows);
        
        Logger::getInstance()->info('查到 '.count($rows).' 筆資料');
        
        $spreadsheet = IOFactory::load(ROOT_DIR.'/assets/xlsx/stats_refund.tpl.xlsx');
        $worksheet = $spreadsheet->getActiveSheet();

        $this->write_col_data($worksheet, $rows);
        $this->write_meta_output($spreadsheet, $xlsx_item, "每月退費案件");
    }

    private function stats_export_factory() {
        // $_SESSION['xlsx_item'] => Array ( [query_month] => 10907 [id] => 67 [text] => 拍賣 [count] => 21 [category] => stats_reg_reason )
        $type = $_SESSION["xlsx_item"]["category"];
        switch ($type) {
            case "stats_reg_reason":
                $this->stats_export_reg_reason($_SESSION["xlsx_item"]);
                break;
            case "stats_reg_subcase":
                $this->stats_export_reg_subcase($_SESSION["xlsx_item"]);
                break;
            case "stats_reg_remote":
                $this->stats_export_reg_remote($_SESSION["xlsx_item"]);
                break;
            case "stats_regf":
                $this->stats_export_regf($_SESSION["xlsx_item"]);
                break;
            case "stats_reg_fix":
                $this->stats_export_reg_fix($_SESSION["xlsx_item"]);
                break;
            case "stats_reg_reject":
                $this->stats_export_reg_reject($_SESSION["xlsx_item"]);
                break;
            case "stats_sur_rain":
                $this->stats_export_sur_rain($_SESSION["xlsx_item"]);
                break;
            case "stats_refund":
                $this->stats_export_refund($_SESSION["xlsx_item"]);
                break;
            case "stats_court":
                $this->stats_export_court($_SESSION["xlsx_item"]);
                break;
            default:
                echo "<span style='color: red; font-weight: bold;'>※</span> 不支援的統計資料型態。【 $type 】";
                Logger::getInstance()->warning(__METHOD__.":不支援的統計資料型態。【 $type 】");
        }
    }

    private function cert_log() {
        // from init.php
        global $log, $today;

        if ($this->mock_mode) Logger::getInstance()->warning("現在處於模擬模式(mock mode)，API僅會回應之前已被快取之最新的資料！【cert_log】");
        $query_result = $this->mock_mode ? $this->cache->get('cert_log') : $this->query->getCertLog($_SESSION['section_code'], $_SESSION['numbers']);
        if (!$this->mock_mode) $this->cache->set('cert_log', $query_result);

        $spreadsheet = IOFactory::load(XLSX_TPL_DIR.DIRECTORY_SEPARATOR.'cert_log.tpl.xlsx');
        // $spreadsheet = new Spreadsheet();
        $worksheet = $spreadsheet->getActiveSheet();

        $this->write_col_data($worksheet, $query_result);
        $filename = $today.'_'.$_SESSION['section_code'].'_'.implode('_', $_SESSION['numbers']).'.xlsx';
        $xlsx_item = array('text' => '謄本LOG檔');
        $this->write_meta_output($spreadsheet, $xlsx_item, "謄本LOG檔", $filename);
    }

    private function all_user_export() {
        // from init.php
        global $log, $today;

        $sqlite_user = new SQLiteUser();
        $all_users = $sqlite_user->getAllUsers() ?? [];

        Logger::getInstance()->info(__METHOD__.': 找到 '.count($all_users).' 個使用者。');

        $spreadsheet = IOFactory::load(XLSX_TPL_DIR.DIRECTORY_SEPARATOR.'user_export.tpl.xlsx');
        $worksheet = $spreadsheet->getActiveSheet();

        function delete_array_col(&$array, $key) {
            return array_walk($array, function (&$v) use ($key) {
                unset($v[$key]);
            });
        }

        delete_array_col($all_users, 'pw_hash');
        delete_array_col($all_users, 'authority');

        function convert_sex_col(&$array, $key = 'sex') {
            return array_walk($array, function (&$v) use ($key) {
                $v[$key] = $v[$key] == 0 ? '女' : '男';
            });
        }

        convert_sex_col($all_users);

        $this->write_col_data($worksheet, $all_users);
        
        $system = System::getInstance();
        $site = $system->get('SITE');
        $filename = $today.'_'.$site.'_users.xlsx';

        $xlsx_item = array('text' => "$site 使用者列表");
        $this->write_meta_output($spreadsheet, $xlsx_item, "$site 使用者列表", $filename);
    }

    function __construct() {
        $this->query = new Query();
        $this->cache = Cache::getInstance();
        $this->type = $_SESSION['xlsx_type'] ?? $_REQUEST['type'] ?? false;
        $system = System::getInstance();
        $this->mock_mode = $system->isMockMode();
    }

    function __destruct() {}

    public function execute() {
        // factory method here
        switch($this->type) {
            case 'cert_log':
                $this->cert_log();
                break;
            case 'stats_export':
                $this->stats_export_factory();
                break;
            case 'all_users_export':
                $this->all_user_export();
                break;
            default:
                Logger::getInstance()->error('xlsx_type is not set, can not output xlsx file! ['.$this->type.', '.print_r($_SESSION, true).']');
                break;
        }
    }
}
