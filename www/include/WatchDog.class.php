<?php
require_once(dirname(dirname(__FILE__)).DIRECTORY_SEPARATOR.'include'.DIRECTORY_SEPARATOR.'init.php');
require_once(INC_DIR.DIRECTORY_SEPARATOR.'Query.class.php');
require_once(INC_DIR.DIRECTORY_SEPARATOR.'Prefetch.class.php');
require_once(INC_DIR.DIRECTORY_SEPARATOR.'Message.class.php');
require_once(INC_DIR.DIRECTORY_SEPARATOR.'Notification.class.php');
require_once(INC_DIR.DIRECTORY_SEPARATOR.'StatsSQLite.class.php');
require_once(INC_DIR.DIRECTORY_SEPARATOR.'Temperature.class.php');
require_once(INC_DIR.DIRECTORY_SEPARATOR.'SQLiteUser.class.php');
require_once(INC_DIR.DIRECTORY_SEPARATOR.'System.class.php');
require_once(INC_DIR.DIRECTORY_SEPARATOR.'Cache.class.php');
require_once(INC_DIR.DIRECTORY_SEPARATOR.'LXHWEB.class.php');

class WatchDog {
    private $stats = null;
    private $host_ip = '';
    private $date = '';
    private $time = '';

    private $schedule = array(
        "office" => [
            'Sun' => [],
            'Mon' => ['07:30 AM' => '05:30 PM'],
            'Tue' => ['07:30 AM' => '05:30 PM'],
            'Wed' => ['07:30 AM' => '05:30 PM'],
            'Thu' => ['07:30 AM' => '05:30 PM'],
            'Fri' => ['07:30 AM' => '05:30 PM'],
            'Sat' => ['07:30 AM' => '05:30 PM']
        ],
        "overdue" => [
            'Sun' => [],
            'Mon' => ['08:50 AM' => '09:05 AM', '01:50 PM' => '02:05 PM'],
            'Tue' => ['08:50 AM' => '09:05 AM', '01:50 PM' => '02:05 PM'],
            'Wed' => ['08:50 AM' => '09:05 AM', '01:50 PM' => '02:05 PM'],
            'Thu' => ['08:50 AM' => '09:05 AM', '01:50 PM' => '02:05 PM'],
            'Fri' => ['08:50 AM' => '09:05 AM', '01:50 PM' => '02:05 PM'],
            'Sat' => []
        ],
        "temperature" => [
            'Sun' => [],
            'Mon' => ['10:35 AM' => '10:50 AM'],
            'Tue' => ['10:35 AM' => '10:50 AM'],
            'Wed' => ['10:35 AM' => '10:50 AM'],
            'Thu' => ['10:35 AM' => '10:50 AM'],
            'Fri' => ['10:35 AM' => '10:50 AM'],
            'Sat' => []
        ],
        "once_a_day" => [
            'Sun' => [],
            'Mon' => ['08:50 AM' => '09:05 AM'],
            'Tue' => ['08:50 AM' => '09:05 AM'],
            'Wed' => ['08:50 AM' => '09:05 AM'],
            'Thu' => ['08:50 AM' => '09:05 AM'],
            'Fri' => ['08:50 AM' => '09:05 AM'],
            'Sat' => []
        ],
        "twice_a_day" => [
            'Sun' => [],
            'Mon' => ['08:50 AM' => '09:05 AM', '01:50 PM' => '02:05 PM'],
            'Tue' => ['08:50 AM' => '09:05 AM', '01:50 PM' => '02:05 PM'],
            'Wed' => ['08:50 AM' => '09:05 AM', '01:50 PM' => '02:05 PM'],
            'Thu' => ['08:50 AM' => '09:05 AM', '01:50 PM' => '02:05 PM'],
            'Fri' => ['08:50 AM' => '09:05 AM', '01:50 PM' => '02:05 PM'],
            'Sat' => []
        ],
        "test" => [
            'Sun' => [],
            'Mon' => ['00:00 AM' => '11:59 PM'],
            'Tue' => ['00:00 AM' => '11:59 PM'],
            'Wed' => ['00:00 AM' => '11:59 PM'],
            'Thu' => ['00:00 AM' => '11:59 PM'],
            'Fri' => ['00:00 AM' => '11:59 PM'],
            'Sat' => []
        ]
    );

