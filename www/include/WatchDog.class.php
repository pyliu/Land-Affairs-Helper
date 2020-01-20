<?php
require_once('include/init.php');
require_once('include/Query.class.php');
require_once('include/Message.class.php');

class WatchDog {
    
    private function checkCrossSiteData() {
        global $log;
        $query = new Query();
        // check reg case missing RM99~RM101 data
        $log->info('開始跨所註記遺失檢查 ... ');
        $rows = $query->getProblematicCrossCases();
        if (!empty($rows)) {
            $log->warning('找到'.count($rows).'件跨所註記遺失！');
            $case_ids = [];
            foreach ($rows as $row) {
                $case_ids[] = $row['RM01'].'-'.$row['RM02'].'-'.$row['RM03'];
                $log->warning($row['RM01'].'-'.$row['RM02'].'-'.$row['RM03']);
            }
            
            $host_ip = getLocalhostIP();
            $msg = new Message();
            $content = "系統目前找到下列跨所註記遺失案件:\r\n\r\n".implode("\r\n", $case_ids)."\r\n\r\n請前往 http://$host_ip/watch_dog.php 修正。";
            foreach (SYSTEM_CONFIG['ADM_IPS'] as $adm_ip) {
                if ($adm_ip == '::1') {
                    continue;
                }
                $sn = $msg->send('跨所案件註記遺失通知', $content, $adm_ip, "+14 minute");
                $log->info("訊息已送出(${sn})給 ${adm_ip}");
            }
        }
        $log->info('跨所註記遺失檢查結束。');
    }

    private function findDelayRegCases() {
        global $log;
        $query = new Query();
        // check reg case missing RM99~RM101 data
        $log->info('開始查詢目前逾期登記案件 ... ');

        $tw_date = new Datetime("now");
        $tw_date->modify("-1911 year");
        $today = ltrim($tw_date->format("Ymd"), "0");	// ex: 1080325

        $rows = $query->queryOverdueCasesByDate($today);
        if (!empty($rows)) {
            $log->warning($today.' 目前找到'.count($rows).'件逾期登記案件。');
            $case_ids = [];
            foreach ($rows as $row) {
                $case_ids[] = $row['RM01'].'-'.$row['RM02'].'-'.$row['RM03'];
                $log->warning($row['RM01'].'-'.$row['RM02'].'-'.$row['RM03']);
            }
            
            $host_ip = getLocalhostIP();
            $msg = new Message();
            $content = "地政輔助系統目前找到下列逾期登記案件:\r\n\r\n".implode("\r\n", $case_ids)."\r\n\r\n請前往 http://".$host_ip."/index.php 查看詳情。";
            foreach (SYSTEM_CONFIG['ADM_IPS'] as $adm_ip) {
                /*if ($adm_ip == '::1') {
                    continue;
                }*/
                if ($adm_ip != '220.1.35.48') {
                    continue;
                }
                $sn = $msg->send('跨所案件註記遺失通知', $content, $adm_ip, "+14 minute");
                $log->info("訊息已送出(${sn})給 ${adm_ip}");
            }
        }
        $log->info('查詢目前逾期登記案件完成。');
    }

    function __construct() { }

    function __destruct() { }

    public function do() {
        $this->checkCrossSiteData();
        //$this->findDelayRegCases();
        return true;
    }
    
}
?>
