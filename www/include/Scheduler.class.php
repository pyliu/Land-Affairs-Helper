<?php
require_once(dirname(dirname(__FILE__)).DIRECTORY_SEPARATOR.'include'.DIRECTORY_SEPARATOR.'init.php');
require_once(INC_DIR.DIRECTORY_SEPARATOR.'Message.class.php');
require_once(INC_DIR.DIRECTORY_SEPARATOR.'Notification.class.php');
require_once(INC_DIR.DIRECTORY_SEPARATOR."SQLiteMonitorMail.class.php");
require_once(INC_DIR.DIRECTORY_SEPARATOR."SQLiteConnectivity.class.php");
require_once(INC_DIR.DIRECTORY_SEPARATOR.'Cache.class.php');
require_once(INC_DIR.DIRECTORY_SEPARATOR."IPResolver.class.php");
require_once(INC_DIR.DIRECTORY_SEPARATOR."SQLiteRKEYN.class.php");
require_once(INC_DIR.DIRECTORY_SEPARATOR."SQLiteRKEYNALL.class.php");
require_once(INC_DIR.DIRECTORY_SEPARATOR."SQLiteSYSAUTH1.class.php");
require_once(INC_DIR.DIRECTORY_SEPARATOR."StatsSQLite.class.php");
require_once(INC_DIR.DIRECTORY_SEPARATOR."Prefetch.class.php");
require_once(INC_DIR.DIRECTORY_SEPARATOR."SQLiteOFFICES.class.php");
require_once(INC_DIR.DIRECTORY_SEPARATOR."SQLiteOFFICESSTATS.class.php");
require_once(INC_DIR.DIRECTORY_SEPARATOR."System.class.php");

class Scheduler {
    private $tmp;
    private $tickets;
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