    private function isOfficeHours() {
        Logger::getInstance()->info("檢查是否處於上班時間 ... ");
        $result = $this->isOn($this->schedule["office"]);
        Logger::getInstance()->info('現在是'.($result ? "上班" : "下班")."時段。");
        return $result;
    }

    private function isOverdueCheckNeeded() {
        Logger::getInstance()->info("檢查是否需要執行逾期案件檢查 ... ");
        $result = $this->isOn($this->schedule["overdue"]);
        Logger::getInstance()->info('現在是'.($result ? "啟動" : "非啟動")."時段。");
        return $result;
    }

    private function isTemperatureNotifyNeeded() {
        
        Logger::getInstance()->info("檢查是否需要體溫通知 ... ");
        $result = $this->isOn($this->schedule["temperature"]);
        Logger::getInstance()->info('現在是'.($result ? "啟動" : "非啟動")."時段。");
        return $result;
    }

    private function addHBMessage($title, $content, $to_id, $to_name, $timeout = 85500) {
        // filtering for the HB messenger
        $content = str_replace('<br/>', "\r\n", $content);
        $content = strip_tags($content);
        $msg = new Message();
        // 85500 = 86400 - 15 * 60 (one day - 15 mins)
        $sn = $msg->sysSend($title, $content, $to_id, $timeout);
        if ($sn == -1) {
            Logger::getInstance()->warning("HB: ${title} 訊息無法送出給 ${to_id}。($to_name, $sn)");
            Logger::getInstance()->info($content);
        } else {
            Logger::getInstance()->info("HB: ${title} 訊息(${sn})已送出給 ${to_id}。($to_name)");
        }
        return $sn;
    }

    private function addNotification($message, $to_id, $title = '系統排程訊息') {
        if (empty($to_id)) {
            Logger::getInstance()->warning("未指定接收者 id 下面訊息無法送出！");
            Logger::getInstance()->warning($message);
            return false;
        }
        $cache = Cache::getInstance();
        $users = $cache->getUserNames();
        $notify = new Notification();
        $payload = array(
            'title' =>  $title,
            'content' => trim($message),
            'priority' => 3,
            'expire_datetime' => '',
            'sender' => '系統排程',
            'from_ip' => getLocalhostIP()
        );
        $lastId = $notify->addMessage($to_id, $payload);
        $nameTag = rtrim("${to_id}:".$users[$to_id], ":");
        if ($lastId === false || empty($lastId)) {
            Logger::getInstance()->warning("訊息無法送出給 ${nameTag}");
        } else {
            Logger::getInstance()->info("訊息(${lastId})已送出給 ${nameTag}");
        }
        // particular impl for HB messenger system
        if (System::getInstance()->isHB()) {
            $this->addHBMessage($title, $message, $to_id, $users[$to_id]);
        }
        return $lastId;
    }

    private function checkCrossSiteData() {
        if ($this->isOn($this->schedule["twice_a_day"])) {
            $query = new Query();
            // check reg case missing RM99~RM101 data
            Logger::getInstance()->info('開始登記案件跨所註記遺失檢查 ... ');
            $rows = $query->getProblematicCrossCases();
            if (!empty($rows)) {
                Logger::getInstance()->warning('找到'.count($rows).'件跨所註記遺失登記案件！');
                $case_ids = [];
                foreach ($rows as $row) {
                    $case_ids[] = '🔴 '.$row['RM01'].'-'.$row['RM02'].'-'.$row['RM03'];
                    Logger::getInstance()->warning('🔴 '.$row['RM01'].'-'.$row['RM02'].'-'.$row['RM03'].' 地價案件跨所註記遺失!');
                }
                
                $content = "⚠️ ".$this->date."  ".$this->time." 地政系統目前找到下列「登記案件」跨所註記遺失案件:<br/><br/>".implode(" <br/> ", $case_ids)."<br/><br/>請前往 👉 [系管面板](http://".$this->host_ip.":8080/inf/mgt) 執行檢查功能並修正。";
                $sqlite_user = new SQLiteUser();
                $admins = $sqlite_user->getAdmins();
                foreach ($admins as $admin) {
                    $lastId = $this->addNotification($content, $admin['id'], "登記案件跨所註記遺失檢查結果");
                    echo '新增「登記案件跨所註記遺失」通知訊息至 '.$admin['id'].' 頻道。 ('.($lastId === false ? '失敗' : '成功').')';
                }
                
                $this->stats->addXcasesStats(array(
                    "date" => date("Y-m-d H:i:s"),
                    "found" => count($rows),
                    "note" => $content
                ));
            }
            Logger::getInstance()->info('登記案件跨所註記遺失檢查結束。');
        } else {
            Logger::getInstance()->warning('不在啟動區間「twice_a_day」，略過登記案件跨所註記遺失檢查。');
        }
    }

