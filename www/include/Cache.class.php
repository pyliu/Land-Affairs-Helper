<?php
require_once("init.php");
require_once("System.class.php");
require_once("DynamicSQLite.class.php");
require_once("SQLiteSYSAUTH1.class.php");
require_once('SQLiteUser.class.php');
require_once("Ping.class.php");
require_once("OraDB.class.php");
require_once("Ping.class.php");
require_once("LXHWEB.class.php");

class Cache {
    // singleton
    private static $_instance = null;

    private const DEF_CACHE_DB = ROOT_DIR.DIRECTORY_SEPARATOR."assets".DIRECTORY_SEPARATOR."db".DIRECTORY_SEPARATOR."cache.db";
    private $sqlite3 = null;
    private $db_path = self::DEF_CACHE_DB;

    private function init() {
        if (!file_exists($this->db_path)) {
            $sqlite = new DynamicSQLite($this->db_path);
            $sqlite->initDB();
            $table = new SQLiteTable('cache');
            $table->addField('key', 'TEXT PRIMARY KEY');
            $table->addField('value', 'TEXT');
            $table->addField('expire', 'INTEGER NOT NULL DEFAULT 864000');
            $sqlite->createTable($table);
        }
    }

    private function getSqliteDB() {
        if ($this->sqlite3 === null) {
            $this->sqlite3 = new SQLite3($this->db_path);
        }
        return $this->sqlite3;
    }

    private function queryOraUsers($refresh = false) {
        if ($refresh === true) {
            global $log;
            $system = System::getInstance();
        
            // check if l3hweb is reachable
            $l3hweb_ip = $system->get('ORA_DB_L3HWEB_IP');
            $l3hweb_port = $system->get('ORA_DB_L3HWEB_PORT');
            $latency = pingDomain($l3hweb_ip, $l3hweb_port);
        
            // not reachable use office DB instead
            if ($latency > 999 || $latency == '') {
                $log->warning(__METHOD__.": $l3hweb_ip:$l3hweb_port is not reachable, use local DB instead.");
                $result = array();
                // check if the main db is reachable
                $main_db_ip = $system->get('ORA_DB_HXWEB_IP');
                $main_db_port = $system->get('ORA_DB_HXWEB_PORT');
                $latency = pingDomain($main_db_ip, $main_db_port);
                if ($latency > 999 || $latency == '') {
                    return $result;
                }
        
                $db = $system->getOraMainDBConnStr();
                $log->info(__METHOD__.": query system ORA_DB_HXHEB database users.");
                $log->info(__METHOD__.": $db");
                
                $conn = oci_connect($system->get("ORA_DB_USER"), $system->get("ORA_DB_PASS"), $db, "US7ASCII");
                if (!$conn) {
                    $e = oci_error();
                    trigger_error(htmlentities($e['message'], ENT_QUOTES), E_USER_ERROR);
                }
                // Prepare the statement
                $stid = oci_parse($conn, "SELECT DISTINCT USER_ID, USER_NAME FROM SSYSAUTH1 UNION SELECT DISTINCT USER_ID, USER_NAME FROM SSYSAUTH1V");
                if (!$stid) {
                    $e = oci_error($conn);
                    trigger_error(htmlentities($e['message'], ENT_QUOTES), E_USER_ERROR);
                }
                
                // Perform the logic of the query
                $r = oci_execute($stid);
                if (!$r) {
                    $e = oci_error($stid);
                    trigger_error(htmlentities($e['message'], ENT_QUOTES), E_USER_ERROR);
                }
                while ($row = oci_fetch_array($stid, OCI_ASSOC + OCI_RETURN_NULLS)) {
                    $result[$row["USER_ID"]] = mb_convert_encoding(preg_replace('/\d+/', "", $row["USER_NAME"]), "UTF-8", "BIG5");
                }
                if ($stid) {
                    oci_free_statement($stid);
                }
                if ($conn) {
                    oci_close($conn);
                }
                return $result;
            } else {
                // actually connects to L3HWEB for the user names
                $lxhweb = new LXHWEB(CONNECTION_TYPE::L3HWEB);
                return $lxhweb->querySYSAUTH1UserNames();
            }
        } else {
            // cached data
            $sysauth1 = new SQLiteSYSAUTH1();
            $cached = $sysauth1->getAllUsers();
            $result = array();
            foreach ($cached as $row) {
                $result[$row["USER_ID"]] = $row["USER_NAME"];
            }
            return $result;
        }
    }