    private function isOn($schedule) {
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

    private function compressLog() {
        $cache = Cache::getInstance();
        // compress all log when zipLogs_flag is expired
        if ($cache->isExpired('zipLogs_flag')) {
            Logger::getInstance()->info(__METHOD__.": 開始壓縮LOG檔！");
            zipLogs();
            Logger::getInstance()->info(__METHOD__.": 壓縮LOG檔結束！");
            // cache the flag for a week
            $cache->set('zipLogs_flag', true, 604800);
        }
    }

    private function wipeOutdatedLog() {
        Logger::getInstance()->info(__METHOD__.": 啟動清除過時記錄檔排程。");
        Logger::getInstance()->removeOutdatedLog();
    }

    private function importUserFromL3HWEB() {
        Logger::getInstance()->info(__METHOD__.': 匯入L3HWEB使用者資料排程啟動。');
        $sysauth1 = new SQLiteSYSAUTH1();
        $sysauth1->importFromL3HWEBDB();
    }

    private function importRKEYN() {
        Logger::getInstance()->info(__METHOD__.': 匯入RKEYN代碼檔排程啟動。');
        $sqlite_sr = new SQLiteRKEYN();
        $sqlite_sr->importFromOraDB();
    }

    private function importRKEYNALL() {
        Logger::getInstance()->info(__METHOD__.': 匯入RKEYN_ALL代碼檔排程啟動。');
        $sqlite_sra = new SQLiteRKEYNALL();
        $sqlite_sra->importFromOraDB();
    }

    private function importOFFICES() {
        Logger::getInstance()->info(__METHOD__.': 匯入LANDIP資料排程啟動。');
        $sqlite_so = new SQLiteOFFICES();
        $sqlite_so->importFromOraDB();
    }

    private function wipeOutdatedIPEntries() {
        Logger::getInstance()->info(__METHOD__.": 啟動清除過時 dynamic ip 資料排程。");
        $ipr = new IPResolver();
        $ipr->removeDynamicIPEntries(604800);   // a week
    }

    private function wipeOutdatedMonitorMail() {
        $monitor = new SQLiteMonitorMail();
        // remove mails by a month ago
        $days = 30;
        $month_secs = $days * 24 * 60 * 60;
        Logger::getInstance()->info("啟動清除過時監控郵件排程。(${days}, ${month_secs})");
        if ($monitor->removeOutdatedMail($month_secs)) {
            Logger::getInstance()->info(__METHOD__.": 移除過時的監控郵件成功。(${days}天之前)");
        } else {
            Logger::getInstance()->warning(__METHOD__.": 移除過時的監控郵件失敗。(${days}天之前)");
        }
    }

    private function fetchMonitorMail() {
        $monitor = new SQLiteMonitorMail();
        $monitor->fetchFromMailServer();
    }

    public function addOfficeCheckStatus() {
        Logger::getInstance()->info(__METHOD__.": 開始進行全國地所連線測試 ... ");

        $xap_ip = System::getInstance()->getWebAPIp();
        $sqlite_so = new SQLiteOFFICES();
        $sqlite_sos = new SQLiteOFFICESSTATS();
        $sites = $sqlite_so->getAll();
        $count = 0;
        foreach ($sites as $site) {
            // skip out of date sites
            if ($site['ID'] === 'CB' || $site['ID'] === 'CC') {
                continue;
            }
            // Logger::getInstance()->info(__METHOD__.": 檢測".$site['ID']." ".$site['ALIAS']." ".$site['NAME']."。");
            $url = "http://$xap_ip/Land".strtoupper($site['ID'])."/";
            // Logger::getInstance()->info(__METHOD__.": url:$url");
            $headers = httpHeader($url);
            $response = trim($headers[0]);
            // Logger::getInstance()->info(__METHOD__.": header: $response");
            $sqlite_sos->replace(array(
                'id' => $site['ID'],
                'name' => $site['NAME'],
                // if service available, HTTP response code will return 401
                'state' => $response === 'HTTP/1.1 401 Unauthorized' ? 'UP' : 'DOWN',
                'response' => $response,
                'timestamp' => time(),
            ));
            // Logger::getInstance()->info(__METHOD__.": timestamp: ".time());
            $count++;
        }
        Logger::getInstance()->info(__METHOD__.": 全國地所連線測試共完成 $count 所測試。");
    }

    function __construct() {
        $this->tmp = sys_get_temp_dir();
        $this->tickets = array(
            '5m' => $this->tmp.DIRECTORY_SEPARATOR.'LAH-5mins.ts',
            '10m' => $this->tmp.DIRECTORY_SEPARATOR.'LAH-10mins.ts',
            '15m' => $this->tmp.DIRECTORY_SEPARATOR.'LAH-15mins.ts',
            '30m' => $this->tmp.DIRECTORY_SEPARATOR.'LAH-30mins.ts',
            '1h' => $this->tmp.DIRECTORY_SEPARATOR.'LAH-1hour.ts',
            '2h' => $this->tmp.DIRECTORY_SEPARATOR.'LAH-2hours.ts',
            '4h' => $this->tmp.DIRECTORY_SEPARATOR.'LAH-4hours.ts',
            '8h' => $this->tmp.DIRECTORY_SEPARATOR.'LAH-8hours.ts',
            '12h' => $this->tmp.DIRECTORY_SEPARATOR.'LAH-12hours.ts',
            '24h' => $this->tmp.DIRECTORY_SEPARATOR.'LAH-24hours.ts'
        );
    }
    function __destruct() {}

    public function do() {
        Logger::getInstance()->info(__METHOD__.": Scheduler 開始執行。");
        $this->doOneDayJobs();
        $this->doHalfDayJobs();
        $this->do8HoursJobs();
        $this->do4HoursJobs();
        $this->do1HourJobs();
        $this->do30minsJobs();
        $this->do15minsJobs();
        $this->do10minsJobs();
        $this->do5minsJobs();
        Logger::getInstance()->info(__METHOD__.": Scheduler 執行完成。");
    }

    public function do5minsJobs () {
        try {
            $ticketTs = file_get_contents($this->tickets['5m']);
            if ($ticketTs <= time()) {
                Logger::getInstance()->info(__METHOD__.": 開始執行每5分鐘的排程。");
                // place next timestamp to the tmp ticket file 
                file_put_contents($this->tickets['5m'], strtotime('+5 mins', time()));
                // check all offices connectivity during office hours
                if ($this->isOn($this->schedule["office"])) {
                    $this->addOfficeCheckStatus();
                }
            } else {
                // Logger::getInstance()->info(__METHOD__.": 每5分鐘的排程將於 ".date("Y-m-d H:i:s", $ticketTs)." 後執行。");
            }
            return true;
        } catch (Exception $e) {
            Logger::getInstance()->warning(__METHOD__.": 執行每5分鐘的排程失敗。");
            Logger::getInstance()->warning(__METHOD__.": ".$e->getMessage());
        } finally {
        }
        return false;
    }

    public function do10minsJobs () {
        try {
            
            $ticketTs = file_get_contents($this->tickets['10m']);
            if ($ticketTs <= time()) {
                Logger::getInstance()->info(__METHOD__.": 開始執行每10分鐘的排程。");
                // place next timestamp to the tmp ticket file 
                file_put_contents($this->tickets['10m'], strtotime('+10 mins', time()));
                /**
                 * 擷取監控郵件
                 */
                $this->fetchMonitorMail();
            } else {
                // Logger::getInstance()->info(__METHOD__.": 每10分鐘的排程將於 ".date("Y-m-d H:i:s", $ticketTs)." 後執行。");
            }
            return true;
        } catch (Exception $e) {
            Logger::getInstance()->warning(__METHOD__.": 執行每10分鐘的排程失敗。");
            Logger::getInstance()->warning(__METHOD__.": ".$e->getMessage());
        } finally {
        }
        return false;
    }

    public function do15minsJobs () {
        try {
            $ticketTs = file_get_contents($this->tickets['15m']);
            if ($ticketTs <= time()) {
                Logger::getInstance()->info(__METHOD__.": 開始執行每15分鐘的排程。");
                // place next timestamp to the tmp ticket file 
                file_put_contents($this->tickets['15m'], strtotime('+15 mins', time()));
                // check systems connectivity
                $conn = new SQLiteConnectivity();
                $conn->check();
            } else {
                // Logger::getInstance()->info(__METHOD__.": 每15分鐘的排程將於 ".date("Y-m-d H:i:s", $ticketTs)." 後執行。");
            }
            return true;
        } catch (Exception $e) {
            Logger::getInstance()->warning(__METHOD__.": 執行每15分鐘的排程失敗。");
            Logger::getInstance()->warning(__METHOD__.": ".$e->getMessage());
        } finally {
        }
        return false;
    }

    public function do30minsJobs () {
        try {
            $ticketTs = file_get_contents($this->tickets['30m']);
            if ($ticketTs <= time()) {
                Logger::getInstance()->info(__METHOD__.": 開始執行每30分鐘的排程。");
                // place next timestamp to the tmp ticket file 
                file_put_contents($this->tickets['30m'], strtotime('+30 mins', time()));
                // job execution below ...
            } else {
                // Logger::getInstance()->info(__METHOD__.": 每30分鐘的排程將於 ".date("Y-m-d H:i:s", $ticketTs)." 後執行。");
            }
            return true;
        } catch (Exception $e) {
            Logger::getInstance()->warning(__METHOD__.": 執行每30分鐘的排程失敗。");
            Logger::getInstance()->warning(__METHOD__.": ".$e->getMessage());
        } finally {
        }
        return false;
    }

    public function do1HourJobs () {
        try {
            $ticketTs = file_get_contents($this->tickets['1h']);
            if ($ticketTs <= time()) {
                Logger::getInstance()->info(__METHOD__.": 開始執行每小時的排程。");
                // place next timestamp to the tmp ticket file 
                file_put_contents($this->tickets['1h'], strtotime('+60 mins', time()));
                // job execution below ...
            } else {
                // Logger::getInstance()->info(__METHOD__.": 每小時的排程將於 ".date("Y-m-d H:i:s", $ticketTs)." 後執行。");
            }
            return true;
        } catch (Exception $e) {
            Logger::getInstance()->warning(__METHOD__.": 執行每小時的排程失敗。");
            Logger::getInstance()->warning(__METHOD__.": ".$e->getMessage());
        } finally {
        }
        return false;
    }

    public function do4HoursJobs () {
        try {
            $ticketTs = file_get_contents($this->tickets['4h']);
            if ($ticketTs <= time()) {
                Logger::getInstance()->info(__METHOD__.": 開始執行每4小時的排程。");
                // place next timestamp to the tmp ticket file 
                file_put_contents($this->tickets['4h'], strtotime('+240 mins', time()));
                // job execution below ...
            } else {
                // Logger::getInstance()->info(__METHOD__.": 每4小時的排程將於 ".date("Y-m-d H:i:s", $ticketTs)." 後執行。");
            }
            return true;
        } catch (Exception $e) {
            Logger::getInstance()->warning(__METHOD__.": 執行每4小時的排程失敗。");
            Logger::getInstance()->warning(__METHOD__.": ".$e->getMessage());
        } finally {
        }
        return false;
    }
    
    public function do8HoursJobs () {
        try {
            $ticketTs = file_get_contents($this->tickets['8h']);
            if ($ticketTs <= time()) {
                Logger::getInstance()->info(__METHOD__.": 開始執行每8小時的排程。");
                // place next timestamp to the tmp ticket file 
                file_put_contents($this->tickets['8h'], strtotime('+480 mins', time()));
                // job execution below ...
            } else {
                // Logger::getInstance()->info(__METHOD__.": 每8小時的排程將於 ".date("Y-m-d H:i:s", $ticketTs)." 後執行。");
            }
            return true;
        } catch (Exception $e) {
            Logger::getInstance()->warning(__METHOD__.": 執行每8小時的排程失敗。");
            Logger::getInstance()->warning(__METHOD__.": ".$e->getMessage());
        } finally {
        }
        return false;
    }
    
    public function doHalfDayJobs () {
        try {
            $ticketTs = file_get_contents($this->tickets['12h']);
            if ($ticketTs <= time()) {
                Logger::getInstance()->info(__METHOD__.": 開始執行每12小時的排程。");
                // place next timestamp to the tmp ticket file 
                file_put_contents($this->tickets['12h'], strtotime('+720 mins', time()));
                // job execution below ...
            } else {
                // Logger::getInstance()->info(__METHOD__.": 每12小時的排程將於 ".date("Y-m-d H:i:s", $ticketTs)." 後執行。");
            }
            return true;
        } catch (Exception $e) {
            Logger::getInstance()->warning(__METHOD__.": 執行每12小時的排程失敗。");
            Logger::getInstance()->warning(__METHOD__.": ".$e->getMessage());
        } finally {
        }
        return false;
    }
    
    public function doOneDayJobs () {
        try {
            $ticketTs = file_get_contents($this->tickets['24h']);
            if ($ticketTs <= time()) {
                Logger::getInstance()->info(__METHOD__.": 開始執行每24小時的排程。");
                // place next timestamp to the tmp ticket file 
                file_put_contents($this->tickets['24h'], strtotime('+1440 mins', time()));
                // job execution below ...
                // compress other days log
                $this->compressLog();
                // clean AP stats data one day ago
                $stats = new StatsSQLite();
                $stats->wipeAllAPConnHistory();
                // clean connectivity stats data one day ago
                $conn = new SQLiteConnectivity();
                $conn->wipeHistory(1);
                // $this->notifyTemperatureRegistration();
                $this->wipeOutdatedIPEntries();
                $this->wipeOutdatedMonitorMail();
                $this->wipeOutdatedLog();
                // wipe out expired cached data once a day
                Prefetch::wipeExpiredData();
                /**
                 * 匯入WEB DB固定資料
                 */
                $this->importRKEYN();
                $this->importRKEYNALL();
                $this->importOFFICES();
                $this->importUserFromL3HWEB();
            } else {
                // Logger::getInstance()->info(__METHOD__.": 每24小時的排程將於 ".date("Y-m-d H:i:s", $ticketTs)." 後執行。");
            }
            return true;
        } catch (Exception $e) {
            Logger::getInstance()->warning(__METHOD__.": 執行每24小時的排程失敗。");
            Logger::getInstance()->warning(__METHOD__.": ".$e->getMessage());
        } finally {
        }
        return false;
    }
}