    private function checkValCrossSiteData() {
        if ($this->isOn($this->schedule["twice_a_day"])) {
            $query = new Query();
            // check val case missing SS99~SS101 data
            Logger::getInstance()->info('開始本所管轄地價案件跨所註記遺失檢查 ... ');
            $rows = $query->getPSCRNProblematicCrossCases();
            if (!empty($rows)) {
                Logger::getInstance()->warning('找到'.count($rows).'件跨所註記遺失地價案件！');
                $case_ids = [];
                foreach ($rows as $row) {
                    $case_ids[] = '🔴 '.$row['SS03'].'-'.$row['SS04_1'].'-'.$row['SS04_2'];
                    Logger::getInstance()->warning('🔴 '.$row['SS03'].'-'.$row['SS04_1'].'-'.$row['SS04_2']);
                }
                
                $content = "⚠️ ".$this->date."  ".$this->time." 地政系統目前找到下列「地價案件」跨所註記遺失案件:<br/><br/>".implode(" <br/> ", $case_ids)."<br/><br/>請前往 👉 [系管面板](http://".$this->host_ip.":8080/inf/mgt) 執行檢查功能並修正。";
                $sqlite_user = new SQLiteUser();
                $admins = $sqlite_user->getAdmins();
                foreach ($admins as $admin) {
                    $lastId = $this->addNotification($content, $admin['id'], "地價案件跨所註記遺失檢查結果");
                    Logger::getInstance()->info('新增「地價案件跨所註記遺失」通知訊息至 '.$admin['id'].' 頻道。 ('.($lastId === false ? '失敗' : '成功').')');
                }
                
                $this->stats->addXcasesStats(array(
                    "date" => date("Y-m-d H:i:s"),
                    "found" => count($rows),
                    "note" => $content
                ));
            }
            Logger::getInstance()->info('本所管轄地價案件跨所註記遺失檢查完成。');
        } else {
            Logger::getInstance()->warning('不在啟動區間「twice_a_day」，略過跨所註記遺失地價案件檢查。');
        }
    }

    private function checkValCrossOtherSitesData() {
        if ($this->isOn($this->schedule["twice_a_day"])) {
            $lxhweb = new LXHWEB(CONNECTION_TYPE::L3HWEB);
            // get rid of our site
            $all = array('HA', 'HB', 'HC', 'HD', 'HE', 'HF', 'HG', 'HH');
            $remove_idx = array_search(System::getInstance()->getSiteCode(), $all);
            unset($all[$remove_idx]);
            foreach ($all as $site) {
                // check val case missing SS99~SS101 data
                Logger::getInstance()->info("開始 ${site} 管轄地價案件跨所註記遺失檢查 ... ");
                $rows = $lxhweb->getMissingXNoteXValCases($site);
                if (count($rows) > 0) {
                    $case_ids = [];
                    foreach ($rows as $row) {
                        $case_ids[] = '⚠ '.$row['SS03'].'-'.$row['SS04_1'].'-'.$row['SS04_2'];
                        Logger::getInstance()->warning('⚠ '.$row['SS03'].'-'.$row['SS04_1'].'-'.$row['SS04_2'].' 「跨所地價案件」跨所註記遺失!');
                    }
                    
                    $site_name = System::getInstance()->getSiteName($site);
                    $content = "🚩 ".$this->date."  ".$this->time." 地政系統同步異動資料庫(L3HWEB, MOIPRC.PSCRN Table)找到下列「跨所地價案件」跨所註記遺失:<br/><br/>".implode(" <br/> ", $case_ids)."<br/><br/>請填寫「跨所問題處理單」通知管轄所「${site_name}」修正。";
                    $sqlite_user = new SQLiteUser();
                    $admins = $sqlite_user->getAdmins();
                    foreach ($admins as $admin) {
                        $lastId = $this->addNotification($content, $admin['id'], "${site} 管轄地價案件跨所註記遺失檢查結果");
                        Logger::getInstance()->info('新增「跨所地價案件」跨所註記遺失通知訊息至 '.$admin['id'].' 頻道。 ('.($lastId === false ? '失敗' : '成功').')');
                    }
                    
                    $this->stats->addXcasesStats(array(
                        "date" => date("Y-m-d H:i:s"),
                        "found" => count($rows),
                        "note" => $content
                    ));
                }
                Logger::getInstance()->info("${site} 管轄地價案件跨所註記遺失檢查完成。");
            }
        }
    }

