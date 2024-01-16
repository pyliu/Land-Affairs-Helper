﻿<?php
require_once(dirname(dirname(__FILE__)).DIRECTORY_SEPARATOR."init.php");
require_once(INC_DIR.DIRECTORY_SEPARATOR."Cache.class.php");
require_once(INC_DIR.DIRECTORY_SEPARATOR."System.class.php");
require_once(ROOT_DIR.'/vendor/autoload.php');
require_once("FileAPICommand.class.php");

use PhpOffice\PhpSpreadsheet\Spreadsheet;
use PhpOffice\PhpSpreadsheet\Writer\Xlsx;
use PhpOffice\PhpSpreadsheet\IOFactory;

class FileAPIInheritanceRestrictionXlsxExportCommand extends FileAPICommand {
    public function test() {
        // $spreadsheet = IOFactory::load('test.xlsx');
        // $worksheet = $spreadsheet->getActiveSheet();
        // $worksheet->getCell('A1')->setValue('套用樣板測試');

        $spreadsheet = new Spreadsheet();
        $sheet       = $spreadsheet->getActiveSheet();
        $sheet->setCellValue('A1', '這是第一格');
        $sheet->getCell('A2')->setValue('這是第2格');

        $writer = new Xlsx($spreadsheet);
        $expfile = EXPORT_DIR.DIRECTORY_SEPARATOR.'test.xlsx';
        $writer->save($expfile);
        unset($writer);

        // $writer = new Xlsx($spreadsheet);
        // $writer->save('export/hello world.xlsx');
        ob_end_clean();
        header('Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        // header('Content-Type: application/vnd.ms-excel');
        header('Content-Disposition: attachment;filename="test.xlsx"');
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
        header ('Last-Modified: '.gmdate('D, d M Y H:i:s').' GMT');
        header ('Cache-Control: cache, must-revalidate');
        header ('Pragma: public');
        //ob_end_clean();

        $writer = IOFactory::createWriter($spreadsheet, 'Xlsx');
        $writer->save('php://output');
    }

    private function export(&$spreadsheet, &$params, $title) {
        $spreadsheet->getProperties()
            ->setCreator("地政智慧控管系統")
            ->setLastModifiedBy("地政智慧控管系統")
            ->setTitle("$title 匯出")
            ->setSubject("$title 匯出")
            ->setDescription(
                "document for Office 2007 XLSX, generated by PHPSpreadsheet classes."
            )
            ->setKeywords("office 2007 openxml php xlsx")
            ->setCategory("export");

        $filename = strtoupper($params['site']).'.xlsx';
        Logger::getInstance()->info('寫入 '.$filename);
        $this->write_export_tmp_file($spreadsheet, $filename);
        Logger::getInstance()->info('輸出 RESPONSE STREAM ... ');
        $this->write_php_output($spreadsheet, $filename);
        Logger::getInstance()->info('輸出 RESPONSE STREAM 完成');
    }

    private function style_cell_border(&$worksheet, $from, $to = null) {
        $to = $to ?? $from;
        $worksheet->getStyle($from.':'.$to)->getBorders()->getTop()->setBorderStyle(\PhpOffice\PhpSpreadsheet\Style\Border::BORDER_THIN);
        $worksheet->getStyle($from.':'.$to)->getBorders()->getBottom()->setBorderStyle(\PhpOffice\PhpSpreadsheet\Style\Border::BORDER_THIN);
        $worksheet->getStyle($from.':'.$to)->getBorders()->getLeft()->setBorderStyle(\PhpOffice\PhpSpreadsheet\Style\Border::BORDER_THIN);
        $worksheet->getStyle($from.':'.$to)->getBorders()->getRight()->setBorderStyle(\PhpOffice\PhpSpreadsheet\Style\Border::BORDER_THIN);
    }

    private function style_row_border(&$worksheet, $row_num) {
        foreach (range('A', 'Q') as $column){
            $this->style_cell_border($worksheet, $column.$row_num);
        }
    }

    private function write_foreigner_restriction_xlsx(&$params, $title) {
        $count = count($params['rows']);
        Logger::getInstance()->info($params['is17']);
        Logger::getInstance()->info('查到 '.$count.' 筆資料');
        // construct tpl path
        $tpl = ROOT_DIR.DIRECTORY_SEPARATOR.'assets'.DIRECTORY_SEPARATOR.'xlsx'.DIRECTORY_SEPARATOR.'foreigner_restriction_17'.($params['is17'] ? '' : 'o').'.tpl.xlsx';
        Logger::getInstance()->info('讀取 '.$tpl.' 樣板XLSX');
        $spreadsheet = IOFactory::load($tpl);
        $worksheet = $spreadsheet->getActiveSheet();
        // set office name
        $site = $params['site'];
        switch ($params['site']) {
            case 'HA': $site = '桃園'; break;
            case 'HB': $site = '中壢'; break;
            case 'HC': $site = '大溪'; break;
            case 'HD': $site = '楊梅'; break;
            case 'HE': $site = '蘆竹'; break;
            case 'HF': $site = '八德'; break;
            case 'HG': $site = '平鎮'; break;
            case 'HH': $site = '龜山'; break;
        }
        $worksheet->setCellValueExplicit(
            'A1',
            '桃園市'.$site.'地政事務所',
            \PhpOffice\PhpSpreadsheet\Cell\DataType::TYPE_STRING
        );
        $worksheet->getStyle('A'.($count+5).':Q'.($count+5))->getAlignment()->setWrapText(true);
        /** json data example
         * 編號: "001"
         * 直轄市、(縣)市: "XX"
         * 鄉鎮市區: "XX區"
         * 段小段: "0000"
         * 地號: "0000"
         * 土地使用分區: "XXXX"
         * 面積(平方公尺): "XXXX"
         * 權利範圍: "公同共有 1/1"
         * 所有權人: "XXX"
         * 國籍: "XX"
         * 繼承登記日期及收件字號: "..."
         * 移請國有財產署標售日期及文號: "..."
         * 移轉本國人之登記日期及原則: ""
         * 回復或歸化本國籍日期: ""
         * 備註: "..."
         */
        $row_num = 0;
        foreach( $params['rows'] as $index => $row ) {
            $row_num = $index + 5;  // template has the header and title row, so add 5
            $worksheet->setCellValueExplicit(
                'A'.$row_num,
                $row['編號'],
                \PhpOffice\PhpSpreadsheet\Cell\DataType::TYPE_STRING
            );
            $worksheet->setCellValueExplicit(
                'B'.$row_num,
                $row['直轄市、(縣)市'],
                \PhpOffice\PhpSpreadsheet\Cell\DataType::TYPE_STRING
            );
            $worksheet->setCellValueExplicit(
                'C'.$row_num,
                $row['鄉鎮市區'],
                \PhpOffice\PhpSpreadsheet\Cell\DataType::TYPE_STRING
            );

            $worksheet->mergeCells('D'.$row_num.':'.'E'.$row_num);
            $worksheet->setCellValueExplicit(
                'D'.$row_num,
                $row['段小段'],
                \PhpOffice\PhpSpreadsheet\Cell\DataType::TYPE_STRING
            );
            // $worksheet->setCellValueExplicit(
            //     'E'.$row_num,
            //     $row['小段'],
            //     \PhpOffice\PhpSpreadsheet\Cell\DataType::TYPE_STRING
            // );
            $worksheet->setCellValueExplicit(
                'F'.$row_num,
                $row['地號'],
                \PhpOffice\PhpSpreadsheet\Cell\DataType::TYPE_STRING
            );
            $worksheet->setCellValueExplicit(
                'G'.$row_num,
                $row['土地使用分區'],
                \PhpOffice\PhpSpreadsheet\Cell\DataType::TYPE_STRING
            );
            $worksheet->setCellValueExplicit(
                'H'.$row_num,
                $row['面積(平方公尺)'],
                \PhpOffice\PhpSpreadsheet\Cell\DataType::TYPE_NUMERIC
            );
            $worksheet->setCellValueExplicit(
                'I'.$row_num,
                $row['權利範圍'],
                \PhpOffice\PhpSpreadsheet\Cell\DataType::TYPE_STRING
            );
            $worksheet->setCellValueExplicit(
                'J'.$row_num,
                $row['所有權人'],
                \PhpOffice\PhpSpreadsheet\Cell\DataType::TYPE_STRING
            );
            $worksheet->setCellValueExplicit(
                'K'.$row_num,
                $row['國籍'],
                \PhpOffice\PhpSpreadsheet\Cell\DataType::TYPE_STRING
            );
            $worksheet->setCellValueExplicit(
                'L'.$row_num,
                $row['繼承登記日期及收件字號'],
                \PhpOffice\PhpSpreadsheet\Cell\DataType::TYPE_STRING
            );

            $worksheet->getRowDimension(1)->setRowHeight(
                14.5 * (substr_count($worksheet->getCell('L'.$row_num)->getValue(), "\n") + 1)
            );

            $worksheet->setCellValueExplicit(
                'M'.$row_num,
                $row['移請國有財產署標售日期及文號'],
                \PhpOffice\PhpSpreadsheet\Cell\DataType::TYPE_STRING
            );
            $worksheet->setCellValueExplicit(
                'N'.$row_num,
                $row['移轉本國人之登記日期及原則'],
                \PhpOffice\PhpSpreadsheet\Cell\DataType::TYPE_STRING
            );
            $worksheet->setCellValueExplicit(
                'O'.$row_num,
                $row['回復或歸化本國籍日期'],
                \PhpOffice\PhpSpreadsheet\Cell\DataType::TYPE_STRING
            );
            $worksheet->setCellValueExplicit(
                'P'.$row_num,
                $row['備註'],
                \PhpOffice\PhpSpreadsheet\Cell\DataType::TYPE_STRING
            );
            $worksheet->setCellValueExplicit(
                'Q'.$row_num,
                $params['is17'] ? '3' : '5',
                \PhpOffice\PhpSpreadsheet\Cell\DataType::TYPE_NUMERIC
            );
            $this->style_row_border($worksheet, $row_num);
            // row auto height
            $worksheet->getRowDimension($row_num)->setRowHeight(-1);
        }
        // write last signature row
        $row_num += 1;
        $worksheet->mergeCells('A'.$row_num.':'.'Q'.$row_num);
        $worksheet->setCellValueExplicit(
            'A'.$row_num,
            '填表人                              '.
            '登記課長                            '.
            '秘書                                '.
            '主任                                ',
            \PhpOffice\PhpSpreadsheet\Cell\DataType::TYPE_STRING
        );
        $worksheet->getRowDimension($row_num)->setRowHeight(30);
        $worksheet->getStyle('A'.$row_num)
            ->getAlignment()->setHorizontal(\PhpOffice\PhpSpreadsheet\Style\Alignment::HORIZONTAL_CENTER);
        $worksheet->getStyle('A'.$row_num)
            ->getAlignment()->setVertical(\PhpOffice\PhpSpreadsheet\Style\Alignment::VERTICAL_CENTER);

        $this->export($spreadsheet, $params, $title);
    }

    function __construct() {
        // https://phpspreadsheet.readthedocs.io/en/latest/topics/recipes/#write-a-newline-character-n-in-a-cell-altenter
        // AdvancedValuebinder.php automatically turns on "wrap text" for the cell when it sees a newline character in a string that you are inserting in a cell. Just like Microsoft Office Excel.
        \PhpOffice\PhpSpreadsheet\Cell\Cell::setValueBinder( new \PhpOffice\PhpSpreadsheet\Cell\AdvancedValueBinder() );
    }

    function __destruct() {}

    public function execute() {
        // title
        $title = $_POST['is17'] === 'true' ? '土地法第17條第1項規定管制清冊' : '土地法第17條第1項各款以外規定管制清冊';
        Logger::getInstance()->info($title);
        // Logger::getInstance()->info(print_r($_POST, true));
        $params = array(
            "rows" => $_POST['jsons'],
            "site" => $_POST['site'],
            "is17" => $_POST['is17'] === 'true'
        );
        // execute command here
        $this->write_foreigner_restriction_xlsx($params, $title);
    }
}
