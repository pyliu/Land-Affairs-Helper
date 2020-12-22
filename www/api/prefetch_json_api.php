<?php
require_once(dirname(dirname(__FILE__))."/include/init.php");
require_once(INC_DIR."/Prefetch.class.php");
require_once(INC_DIR."/RegCaseData.class.php");

$prefetch = new Prefetch();

switch ($_POST["type"]) {
	case "overdue_reg_cases":
		$log->info("XHR [overdue_reg_cases] 近15天逾期案件查詢請求");
		$rows = $_POST['reload'] === 'false' ? $prefetch->getOverdueCaseIn15Days() : $prefetch->reloadOverdueCaseIn15Days();
		if (empty($rows)) {
			$log->info("XHR [overdue_reg_cases] 近15天查無逾期資料");
			echoJSONResponse("15天內查無逾期資料", STATUS_CODE::SUCCESS_WITH_NO_RECORD, array(
				"items" => array(),
				"items_by_id" => array(),
				"data_count" => 0,
				"raw" => $rows,
				'cache_remaining_time' => $prefetch->getOverdueCaseCacheRemainingTime()
			));
		} else {
			$items = [];
			$items_by_id = [];
			foreach ($rows as $row) {
				$regdata = new RegCaseData($row);
				$this_item = array(
					"收件字號" => $regdata->getReceiveSerial(),
					"登記原因" => $regdata->getCaseReason(),
					"辦理情形" => $regdata->getStatus(),
					"收件時間" => $regdata->getReceiveDate()." ".$regdata->getReceiveTime(),
					"限辦期限" => $regdata->getDueDate(),
					"初審人員" => $regdata->getFirstReviewer() . " " . $regdata->getFirstReviewerID(),
					"作業人員" => $regdata->getCurrentOperator()
				);
				$items[] = $this_item;
				$items_by_id[$regdata->getFirstReviewerID()][] = $this_item;
			}
			$log->info("XHR [overdue_reg_cases] 近15天找到".count($items)."件逾期案件");
			echoJSONResponse("近15天找到".count($items)."件逾期案件", STATUS_CODE::SUCCESS_NORMAL, array(
				"items" => $items,
				"items_by_id" => $items_by_id,
				"data_count" => count($items),
				"raw" => $rows,
				'cache_remaining_time' => $prefetch->getOverdueCaseCacheRemainingTime()
			));
		}
		break;
	case "almost_overdue_reg_cases":
		$log->info("XHR [almost_overdue_reg_cases] 即將逾期案件查詢請求");
		$rows = $_POST['reload'] === 'false' ? $prefetch->getAlmostOverdueCase() : $prefetch->reloadAlmostOverdueCase();
		if (empty($rows)) {
			$log->info("XHR [almost_overdue_reg_cases] 近4小時內查無即將逾期資料");
			echoJSONResponse("近4小時內查無即將逾期資料", STATUS_CODE::SUCCESS_WITH_NO_RECORD, array(
				"items" => array(),
				"items_by_id" => array(),
				"data_count" => 0,
				"raw" => $rows,
				'cache_remaining_time' => $prefetch->getAlmostOverdueCaseCacheRemainingTime()
			));
		} else {
			$items = [];
			$items_by_id = [];
			foreach ($rows as $row) {
				$regdata = new RegCaseData($row);
				$this_item = array(
					"收件字號" => $regdata->getReceiveSerial(),
					"登記原因" => $regdata->getCaseReason(),
					"辦理情形" => $regdata->getStatus(),
					"收件時間" => $regdata->getReceiveDate()." ".$regdata->getReceiveTime(),
					"限辦期限" => $regdata->getDueDate(),
					"初審人員" => $regdata->getFirstReviewer() . " " . $regdata->getFirstReviewerID(),
					"作業人員" => $regdata->getCurrentOperator()
				);
				$items[] = $this_item;
				$items_by_id[$regdata->getFirstReviewerID()][] = $this_item;
			}
			$log->info("XHR [almost_overdue_reg_cases] 近4小時內找到".count($items)."件即將逾期案件");
			echoJSONResponse("近4小時內找到".count($items)."件即將逾期案件", STATUS_CODE::SUCCESS_NORMAL, array(
				"items" => $items,
				"items_by_id" => $items_by_id,
				"data_count" => count($items),
				"raw" => $rows,
				'cache_remaining_time' => $prefetch->getAlmostOverdueCaseCacheRemainingTime()
			));
		}
		break;
	case "reg_rm30_H_case":
		$log->info("XHR [reg_rm30_H_case] 查詢登記公告中案件請求");
		$rows = $_POST['reload'] === 'false' ? $prefetch->getRM30HCase() : $prefetch->reloadRM30HCase();
		if (empty($rows)) {
			$log->info("XHR [reg_rm30_H_case] 查無資料");
			echoJSONResponse('查無公告中案件');
		} else {
			$total = count($rows);
			$log->info("XHR [reg_rm30_H_case] 查詢成功($total)");
			$baked = array();
			foreach ($rows as $row) {
				$data = new RegCaseData($row);
				$baked[] = $data->getBakedData();
			}
			echoJSONResponse("查詢成功，找到 $total 筆公告中資料。", STATUS_CODE::SUCCESS_WITH_MULTIPLE_RECORDS, array(
				'data_count' => $total,
				'baked' => $baked,
				'cache_remaining_time' => $prefetch->getRM30HCaseCacheRemainingTime()
			));
		}
		break;
	case "reg_cancel_ask_case":
		$log->info("XHR [reg_cancel_ask_case] 查詢取消請示案件請求");
		$rows = $_POST['reload'] === 'false' ? $prefetch->getAskCase() : $prefetch->reloadAskCase();
		if (empty($rows)) {
			$log->info("XHR [reg_cancel_ask_case] 查無資料");
			echoJSONResponse('查無取消請示案件');
		} else {
			$total = count($rows);
			$log->info("XHR [reg_cancel_ask_case] 查詢成功($total)");
			$baked = array();
			foreach ($rows as $row) {
				$data = new RegCaseData($row);
				$baked[] = $data->getBakedData();
			}
			echoJSONResponse("查詢成功，找到 $total 筆請示中資料。", STATUS_CODE::SUCCESS_WITH_MULTIPLE_RECORDS, array(
				"data_count" => $total,
				"baked" => $baked,
				'cache_remaining_time' => $prefetch->getAskCaseCacheRemainingTime()
			));
		}
		break;
	case "reg_trust_case":
		$log->info("XHR [reg_trust_case] 查詢取消請示案件請求");
		if ($_POST['query'] === 'E') {
			// 建物所有權部資料
			$rows = $_POST['reload'] === 'false' ? $prefetch->getTrustRebow($_POST['year']) : $prefetch->reloadTrustRebow($_POST['year']);
			$cache_remaining = $prefetch->getTrustRebowCacheRemainingTime($_POST['year']);
		} else if ($_POST['query'] === 'B') {
			// 土地所有權部資料
			$rows = $_POST['reload'] === 'false' ? $prefetch->getTrustRblow($_POST['year']) : $prefetch->reloadTrustRblow($_POST['year']);
			$cache_remaining = $prefetch->getTrustRblowCacheRemainingTime($_POST['year']);
		} else if ($_POST['query'] === 'TE') {
			// 建物所有權部例外資料
			$rows = $_POST['reload'] === 'false' ? $prefetch->getTrustRebowException($_POST['year']) : $prefetch->reloadTrustRebowException($_POST['year']);
			$cache_remaining = $prefetch->getTrustRebowExceptionCacheRemainingTime($_POST['year']);
		} else if ($_POST['query'] === 'TB') {
			// 土地所有權部例外資料
			$rows = $_POST['reload'] === 'false' ? $prefetch->getTrustRblowException($_POST['year']) : $prefetch->reloadTrustRblowException($_POST['year']);
			$cache_remaining = $prefetch->getTrustRblowExceptionCacheRemainingTime($_POST['year']);
		}
		if (empty($rows)) {
			$log->info("XHR [reg_trust_case] 查無資料");
			echoJSONResponse('查無信託註記資料');
		} else {
			$total = count($rows);
			$log->info("XHR [reg_trust_case] 查詢成功($total)");
			echoJSONResponse("查詢成功，找到 $total 筆信託註記資料。", STATUS_CODE::SUCCESS_WITH_MULTIPLE_RECORDS, array(
				"data_count" => $total,
				"raw" => $rows,
				'cache_remaining_time' => $cache_remaining
			));
		}
		break;
	default:
		$log->error("不支援的查詢型態【".$_POST["type"]."】");
		echoJSONResponse("不支援的查詢型態【".$_POST["type"]."】", STATUS_CODE::UNSUPPORT_FAIL);
		break;
}