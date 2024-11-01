<?php
require_once('init.php');
require_once('SQLiteDBFactory.class.php');
require_once('IPResolver.class.php');
require_once('System.class.php');

class StatsSQLite {
    private $db;
    private $querySingleFail = array(NULL, FALSE, array());

    function __construct() {
        $path = SQLiteDBFactory::getLAHDB();
        $this->db = new SQLite3($path);
        $this->db->exec("PRAGMA cache_size = 100000");
        $this->db->exec("PRAGMA temp_store = MEMORY");
        $this->db->exec("BEGIN TRANSACTION");
    }

    function __destruct() {
        $this->db->exec("END TRANSACTION");
        $this->db->close();
    }

    public function instTotal($id, $name, $total = 0) {
        if ($stm = $this->db->prepare("INSERT INTO stats ('ID', 'NAME', 'TOTAL') VALUES (:id, :name, :total)")) {
            //$stm = $this->db->prepare("INSERT INTO stats set TOTAL = :total WHERE  ID = :id");
            $stm->bindValue(':total', intval($total));
            $stm->bindParam(':id', $id);
            $stm->bindParam(':name', $name);
            return $stm->execute() === FALSE ? false : true;
        }
        
        Logger::getInstance()->warning(__METHOD__.": 準備資料庫 statement [ INSERT INTO stats ('ID', 'NAME', 'TOTAL') VALUES (:id, :name, :total) ] 失敗。($id, $name, $total)");
        return false;
    }
    /**
     * Early LAH Stats
     */
    public function getTotal($id) {
        return $this->db->querySingle("SELECT TOTAL from stats WHERE ID = '$id'");
    }

    public function updateTotal($id, $total) {
        if ($stm = $this->db->prepare("UPDATE stats set TOTAL = :total WHERE  ID = :id")) {
            $stm->bindValue(':total', intval($total));
            $stm->bindParam(':id', $id);
            return $stm->execute() === FALSE ? false : true;
        }
        
        Logger::getInstance()->warning(__METHOD__.": 準備資料庫 statement [ UPDATE stats set TOTAL = :total WHERE  ID = :id ] 失敗。($id, $total)");
        return false;
    }

    public function addNotificationCount($count = 1) {
        $total = $this->getTotal('notification_msg_count');
        // in case the entry not exists
        if (in_array($total, $this->querySingleFail)) {
            $this->instTotal('notification_msg_count', '桃園即時通訊息傳送統計');
            $total = 0;
        }
        $total += $count;
        $ret = $this->updateTotal('notification_msg_count', $total);
        Logger::getInstance()->info(__METHOD__.": notification_msg_count 計數器+${count}，目前值為 ${total} 【".($ret ? "成功" : "失敗")."】");
    }

    public function addOverdueMsgCount($count = 1) {
        $total = $this->getTotal('overdue_msg_count') + $count;
        $ret = $this->updateTotal('overdue_msg_count', $total);
        Logger::getInstance()->info(__METHOD__.": overdue_msg_count 計數器+${count}，目前值為 ${total} 【".($ret ? "成功" : "失敗")."】");
    }

    public function addOverdueStatsDetail($data) {
        // $data => ["ID" => HB0000, "RECORDS" => array, "DATETIME" => 2020-03-04 08:50:23, "NOTE" => XXX]
        // overdue_stats_detail
        if ($stm = $this->db->prepare("INSERT INTO overdue_stats_detail (datetime,id,count,note) VALUES (:date, :id, :count, :note)")) {
            $stm->bindParam(':date', $data["DATETIME"]);
            $stm->bindParam(':id', $data["ID"]);
            $stm->bindValue(':count', count($data["RECORDS"]));
            $stm->bindParam(':note', $data["NOTE"]);
            $ret = $stm->execute();
            if (!$ret) {
                
                Logger::getInstance()->error(__METHOD__.": 新增逾期統計詳情失敗【".$stm->getSQL()."】");
            }
            return $ret;
        }
        
        Logger::getInstance()->warning(__METHOD__.": 準備資料庫 statement [ INSERT INTO overdue_stats_detail (datetime,id,count,note) VALUES (:date, :id, :count, :note) ] 失敗。(".print_r($data, true).")");
        return false;
    }

    public function addXcasesStats($data) {
        // $data => ["date" => "2020-03-04 10:10:10","found" => 2, "note" => XXXXXXXXX]
        // xcase_stats
        if ($stm = $this->db->prepare("INSERT INTO xcase_stats (datetime,found,note) VALUES (:date, :found, :note)")) {
            $stm->bindParam(':date', $data["date"]);
            $stm->bindParam(':found', $data["found"]);
            $stm->bindParam(':note', $data["note"]);
            $ret = $stm->execute();
            
            Logger::getInstance()->info(__METHOD__.": 新增跨所註記遺失案件統計".($ret ? "成功" : "失敗【".$stm->getSQL()."】")."。");
            // 更新 total counter
            $total = $this->getTotal('xcase_found_count') + $data["found"];
            $ret = $this->updateTotal('xcase_found_count', $total);
            Logger::getInstance()->info(__METHOD__.": xcase_found_count 計數器+".$data["found"]."，目前值為 ${total} 【".($ret ? "成功" : "失敗")."】");
        }
        
        Logger::getInstance()->warning(__METHOD__.": 準備資料庫 statement [ INSERT INTO xcase_stats (datetime,found,note) VALUES (:date, :found, :note) ] 失敗。(".print_r($data, true).")");
        return false;
    }