    // private because of singleton
    private function __construct($path = self::DEF_CACHE_DB) {
        $this->db_path = $path;
        $this->init();
    }

    // private because of singleton
    private function __clone() { }

    function __destruct() { }
    
    // singleton
    public static function getInstance($path = self::DEF_CACHE_DB) {
        if (!(self::$_instance instanceof Cache)) {
            self::$_instance = new Cache($path);
        }
        return self::$_instance;
    }

    public function getExpireTimestamp($key) {
        // mock mode always returns now + 300 seconds (default)
        if (System::getInstance()->isMockMode()) {
            $seconds = System::getInstance()->get('MOCK_CACHE_SECONDS') ?? 300;
            return time() + $seconds;
        }
        // $val should be time() + $expire in set method
        $val = $this->getSqliteDB()->querySingle("SELECT expire from cache WHERE key = '$key'");
        if (empty($val)) return 0;
        return intval($val);
    }

    public function set($key, $val, $expire = 86400) {
        if (System::getInstance()->isMockMode()) return false;
        $stm = $this->getSqliteDB()->prepare("
            REPLACE INTO cache ('key', 'value', 'expire')
            VALUES (:key, :value, :expire)
        ");
        $stm->bindParam(':key', $key);
        $stm->bindValue(':value', serialize($val));
        $stm->bindValue(':expire', time() + $expire); // in seconds, 86400 => one day
        return $stm->execute() === FALSE ? false : true;
    }

    public function get($key) {
        $val = $this->getSqliteDB()->querySingle("SELECT value from cache WHERE key = '$key'");
        if (empty($val)) return false;
        return unserialize($val);
    }

    public function del($key) {
        if (System::getInstance()->isMockMode()) return false;
        $stm = $this->getSqliteDB()->prepare("DELETE from cache WHERE key = :key");
        $stm->bindParam(':key', $key);
        return $stm->execute() === FALSE ? false : true;
    }

    public function isExpired($key) {
        if (System::getInstance()->isMockMode()) return false;
        return time() > $this->getExpireTimestamp($key);
    }

    public function getUserNames($refresh = false) {
        $system = System::getInstance();
        $result = $this->queryOraUsers(false);  // get cached data in SYSAUTH1.db

        if ($system->isMockMode() === true) {
            return $result;
        } else if ($this->isExpired('user_mapping_cached_datetime') || $refresh === true) {
            $result = $this->queryOraUsers(true);
            try {
                $sysauth1 = new SQLiteSYSAUTH1();
                /**
                 * Also get user info from SQLite DB
                 */
                $sqlite_user = new SQLiteUser();
                $all_users = $sqlite_user->getAllUsers();
                foreach($all_users as $this_user) {
                    $user_id = trim($this_user["id"]);
                    if (empty($user_id) || $sysauth1->exists($user_id)) {
                        continue;
                    }
                    $name_filtered = preg_replace('/\d+/', "", trim($this_user["name"]));
                    $result[$user_id] = $name_filtered;
                    $tmp_row = array(
                        "USER_ID" => $user_id,
                        "USER_NAME" => $name_filtered,
                        "USER_PSW" => "",
                        "GROUP_ID" => "",
                        "VALID" => 1
                    );
                    $sysauth1->import($tmp_row);
                }
            } catch (\Throwable $th) {
                //throw $th;
                global $log;
                $log->error("取得SQLite內網使用者失敗。【".$th->getMessage()."】");
            } finally {
                $this->set('user_mapping_cached_datetime', date("Y-m-d H:i:s"), 86400);
            }
        }

        return $result;
    }
}