    private function findRegOverdueCases() {
        if (!$this->isOverdueCheckNeeded()) {
            Logger::getInstance()->warning(__METHOD__.": 非設定時間內，跳過逾期登記案件檢測。");
            return false;
        }
        $query_url_base = "http://".$this->host_ip.":8080/regcase/";
        $query = new Query();
        Logger::getInstance()->info('開始查詢15天內逾期登記案件 ... ');
        $rows = $query->queryOverdueCasesIn15Days();
        if (!empty($rows)) {
            Logger::getInstance()->info('15天內找到'.count($rows).'件逾期登記案件。');
            $cache = Cache::getInstance();
            $users = $cache->getUserNames();
            $case_records = [];
            foreach ($rows as $row) {
                $case_id = $row['RM01'].'-'.$row['RM02'].'-'.$row['RM03'];
                $this_msg = "[${case_id}](${query_url_base}${case_id})".' '.REG_REASON[$row['RM09']].' '.($users[$row['RM45']] ?? $row['RM45']) ?? ($users[$row['RM96']] ?? $row['RM96']);
                // fall back to RM96(收件人員) if RM45(初審) is not presented
                $case_records[$row['RM45'] ?? $row['RM96']][] = $this_msg;
                $case_records["ALL"][] = $this_msg;
            }
            // send to the reviewer
            $stats = 0;
            $date = date('Y-m-d H:i:s');
            foreach ($case_records as $ID => $records) {
                $this->sendRegOverdueMessage($ID, $records);
                $this->stats->addOverdueStatsDetail(array(
                    "ID" => $ID,
                    "RECORDS" => $records,
                    "DATETIME" => $date,
                    "NOTE" => array_key_exists($ID, $users) ? $users[$ID] : ''
                ));
                $stats++;
            }
            
            $this->stats->addOverdueMsgCount($stats);
            $this->stats->addNotificationCount($stats);
        }
        Logger::getInstance()->info('查詢近15天逾期登記案件完成。');
        return true;
    }

    private function sendRegOverdueMessage($to_id, $case_records) {
        $cache = Cache::getInstance();
        $users = $cache->getUserNames();
        // $url = "http://".$this->host_ip."/overdue_reg_cases.html";
        // if ($to_id != "ALL") {
        //     $url .= "?ID=${to_id}";
        //     // $url .= "${to_id}/";
        // }
        $url = "http://".$this->host_ip.":8080/expire/";
        if ($to_id !== "ALL") {
            $url .= $to_id;
        }
        $displayName = $to_id === "ALL" ? "登記課" : "您";
        $content = "🚩 ".$this->date."  ".$this->time." ${displayName}目前有 ".count($case_records)." 件逾期案件(近15天".(count($case_records) > 4 ? "，僅顯示前4筆" : "")."):<br/><br/>💥 ".implode("<br/>💥 ", array_slice($case_records, 0, 4))."<br/>...<br/>👉 請前往智慧控管系統 <b>[案件逾期顯示頁面](${url})</b> 查看詳細資料。";
        if ($to_id === "ALL") {
            $sqlite_user = new SQLiteUser();
            $chief = $sqlite_user->getChief('登記課');
            if (empty($chief)) {
                Logger::getInstance()->warning('找不到登記課課長帳號，無法傳送即時通知給他/她!!');
            } else {
                $this_user = $users[$chief['id']];
                $lastId = $this->addNotification($content, $chief['id'], "登記課逾期案件彙總");
                Logger::getInstance()->info('新增逾期案件通知訊息至 '.$chief['id'].' 頻道。 '. '(課長：'.$this_user.'，'.($lastId === false ? '失敗' : '成功').')');
            }
            // send to dev for debugging
            // $lastId = $notify->addMessage('HA10013859', $payload);
            // Logger::getInstance()->info('新增逾期案件通知訊息至 HA10013859 頻道。 ('.($lastId === false ? '失敗' : '成功').')');
        } else {
            $lastId = $this->addNotification($content, $to_id, "您的登記逾期案件統計");
        }
    }

