<?php
require_once('init.php');
require_once('DynamicSQLite.class.php');

class SQLiteDBFactory {

    public static function getIPResolverDB() {
        $path = ROOT_DIR.DIRECTORY_SEPARATOR."assets".DIRECTORY_SEPARATOR."db".DIRECTORY_SEPARATOR."IPResolver.db";
        $sqlite = new DynamicSQLite($path);
        $sqlite->initDB();
        $sqlite->createTableBySQL('
            CREATE TABLE IF NOT EXISTS "IPResolver" (
                "ip" TEXT NOT NULL,
                "added_type" TEXT NOT NULL DEFAULT \'DYNAMIC\',
                "entry_type" TEXT NOT NULL DEFAULT \'USER\',
                "entry_desc" TEXT NOT NULL,
                "entry_id" TEXT,
                "timestamp" NUMERIC NOT NULL,
                "note" TEXT,
                PRIMARY KEY("ip", "added_type", "entry_type")
            )
        ');
        return $path;
    }

    public static function getRKEYNALLDB() {
        $path = ROOT_DIR.DIRECTORY_SEPARATOR."assets".DIRECTORY_SEPARATOR."db".DIRECTORY_SEPARATOR."RKEYN_ALL.db";
        $sqlite = new DynamicSQLite($path);
        $sqlite->initDB();
        $sqlite->createTableBySQL('
            CREATE TABLE IF NOT EXISTS "RKEYN_ALL" (
                "KCDE_1"	TEXT NOT NULL,
                "KCDE_2"	TEXT NOT NULL,
                "KCDE_3"	TEXT NOT NULL,
                "KCDE_4"	TEXT,
                "KNAME"	TEXT NOT NULL,
                "KRMK"	TEXT
            )
        ');
        return $path;
    }

    public static function getRKEYNDB() {
        $path = ROOT_DIR.DIRECTORY_SEPARATOR."assets".DIRECTORY_SEPARATOR."db".DIRECTORY_SEPARATOR."RKEYN.db";
        $sqlite = new DynamicSQLite($path);
        $sqlite->initDB();
        $sqlite->createTableBySQL('
            CREATE TABLE IF NOT EXISTS "RKEYN" (
                "KCDE_1"	TEXT NOT NULL,
                "KCDE_2"	TEXT NOT NULL,
                "KCNT"	TEXT NOT NULL,
                "KRMK"	TEXT,
                PRIMARY KEY("KCDE_1", "KCDE_2")
            )
        ');
        return $path;
    }

    public static function getCaseCodeDB() {
        $path = ROOT_DIR.DIRECTORY_SEPARATOR."assets".DIRECTORY_SEPARATOR."db".DIRECTORY_SEPARATOR."CaseCode.db";
        $sqlite = new DynamicSQLite($path);
        $sqlite->initDB();
        $sqlite->createTableBySQL('
            CREATE TABLE IF NOT EXISTS "CaseCode" (
                "KCDE_2"	TEXT NOT NULL,
                "KCNT"	TEXT NOT NULL,
                "KRMK"	TEXT,
                PRIMARY KEY("KCDE_2")
            )
        ');
        return $path;
    }

    public static function getRegUntakenStoreDB() {
        $db_path = DB_DIR.DIRECTORY_SEPARATOR.'reg_untaken_store.db';
        $sqlite = new DynamicSQLite($db_path);
        $sqlite->initDB();
        $sqlite->createTableBySQL('
            CREATE TABLE IF NOT EXISTS "reg_untaken_store" (
                "case_no"	TEXT,
                "taken_date" TEXT,
                "taken_status" TEXT,
                "lent_date" TEXT,
                "return_date" TEXT,
                "borrower" TEXT,
                "note"	TEXT,
                PRIMARY KEY("case_no")
            )
        ');
        return $db_path;
    }

    public static function getRegAuthChecksStoreDB() {
        $db_path = DB_DIR.DIRECTORY_SEPARATOR.'reg_auth_checks_store.db';
        $sqlite = new DynamicSQLite($db_path);
        $sqlite->initDB();
        $sqlite->createTableBySQL('
            CREATE TABLE IF NOT EXISTS "reg_auth_checks_store" (
                "case_no"	TEXT,
                "authority"	INTEGER NOT NULL DEFAULT 0,
                "note"	TEXT,
                PRIMARY KEY("case_no")
            )
        ');
        return $db_path;
    }

    public static function getRegFixCaseStoreDB() {
        $db_path = DB_DIR.DIRECTORY_SEPARATOR.'reg_fix_case_store.db';
        $sqlite = new DynamicSQLite($db_path);
        $sqlite->initDB();
        $sqlite->createTableBySQL('
            CREATE TABLE IF NOT EXISTS "reg_fix_case_store" (
                "case_no"	TEXT,
                "notify_delivered_date"	TEXT,
                "note"	TEXT,
                PRIMARY KEY("case_no")
            )
        ');
        return $db_path;
    }

    public static function getSYSAUTH1DB() {
        $path = ROOT_DIR.DIRECTORY_SEPARATOR."assets".DIRECTORY_SEPARATOR."db".DIRECTORY_SEPARATOR."SYSAUTH1.db";
        $sqlite = new DynamicSQLite($path);
        $sqlite->initDB();
        $sqlite->createTableBySQL('
            CREATE TABLE IF NOT EXISTS "SYSAUTH1" (
                "USER_ID"	TEXT NOT NULL,
                "USER_PSW"	TEXT,
                "USER_NAME"	TEXT NOT NULL,
                "GROUP_ID"	INTEGER,
                "VALID"	INTEGER NOT NULL DEFAULT 0,
                PRIMARY KEY("USER_ID")
            )
        ');
        $sqlite->createTableBySQL('
            CREATE TABLE IF NOT EXISTS "SYSAUTH1_ALL" (
                "USER_ID"	TEXT NOT NULL,
                "USER_NAME"	TEXT,
                PRIMARY KEY("USER_ID")
            )
        ');
        return $path;
    }

    public static function getLAHDB() {
        $db_path = DEF_SQLITE_DB;
        $sqlite = new DynamicSQLite($db_path);
        $sqlite->initDB();
        $sqlite->createTableBySQL('
            CREATE TABLE IF NOT EXISTS "overdue_stats_detail" (
                "datetime"	TEXT NOT NULL,
                "id"	TEXT NOT NULL,
                "count"	NUMERIC NOT NULL DEFAULT 0,
                "note"	TEXT,
                PRIMARY KEY("id","datetime")
            )
        ');
        $sqlite->createTableBySQL('
            CREATE TABLE IF NOT EXISTS "stats" (
                "ID"	TEXT,
                "NAME"	TEXT NOT NULL,
                "TOTAL"	INTEGER NOT NULL DEFAULT 0,
                PRIMARY KEY("ID")
            )
        ');
        $sqlite->createTableBySQL('
            CREATE TABLE IF NOT EXISTS "stats_raw_data" (
                "id"	TEXT NOT NULL,
                "data"	TEXT,
                PRIMARY KEY("id")
            )
        ');
        $sqlite->createTableBySQL('
            CREATE TABLE IF NOT EXISTS "xcase_stats" (
                "datetime"	TEXT NOT NULL,
                "found"	INTEGER NOT NULL DEFAULT 0,
                "note"	TEXT,
                PRIMARY KEY("datetime")
            )
        ');
        return $db_path;
    }

    public static function getAPConnStatsDB($ip_end) {
        $db_path = DB_DIR.DIRECTORY_SEPARATOR.'stats_ap_conn_AP'.$ip_end.'.db';
        $sqlite = new DynamicSQLite($db_path);
        $sqlite->initDB();
        $sqlite->createTableBySQL('
            CREATE TABLE IF NOT EXISTS "ap_conn_history" (
                "log_time"	TEXT NOT NULL,
                "ap_ip"	TEXT NOT NULL,
                "est_ip"	TEXT NOT NULL,
                "count"	INTEGER NOT NULL DEFAULT 0,
                "batch"	INTEGER NOT NULL DEFAULT 0,
                PRIMARY KEY("log_time","ap_ip","est_ip")
            )
        ');
        return $db_path;
    }
    
    public static function getConnectivityDB() {
        $db_path = DB_DIR.DIRECTORY_SEPARATOR."connectivity.db";
        $sqlite = new DynamicSQLite($db_path);
        $sqlite->initDB();
        $sqlite->createTableBySQL('
            CREATE TABLE IF NOT EXISTS "connectivity" (
                "log_time"	TEXT NOT NULL,
                "target_ip"	TEXT NOT NULL,
                "status"    TEXT NOT NULL DEFAULT \'DOWN\',
                "latency"	REAL NOT NULL DEFAULT 0.0,
                PRIMARY KEY("log_time","target_ip")
            )
        ');
        $sqlite->createTableBySQL('
            CREATE TABLE IF NOT EXISTS "target" (
                "ip"	TEXT NOT NULL,
                "port"	INTEGER,
                "name"	TEXT NOT NULL,
                "monitor"	TEXT NOT NULL DEFAULT \'Y\',
                "note"	TEXT,
                PRIMARY KEY("ip")
            )
        ');
        return $db_path;
    }

    private function __construct() {}

    function __destruct() {}

}