    public function addBadSurCaseStats($data) {
        // $data => ["date" => "2020-03-04 10:10:10","found" => 2, "note" => XXXXXXXXX]
        // xcase_stats
        if ($stm = $this->db->prepare("INSERT INTO found_bad_sur_case_stats (datetime,found,note) VALUES (:date, :found, :note)")) {
            $stm->bindParam(':date', $data["date"]);
            $stm->bindParam(':found', $data["found"]);
            $stm->bindParam(':note', $data["note"]);
            $ret = $stm->execute();
            
            Logger::getInstance()->info(__METHOD__.": 新增複丈問題案件統計".($ret ? "成功" : "失敗【".$stm->getSQL()."】")."。");
            // 更新 total counter
            $total = $this->getTotal('bad_sur_case_found_count') + $data["found"];
            $ret = $this->updateTotal('bad_sur_case_found_count', $total);
            Logger::getInstance()->info(__METHOD__.": bad_sur_case_found_count 計數器+".$data["found"]."，目前值為 ${total} 【".($ret ? "成功" : "失敗")."】");
        }
        
        Logger::getInstance()->warning(__METHOD__.": 準備資料庫 statement [ INSERT INTO found_bad_sur_case_stats (datetime,found,note) VALUES (:date, :found, :note) ] 失敗。(".print_r($data, true).")");
        return false;
    }

    public function addStatsRawData($id, $data) {
        // $data => php array
        // overdue_stats_detail
        if ($stm = $this->db->prepare("INSERT INTO stats_raw_data (id,data) VALUES (:id, :data)")) {
            $param = serialize($data);
            $stm->bindParam(':data', $param);
            $stm->bindParam(':id', $id);
            $ret = $stm->execute();
            if (!$ret) {
                
                Logger::getInstance()->error(__METHOD__.": 新增統計 RAW DATA 失敗【".$id.", ".$stm->getSQL()."】");
            }
            return $ret;
        }
        
        Logger::getInstance()->warning(__METHOD__.": 準備資料庫 statement [ INSERT INTO stats_raw_data (id,data) VALUES (:id, :data) ] 失敗。($id, ".print_r($data, true).")");
        return false;
    }

    public function removeAllStatsRawData($year_month) {
        if ($stm = $this->db->prepare("DELETE FROM stats_raw_data WHERE id LIKE '%_".$year_month."'")) {
            $ret = $stm->execute();
            if (!$ret) {
                
                Logger::getInstance()->error(__METHOD__.": 移除統計 RAW DATA 失敗【".$year_month.", ".$stm->getSQL()."】");
            }
            return $ret;
        }
        
        Logger::getInstance()->warning(__METHOD__.": 準備資料庫 statement [ DELETE FROM stats_raw_data WHERE id LIKE '%_".$year_month."' ] 失敗。($year_month)");
        return false;
    }

    public function removeStatsRawData($id) {
        // $data => php array
        // overdue_stats_detail
        if ($stm = $this->db->prepare("DELETE FROM stats_raw_data WHERE id = :id")) {
            $stm->bindParam(':id', $id);
            $ret = $stm->execute();
            if (!$ret) {
                
                Logger::getInstance()->error(__METHOD__.": 移除統計 RAW DATA 失敗【".$id.", ".$stm->getSQL()."】");
            }
            return $ret;
        }
        
        Logger::getInstance()->warning(__METHOD__.": 準備資料庫 statement [ DELETE FROM stats_raw_data WHERE id = :id ] 失敗。($id)");
        return false;
    }

    public function getStatsRawData($id) {
        $data = $this->db->querySingle("SELECT data from stats_raw_data WHERE id = '$id'");
        return empty($data) ? false : unserialize($data);
    }
    /**
     * AP connection history
     */
    public function getLatestAPConnHistory($ap_ip, $all = 'true') {
        
        $db_path = SQLiteDBFactory::getAPConnStatsDB(explode('.', $ap_ip)[3]);
        $ap_db = new SQLite3($db_path);
        // get latest batch log_time
        $latest_log_time = $ap_db->querySingle("SELECT DISTINCT log_time from ap_conn_history ORDER BY log_time DESC");
        if($stmt = $ap_db->prepare('SELECT * FROM ap_conn_history WHERE log_time = :log_time ORDER BY count DESC')) {
            $stmt->bindParam(':log_time', $latest_log_time);
            $result = $stmt->execute();
            $return = [];
            if ($result === false) return $return;
            $ipr = new IPResolver();
            while($row = $result->fetchArray(SQLITE3_ASSOC)) {
                if ($all == 'false' && $ipr->isServerIP($row['est_ip'])) continue;
                // turn est_ip to user
                $name = $ipr->resolve($row['est_ip']);
                $row['name'] = empty($name) ? $row['est_ip'] : $name;
                $return[] = $row;
            }
            return $return;
        } else {
            
            Logger::getInstance()->error(__METHOD__.": 取得 $ap_ip 最新紀錄資料失敗！ (${db_path})");
        }
        return false;
    }