    private function findSurNearOverdueCases() {
        if (!$this->isOverdueCheckNeeded()) {
            Logger::getInstance()->warning(__METHOD__.": 非設定時間內，跳過即將逾期測量案件檢測。");
            return false;
        }
        $query_url_base = "http://".$this->host_ip.":8080/expire/sur";
        $prefetch = new Prefetch();
        Logger::getInstance()->info('開始查詢即將逾期(未來3日內)登記案件 ... ');
        $rows = $prefetch->getSurNearCase();
        if (!empty($rows)) {
            Logger::getInstance()->info('未來3天內找到'.count($rows).'件即將逾期測量案件。');
            $cache = Cache::getInstance();
            $users = $cache->getUserNames();
            $case_records = [];
            foreach ($rows as $row) {
                $case_id = $row['MM01'].'-'.$row['MM02'].'-'.$row['MM03'];
                $this_msg = "[${case_id}](${query_url_base})".' '.$row['MM06_CHT'].' '.$row['MD04_CHT'];
                $case_records[$row['MD04']][] = $this_msg;
                $case_records["ALL"][] = $this_msg;
            }
            // send to the MD04(測量員代碼)
            $stats = 0;
            $date = date('Y-m-d H:i:s');
            foreach ($case_records as $ID => $records) {
                $this->sendSurNearOverdueMessage($ID, $records);
                $this->stats->addOverdueStatsDetail(array(
                    "ID" => $ID,
                    "RECORDS" => $records,
                    "DATETIME" => $date,
                    "NOTE" => array_key_exists($ID, $users) ? $users[$ID] : ''
                ));
                $stats++;
            }
            
            $this->stats->addOverdueMsgCount($stats);
            $this->stats->addNotificationCount($stats);
        }
        Logger::getInstance()->info('查詢近3天即將逾期測量案件完成。');
        return true;
    }

    private function sendSurNearOverdueMessage($to_id, $cases) {
        $cache = Cache::getInstance();
        $users = $cache->getUserNames();
        $url = "http://".$this->host_ip.":8080/expire/sur";
        $displayName = $to_id === "ALL" ? "測量課" : "您";
        $content = "⚠️ ".$this->date."  ".$this->time." ${displayName}目前有 ".count($cases)." 件即將逾期案件(未來3天".(count($cases) > 4 ? "，僅顯示前4筆" : "")."):<br/><br/>💥 ".implode("<br/>💥 ", array_slice($cases, 0, 4))."<br/>...<br/>👉 請前往智慧控管系統 <b>[測量案件查詢頁面](${url})</b> 查看詳細資料。";
        if ($to_id === "ALL") {
            $sqlite_user = new SQLiteUser();
            $chief = $sqlite_user->getChief('測量課');
            if (empty($chief)) {
                Logger::getInstance()->warning('找不到測量課課長帳號，無法傳送即時通知給他/她!!');
            } else {
                $this_user = $users[$chief['id']];
                $lastId = $this->addNotification($content, $chief['id'], "測量課即將逾期案件彙總");
                Logger::getInstance()->info('新增即將逾期測量案件通知訊息至 '.$chief['id'].' 頻道。 '. '(課長：'.$this_user.'，'.($lastId === false ? '失敗' : '成功').')');
            }
            // send to dev for debugging
            // $lastId = $notify->addMessage('HA10013859', $payload);
            // Logger::getInstance()->info('新增逾期案件通知訊息至 HA10013859 頻道。 ('.($lastId === false ? '失敗' : '成功').')');
        } else {
            $lastId = $this->addNotification($content, $to_id, "您的即將逾期案件統計");
        }
    }

