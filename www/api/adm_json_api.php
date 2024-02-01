<?php
require_once(dirname(dirname(__FILE__)).DIRECTORY_SEPARATOR."include".DIRECTORY_SEPARATOR."init.php");
require_once(INC_DIR.DIRECTORY_SEPARATOR."Cache.class.php");
require_once(INC_DIR.DIRECTORY_SEPARATOR."System.class.php");
require_once(INC_DIR.DIRECTORY_SEPARATOR."SQLiteAdmReserveFilePDF.class.php");

$cache = Cache::getInstance();
$system = System::getInstance();
$mock = $system->isMockMode();

switch ($_POST["type"]) {
    case "reserve_pdf_list":
        Logger::getInstance()->info("XHR [reserve_pdf_list] get reserve pdf list request.");
        $query = new SQLiteAdmReserveFilePDF();
        $count = 0;
        $result = $query->search($_POST['start_ts'], $_POST['end_ts'], $_POST['keyword']);
		// $result = $mock ? $cache->get('reserve_pdf_list') : $query->getRegForeignerPDF($_POST['start_ts'], $_POST['end_ts'], $_POST['keyword']);
        // $cache->set('reserve_pdf_list', $result);
        $count = count($result);
        $response_code = $result === false ? STATUS_CODE::DEFAULT_FAIL : STATUS_CODE::SUCCESS_NORMAL;
        $message = $response_code === STATUS_CODE::SUCCESS_NORMAL ? "取得 $count 筆檔案應用預約資料" : "無法取得檔案預約資料";
        Logger::getInstance()->info("XHR [reserve_pdf_list] $message");
        echoJSONResponse($message, $response_code, array( "raw" => $result ));
        break;
    case "add_reserve_pdf":
        Logger::getInstance()->info("XHR [add_foreigner_pdf] add foreigner pdf request.");
        $status = STATUS_CODE::DEFAULT_FAIL;
        $message = '未知的失敗';
        $filename = '';
        $tmp_file = '';
        $payload = array();
        if (isset($_FILES['file']['name']) && isset($_FILES['file']['tmp_name'])) {
            $filename = $_FILES['file']['name'];
            $extension = pathinfo($filename, PATHINFO_EXTENSION);
            if (strtoupper($extension) === 'PDF') {
                $tmp_file = $_FILES['file']['tmp_name'];
        
                $payload['year'] = $year = $_POST['year'];
                $payload['number'] = $number = str_pad($_POST['number'], 6, '0', STR_PAD_LEFT);;
                $payload['fid'] = $fid = $_POST['fid'];
                $payload['fname'] = $fname = $_POST['fname'];
                $payload['note'] = $note = $_POST['note'];
        
                // make sure the parent dir has been created
                $parent_dir = UPLOAD_PDF_DIR.DIRECTORY_SEPARATOR.$year;
                if (!file_exists($parent_dir) || !is_dir($parent_dir)) {
                    Logger::getInstance()->info("建立 $parent_dir ...");
                    @mkdir($parent_dir, 0777, true);
                }
                
                $to_file = $parent_dir.DIRECTORY_SEPARATOR.$number."_".$fid."_".$fname.".".$extension;
                $moved = move_uploaded_file($tmp_file, $to_file);
                if ($moved) {
                    // cont. to add database record ...
                    $sqlite_pdf = new SQLiteRegForeignerPDF();
                    $row_id = $sqlite_pdf->add($_POST);
                    $status = $row_id !== false ? STATUS_CODE::SUCCESS_NORMAL : STATUS_CODE::FAIL_DB_ERROR;
                    $message = $status === STATUS_CODE::SUCCESS_NORMAL ? "已新增資料並儲存PDF完成" : "於資料庫新增資料失敗";
                    $payload['file'] = $to_file;
                    $payload['id'] = $row_id;
                } else {    
                    $message = "無法移動上傳檔案 $tmp_file → $to_file";
                    Logger::getInstance()->error(__FILE__.': '.$message);
                }
            } else {
                $message = "檔案不是PDF";
                Logger::getInstance()->error(__FILE__.': 檔案不是PDF。 '.print_r($_FILES, true));
            }
        }
        Logger::getInstance()->info("XHR [add_foreigner_pdf] $message");
        echoJSONResponse($message, $status, array(
            'payload' => $payload
        ));
        break;
    
    case "edit_reserve_pdf":
        Logger::getInstance()->info("XHR [edit_foreigner_pdf] edit foreigner pdf request.");
        
        $status = STATUS_CODE::DEFAULT_FAIL;
        $message = '未知的失敗';

        $payload = array();
        // primary key in DB
        $payload['id'] = $id = $_POST['id'];
        $payload['year'] = $year = $_POST['year'];
        $payload['number'] = $number = str_pad($_POST['number'], 6, '0', STR_PAD_LEFT);;
        $payload['fid'] = $fid = $_POST['fid'];
        $payload['fname'] = $fname = $_POST['fname'];
        $payload['note'] = $note = $_POST['note'];
        $payload['modifytime'] = $modifytime = time();

        $rfpdf = new SQLiteRegForeignerPDF();
        $record = $rfpdf->getOne($id);

        if ($record === false) {
            $status = STATUS_CODE::FAIL_NOT_FOUND;
            $message = "資料庫無法找到資料 ($id)";
        } else {
            $result = $rfpdf->update($_POST);
            if ($result === true) {
                // 更新成功
                $status = STATUS_CODE::SUCCESS_NORMAL;
                $message = "資料庫資料已更新($id)";
                $parent_dir = UPLOAD_PDF_DIR.DIRECTORY_SEPARATOR.$year;
                $orig_file = $parent_dir.DIRECTORY_SEPARATOR.$record['number']."_".$record['fid']."_".$record['fname'].".pdf";
                $new_file = $parent_dir.DIRECTORY_SEPARATOR.$number."_".$fid."_".$fname.".pdf";
                // rename orig file
                $rename_result = @rename($orig_file, $new_file);
                if ($rename_result) {
                    $orig_file = $new_file;
                } else {
                    $log = "更名 ".ltrim($orig_file, $parent_dir.DIRECTORY_SEPARATOR)." 至 ".ltrim($new_file, $parent_dir.DIRECTORY_SEPARATOR)." 失敗";
                    $message .= "-($log)";
                    Logger::getInstance()->error("⚠ $log");
                }

                // handle upload new pdf file
                if (isset($_FILES['file']['name']) && isset($_FILES['file']['tmp_name'])) {
                    // remove orig pdf
                    $unlink_result = @unlink($orig_file);
                    if (!$unlink_result) {
                        $message .= "-(刪除 ".ltrim($orig_file, $parent_dir.DIRECTORY_SEPARATOR)." 檔案失敗)";
                        Logger::getInstance()->error("⚠ 刪除 $orig_file 檔案失敗!");
                    }
                    // move uploaded file
                    $filename = $_FILES['file']['name'];
                    $extension = pathinfo($filename, PATHINFO_EXTENSION);
                    if (strtoupper($extension) === 'PDF') {
                        $tmp_file = $_FILES['file']['tmp_name'];
                        $to_file = $parent_dir.DIRECTORY_SEPARATOR.$number."_".$fid."_".$fname.".".$extension;
                        $moved = move_uploaded_file($tmp_file, $to_file);
                        $message .= $moved ? '-(PDF檔案置換成功)' : '-(PDF檔置換失敗)';
                    }
                }
            } else {
                $status = STATUS_CODE::FAIL_DB_ERROR;
                $message = "更新資料庫失敗 ($id)";
            }
        }
        Logger::getInstance()->info("XHR [edit_foreigner_pdf] $message");
        echoJSONResponse($message, $status, array(
            'payload' => $payload
        ));
        break;
    case "remove_reserve_pdf":
        Logger::getInstance()->info("XHR [remove_foreigner_pdf] remove foreigner pdf request.");
        $id = $_POST['id'];
        $result = $query->removeRegForeignerPDF($id);
        $response_code = $result === false ? STATUS_CODE::DEFAULT_FAIL : STATUS_CODE::SUCCESS_NORMAL;
        $message = $response_code === STATUS_CODE::SUCCESS_NORMAL ? "已刪除外國人PDF資料 ($id)" : "無法刪除外國人PDF資料 ($id)";
        Logger::getInstance()->info("XHR [remove_foreigner_pdf] $message");
        echoJSONResponse($message, $response_code);
        break;
    default:
        Logger::getInstance()->error("不支援的查詢型態【".$_POST["type"]."】");
        echoJSONResponse("不支援的查詢型態【".$_POST["type"]."】", STATUS_CODE::UNSUPPORT_FAIL);
        break;
}