    public function getAPConnHistory($ap_ip, $count, $extend = true) {
        $webap_ip = System::getInstance()->getWebAPIp() ?? '220.1.34.161';
        // e.g. $sebap_ip = '220.1.34.161' then XAP conn only store at AP161 db
        $db_path = SQLiteDBFactory::getAPConnStatsDB((explode('.', $webap_ip)[3]));
        $ap_db = new SQLite3($db_path);
        if($stmt = $ap_db->prepare('SELECT * FROM ap_conn_history WHERE est_ip = :ip ORDER BY log_time DESC LIMIT :limit')) {
            $stmt->bindParam(':ip', $ap_ip);
            $stmt->bindValue(':limit', $extend ? $count * 4 : $count, SQLITE3_INTEGER);
            $result = $stmt->execute();
            $return = [];
            if ($result === false) return $return;
            $skip_count = 0;
            while($row = $result->fetchArray(SQLITE3_ASSOC)) {
                // basically BE every 15s insert a record, extend means to get 1-min duration record
                if ($extend) {
                    $skip_count++;
                    if ($skip_count % 4 != 1) continue;
                }
                $return[] = $row;
            }
            return $return;
        } else {
            
            Logger::getInstance()->error(__METHOD__.": 取得 $ap_ip 歷史紀錄資料失敗！ (${db_path})");
        }
        return false;
    }

    public function addAPConnHistory($log_time, $ap_ip, $processed) {
        
        // inst into db
        $db_path = SQLiteDBFactory::getAPConnStatsDB(explode('.', $ap_ip)[3]);
        $ap_db = new SQLite3($db_path);
        $latest_batch = $ap_db->querySingle("SELECT DISTINCT batch from ap_conn_history ORDER BY batch DESC");
        $success = 0;
        foreach ($processed as $est_ip => $count) {
            if ($stm = @$ap_db->prepare("INSERT INTO ap_conn_history (log_time,ap_ip,est_ip,count,batch) VALUES (:log_time, :ap_ip, :est_ip, :count, :batch)")) {
                $stm->bindParam(':log_time', $log_time);
                $stm->bindParam(':ap_ip', $ap_ip);
                $stm->bindParam(':est_ip', $est_ip);
                $stm->bindParam(':count', $count);
                $stm->bindValue(':batch', $latest_batch + 1);

                // $ret = $stm->execute();
                // $ret !== FALSE ?? $success++;
                // $ret === FALSE ?? Logger::getInstance()->warning(__METHOD__.": 更新資料庫(${db_path})失敗。($log_time, $ap_ip, $est_ip, $count)");

                $retry = 0;
                while (@$stm->execute() === FALSE) {
                    if ($retry > 10) {
                        Logger::getInstance()->warning(__METHOD__.": 更新資料庫(${db_path})失敗。($log_time, $ap_ip, $est_ip, $count)");
                        return $success;
                    }
                    $zzz_us = random_int(100000, 500000);
                    Logger::getInstance()->warning(__METHOD__.": execute statement failed ... sleep ".$zzz_us." microseconds, retry(".++$retry.").");
                    usleep($zzz_us);
                }
                $success++;
            } else {
                Logger::getInstance()->warning(__METHOD__.": 準備資料庫 statement [ INSERT INTO ap_conn_history (log_time,ap_ip,est_ip,count,batch) VALUES (:log_time, :ap_ip, :est_ip, :count, :batch) ] 失敗。($log_time, $ap_ip, $est_ip, $count)");
            }
        }

        return $success;
    }

    public function wipeAPConnHistory($ip_end) {
        $one_day_ago = date("YmdHis", time() - 24 * 3600);
        $ap_db = new SQLite3(SQLiteDBFactory::getAPConnStatsDB($ip_end));
        if ($stm = $ap_db->prepare("DELETE FROM ap_conn_history WHERE log_time < :time")) {
            $stm->bindParam(':time', $one_day_ago, SQLITE3_TEXT);
            $ret = $stm->execute();
            if (!$ret) {
                Logger::getInstance()->error(__METHOD__.": stats_ap_conn_AP".$ip_end.".db 移除一天前資料失敗【".$one_day_ago.", ".$ap_db->lastErrorMsg()."】");
            }
            Logger::getInstance()->info(__METHOD__.": 移除一天前連線資料成功。($ip_end)");
            return $ret;
        }
        
        Logger::getInstance()->warning(__METHOD__.": 準備資料庫 statement [ DELETE FROM ap_conn_history WHERE log_time < :time ] 失敗。($ip_end)");
        return false;
    }

    public function wipeAllAPConnHistory() {
        $postfixs = System::getInstance()->getWebAPPostfix();
        foreach ($postfixs as $postfix) {
            $this->wipeAPConnHistory($postfix);
        }
    }
}