    private function findSurOverdueCases() {
        if (!$this->isOverdueCheckNeeded()) {
            Logger::getInstance()->warning(__METHOD__.": 非設定時間內，跳過逾期測量案件檢測。");
            return false;
        }
        $query_url_base = "http://".$this->host_ip.":8080/expire/sur";
        $prefetch = new Prefetch();
        Logger::getInstance()->info('開始查詢逾期測量案件 ... ');
        $rows = $prefetch->getSurOverdueCase();
        if (!empty($rows)) {
            Logger::getInstance()->info('找到'.count($rows).'件逾期測量案件。');
            $cache = Cache::getInstance();
            $users = $cache->getUserNames();
            $case_records = [];
            foreach ($rows as $row) {
                $case_id = $row['MM01'].'-'.$row['MM02'].'-'.$row['MM03'];
                $this_msg = "[${case_id}](${query_url_base})".' '.$row['MM06_CHT'].' '.$row['MD04_CHT'];
                $case_records[$row['MD04']][] = $this_msg;
                $case_records["ALL"][] = $this_msg;
            }
            // send to the MD04(測量員代碼)
            $stats = 0;
            $date = date('Y-m-d H:i:s');
            foreach ($case_records as $ID => $records) {
                $this->sendSurOverdueMessage($ID, $records);
                $this->stats->addOverdueStatsDetail(array(
                    "ID" => $ID,
                    "RECORDS" => $records,
                    "DATETIME" => $date,
                    "NOTE" => array_key_exists($ID, $users) ? $users[$ID] : ''
                ));
                $stats++;
            }
            
            $this->stats->addOverdueMsgCount($stats);
            $this->stats->addNotificationCount($stats);
        }
        Logger::getInstance()->info('查詢逾期測量案件完成。');
        return true;
    }

    private function sendSurOverdueMessage($to_id, $cases) {
        $cache = Cache::getInstance();
        $users = $cache->getUserNames();
        $url = "http://".$this->host_ip.":8080/expire/sur";
        $displayName = $to_id === "ALL" ? "測量課" : "您";
        $content = "🚩 ".$this->date."  ".$this->time." ${displayName}目前有 ".count($cases)." 件逾期案件".(count($cases) > 4 ? "(僅顯示前4筆)" : "").":<br/><br/>💥 ".implode("<br/>💥 ", array_slice($cases, 0, 4))."<br/>...<br/>👉 請前往智慧控管系統 <b>[測量案件查詢頁面](${url})</b> 查看詳細資料。";
        if ($to_id === "ALL") {
            $sqlite_user = new SQLiteUser();
            $chief = $sqlite_user->getChief('測量課');
            if (empty($chief)) {
                Logger::getInstance()->warning('找不到測量課課長帳號，無法傳送即時通知給他/她!!');
            } else {
                $this_user = $users[$chief['id']];
                // $lastId = $notify->addMessage($chief['id'], $payload);
                $lastId = $this->addNotification($content, $chief['id'], "測量課已逾期測量案件彙總");
                Logger::getInstance()->info('新增逾期測量案件通知訊息至 '.$chief['id'].' 頻道。 '. '(課長：'.$this_user.'，'.($lastId === false ? '失敗' : '成功').')');
            }
            // send to dev for debugging
            // $lastId = $notify->addMessage('HA10013859', $payload);
            // Logger::getInstance()->info('新增逾期案件通知訊息至 HA10013859 頻道。 ('.($lastId === false ? '失敗' : '成功').')');
        } else {
            $lastId = $this->addNotification($content, $to_id, "您的已逾期測量案件統計");
        }
    }

    public function notifyTemperatureRegistration() {
        
        if (!$this->isTemperatureNotifyNeeded()) {
            Logger::getInstance()->warning(__METHOD__.": 非設定時間內，跳過體溫通知排程。");
            return false;
        }
        // get all on-board users
        $sqlite_user = new SQLiteUser();
        $onboard_users = $sqlite_user->getOnboardUsers();
        //check if they checked their temperature
        $temperature = new Temperature();
        $AMPM = date('A');
        foreach ($onboard_users as $idx => $user) {
            $user_id = $user['id'];
            $record = $temperature->getAMPMTemperatures($user_id, $AMPM);
            // only no record should be notified
            if (empty($record)) {
                $this->sendTemperatureMessage($user);
            }
        }
    }

    private function sendTemperatureMessage($user) {
        $to_id = trim($user['id']);
        $to_name = $user['name'];
        $AMPM = date('A');
        $msg = new Message();
        $url = "http://".$this->host_ip."/temperature.html?id=${to_id}";
        $content = "$to_name 您好\r\n\r\n系統偵測您於今日 $AMPM 尚未登記體溫！\r\n\r\n請用 CHROME 瀏覽器前往 ${url} 進行登記。";
        $title = "體溫登記通知";
        $sn = $msg->sysSend($title, $content, $to_id, 840); // 14 mins == 840 secs
        if ($sn == -1) {
            Logger::getInstance()->warning("${title} 訊息無法送出給 ${to_id}。($to_name, $sn)");
        } else {
            Logger::getInstance()->info("${title} 訊息(${sn})已送出給 ${to_id}。($to_name)");
        }
    }

