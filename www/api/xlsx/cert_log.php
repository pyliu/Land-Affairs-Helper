<?php
// ini_set("display_errors", 0);
require_once(dirname(dirname(dirname(__FILE__)))."/include/init.php");
require_once(ROOT_DIR."/include/Cache.class.php");
require_once(ROOT_DIR."/include/Query.class.php");
require_once(ROOT_DIR.'/vendor/autoload.php');

$query = new Query();
$cache = new Cache();

$mock = SYSTEM_CONFIG["MOCK_MODE"];
if ($mock) $log->warning("現在處於模擬模式(mock mode)，API僅會回應之前已被快取之最新的資料！【cert_log】");
$query_result = $mock ? $cache->get('cert_log') : $query->getCertLog($_SESSION['section_code'], $_SESSION['numbers']);
if (!$mock) $cache->set('cert_log', $query_result);

$filename = $today.'_'.$_SESSION['section_code'].'_'.implode('_', $_SESSION['numbers']).'.xlsx';

use PhpOffice\PhpSpreadsheet\Spreadsheet;
use PhpOffice\PhpSpreadsheet\Writer\Xlsx;
use PhpOffice\PhpSpreadsheet\IOFactory;

$spreadsheet = IOFactory::load('cert_log_tpl.xlsx');
// $spreadsheet = new Spreadsheet();
$worksheet = $spreadsheet->getActiveSheet();

$init_col_char = 'A';
$row_num = 1;
foreach( array_values($query_result) as $index => $row ) {
    $row_num = $index + 3;  // template has the header and title row, so add 3
    $col_char = 'A';
    foreach( $row as $col ) {
        //$worksheet->getCell(($col_char++).$row_num)->setValue($col);
        // tell PhpSpreadsheet it should be treated as a string
        $worksheet->setCellValueExplicit(
            ($col_char++).$row_num,
            $col,
            \PhpOffice\PhpSpreadsheet\Cell\DataType::TYPE_STRING
        );
    }
}
// $worksheet->getCell('A2')->setValue($_SESSION['type']);
// $worksheet->getCell('B2')->setValue(print_r($_SESSION['numbers'], true));
// $worksheet->getCell('C2')->setValue($_SESSION['section_code']);

// also write a copy to export folder
$writer = new Xlsx($spreadsheet);
$writer->save(ROOT_DIR.'/exports/'.$filename);

ob_end_clean();
header('Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
header('Content-Disposition: attachment;filename="'.$filename.'"');
header('Cache-Control: max-age=0');
//ob_end_clean();

$writer = IOFactory::createWriter($spreadsheet, 'Xlsx');
$writer->save('php://output');
?>