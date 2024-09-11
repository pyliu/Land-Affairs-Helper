<?php
require_once(dirname(dirname(__FILE__))."/include/init.php");
require_once(INC_DIR."/Cache.class.php");
require_once(INC_DIR."/System.class.php");
require_once(INC_DIR."/XCase.class.php");

$xcase = new XCase();
$cache = Cache::getInstance();
$system = System::getInstance();
$mock = $system->isMockMode();

switch ($_POST["type"]) {
	case "diff_xcase":
		Logger::getInstance()->info("XHR [diff_xcase] 查詢同步案件資料【".$_POST["id"]."】請求");
		$rows = $mock ? $cache->get('diff_xcase') : $xcase->getXCaseDiff($_POST["id"]);
		$cache->set('diff_xcase', $rows);
		if ($rows === -1) {
			Logger::getInstance()->warning("XHR [diff_xcase] 參數格式錯誤【".$_POST["id"]."】");
			echoJSONResponse("參數格式錯誤【".$_POST["id"]."】");
		} else if ($rows === -2) {
			Logger::getInstance()->warning("XHR [diff_xcase] 遠端查無資料【".$_POST["id"]."】");
			echoJSONResponse("遠端查無資料【".$_POST["id"]."】", STATUS_CODE::FAIL_WITH_REMOTE_NO_RECORD);
		} else if ($rows === -3) {
			Logger::getInstance()->warning("XHR [diff_xcase] 本地查無資料【".$_POST["id"]."】");
			echoJSONResponse("本地查無資料【".$_POST["id"]."】", STATUS_CODE::FAIL_WITH_LOCAL_NO_RECORD);
		} else if (is_array($rows) && empty($rows)) {
			Logger::getInstance()->info("XHR [diff_xcase] 遠端資料與本所一致【".$_POST["id"]."】");
			echoJSONResponse("遠端資料與本所一致【".$_POST["id"]."】");
		} else {
			$result = array(
				"status" => STATUS_CODE::SUCCESS_NORMAL,
				"data_count" => count($rows),
				"query_string" => "id=".$_POST["id"],
				"raw" => $rows
			);
			Logger::getInstance()->info("XHR [diff_xcase] 比對成功");
			echo json_encode($result, 0);
		}
		break;
	case "inst_xcase":
		Logger::getInstance()->info("XHR [inst_xcase] 插入遠端案件【".$_POST["id"]."】請求");
		$result_flag = $mock ? $cache->get('inst_xcase') : $xcase->instXCase($_POST["id"]);
		$cache->set('inst_xcase', $result_flag);
		if ($result_flag === true) {
			$result = array(
				"status" => STATUS_CODE::SUCCESS_NORMAL,
				"data_count" => "0",
				"raw" => $result_flag
			);
			Logger::getInstance()->info("XHR [inst_xcase] 新增成功");
			echo json_encode($result, 0);
		} else if ($result_flag === -1) {
			Logger::getInstance()->error("XHR [inst_xcase] 傳入ID錯誤，新增失敗【".$_POST["id"]."】");
			echoJSONResponse("傳入ID錯誤，新增失敗【".$_POST["id"]."】");
		} else if ($result_flag === -2) {
			Logger::getInstance()->error("XHR [inst_xcase] 遠端無案件資料，新增失敗【".$_POST["id"]."】");
			echoJSONResponse("遠端無案件資料，新增失敗【".$_POST["id"]."】");
		} else {
			Logger::getInstance()->error("XHR [inst_xcase] 新增失敗【".$_POST["id"]."】");
			echoJSONResponse("新增失敗【".$_POST["id"]."】");
		}
		break;
	case "sync_xcase":
		Logger::getInstance()->info("XHR [sync_xcase] 同步遠端案件【".$_POST["id"]."】請求");
		$result_flag = $mock ? $cache->get('sync_xcase') : $xcase->syncXCase($_POST["id"]);
		$cache->set('sync_xcase', $result_flag);
		if ($result_flag) {
			$result = array(
				"status" => STATUS_CODE::SUCCESS_NORMAL,
				"data_count" => "0",
				"raw" => $result_flag
			);
			Logger::getInstance()->info("XHR [sync_xcase] 同步成功【".$_POST["id"]."】");
			echo json_encode($result, 0);
		} else {
			Logger::getInstance()->error("XHR [sync_xcase] 同步失敗【".$_POST["id"]."】");
			echoJSONResponse("同步失敗【".$_POST["id"]."】");
		}
		break;
	case "sync_xcase_column":
		Logger::getInstance()->info("XHR [sync_xcase_column] 同步遠端案件之特定欄位【".$_POST["id"].", ".$_POST["column"]."】請求");
		$result_flag = $mock ? $cache->get('sync_xcase_column') : $xcase->syncXCaseColumn($_POST["id"], $_POST["column"]);
		$cache->set('sync_xcase_column', $result_flag);
		if ($result_flag) {
			$result = array(
				"status" => STATUS_CODE::SUCCESS_NORMAL,
				"data_count" => "0",
				"raw" => $result_flag
			);
			Logger::getInstance()->info("XHR [sync_xcase_column] 同步成功【".$_POST["id"].", ".$_POST["column"]."】");
			echo json_encode($result, 0);
		} else {
			Logger::getInstance()->error("XHR [sync_xcase_column] 同步失敗【".$_POST["id"].", ".$_POST["column"]."】");
			echoJSONResponse("同步失敗【".$_POST["id"].", ".$_POST["column"]."】");
		}
		break;
	case "sync_xcase_fix_data":
		Logger::getInstance()->info("XHR [sync_xcase_fix_data] 同步遠端案件之補正資料【".$_POST["id"]."】請求");
		$xcase = new XCase();
		$response = $mock ? $cache->get('sync_xcase_fix_data') : $xcase->syncXCaseFixData($_POST["id"]);
		$cache->set('sync_xcase_fix_data', $response);
		if ($response !== false) {
			Logger::getInstance()->info("XHR [sync_xcase_fix_data] 同步補正資料成功【".$_POST["id"]."】");
			echoJSONResponse("同步補正資料成功【".$_POST["id"]."】", STATUS_CODE::SUCCESS_NORMAL, array(
				"raw" => mb_convert_encoding($response, 'UTF-8', 'BIG-5')
			));
		} else {
			Logger::getInstance()->error("XHR [sync_xcase_fix_data] 同步補正資料失敗【".$_POST["id"]."】");
			echoJSONResponse("同步補正資料失敗【".$_POST["id"]."】");
		}
		break;
	default:
		Logger::getInstance()->error("不支援的查詢型態【".$_POST["type"]."】");
		echoJSONResponse("不支援的查詢型態【".$_POST["type"]."】", STATUS_CODE::UNSUPPORT_FAIL);
		break;
}