    private function findProblematicSURCases() {
        if ($this->isOn($this->schedule["once_a_day"])) {
            // 找已結案但卻又延期複丈之案件
            $q = new Query();
            $results = $q->getSurProblematicCases();
            if (count($results) > 0) {
                $this->sendProblematicSURCasesMessage($results);
            } else {
                Logger::getInstance()->info(__METHOD__.": 無已結案卻延期複丈之測量案件。");
            }
        }
    }

    private function sendProblematicSURCasesMessage(&$results) {
        
        $cache = Cache::getInstance();
        $users = $cache->getUserNames();
        $msg = new Message();

        $case_ids = array();
        $msg_prefix = $msg_content = "系統目前找到下列已結案之測量案件但是狀態卻是「延期複丈」:\r\n\r\n";
        foreach ($results as $result) {
            $case_id = $result['MM01'].'-'.$result['MM02'].'-'.$result['MM03'];
            $case_ids[] = $case_id;

            // notify corresponding operator as well
            $to_id = trim($result['MD04']); // 測量員ID
            $this_user = $users[$to_id];
            if (!empty($this_user)) {
                $title = "有問題的延期複丈案件(${this_user})通知";
                $msg_content = $msg_prefix.$case_id."\r\n\r\n請確認該案件狀態以免案件逾期。\r\n如有需要請填寫「電腦問題處理單」交由資訊課協助修正。";
                $sn = $msg->sysSend($title, $msg_content, $to_id, 85500);   // 85500 = 86400 - 15 * 60 (one day - 15 mins)
                if ($sn == -1) {
                    Logger::getInstance()->warning("「${title}」訊息無法送出給 ${to_id} 。 (".$this_user.", $sn)");
                } else {
                    Logger::getInstance()->info("「${title}」訊息(${sn})已送出給 ${to_id} 。 (".$this_user.")");
                }
            }
        }

        $system = System::getInstance();
        $adm_ips = $system->getRoleAdminIps();
        $content = "系統目前找到下列已結案之測量案件但是狀態卻是「延期複丈」:\r\n\r\n".implode("\r\n", $case_ids)."\r\n\r\n請前往 http://".$this->host_ip.":8080/inf/mgt 執行複丈案件查詢功能並修正。";
        foreach ($adm_ips as $adm_ip) {
            if ($adm_ip == '::1') {
                continue;
            }
            $sn = $msg->send('複丈問題案件通知', $content, $adm_ip, 840);   // 840 secs => +14 mins
            Logger::getInstance()->info("訊息已送出(${sn})給 ${adm_ip}");
        }

        $this->stats->addBadSurCaseStats(array(
            "date" => date("Y-m-d H:i:s"),
            "found" => count($case_ids),
            "note" => $content
        ));
    }

    function __construct() {
        $this->stats = new StatsSQLite();
        $this->host_ip = getLocalhostIP();
        $this->date = date("m/d");
        $this->time = date("H:i");
    }
    function __destruct() { $this->stats = null; }

    public function do() {
        try {
            if ($this->isOfficeHours()) {
                /**
                 * 案件檢測作業
                 */
                $this->checkCrossSiteData();
                $this->checkValCrossSiteData();
                $this->checkValCrossOtherSitesData();
                $this->findRegOverdueCases();
                $this->findSurOverdueCases();
                $this->findSurNearOverdueCases();
                return true;
            }
            return false;
        } finally {
        }
    }
    
    public function isOn($schedule) {
        // current or user supplied UNIX timestamp
        $timestamp = time();
        // default status
        $status = false;
        // get current time object
        $currentTime = (new DateTime())->setTimestamp($timestamp);
        // loop through time ranges for current day
        foreach ($schedule[date('D', $timestamp)] as $startTime => $endTime) {
            // create time objects from start/end times
            $st = DateTime::createFromFormat('h:i A', $startTime);
            $ed = DateTime::createFromFormat('h:i A', $endTime);

            // check if current time is within a range
            if (($st < $currentTime) && ($currentTime < $ed)) {
                $status = true;
                break;
            }
        }
        return $status;
    }
}
