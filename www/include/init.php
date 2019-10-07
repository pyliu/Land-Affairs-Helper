<?php
date_default_timezone_set("ASIA/TAIPEI");
session_start();
// some query take long time ...
set_time_limit(0);

require_once("Config.inc.php");
require_once("GlobalConstants.inc.php");
require_once("GlobalFunctions.inc.php");
require_once("Logger.class.php");

$client_ip = $_SERVER["REMOTE_ADDR"];
if (!empty($_SERVER["HTTP_CLIENT_IP"])) {
    $client_ip = $_SERVER["HTTP_CLIENT_IP"];
} elseif (!empty($_SERVER["HTTP_X_FORWARDED_FOR"])) {
    $client_ip = $_SERVER["HTTP_X_FORWARDED_FOR"];
}

$today_ad = date('Y-m-d');  // ex: 2019-09-16
$log = new Logger('logs/log-' . $today_ad . '.log');

if (!in_array($client_ip, SYSTEM_CONFIG["ADM_IPS"])) {
    $log->warning($client_ip." tried to access the mgt system.");
    die("<(￣ ﹌ ￣)> ".$client_ip);
}

// compress all log every monday
if (date("w") == "1" && !$_SESSION["LOG_COMPRESSION_DONE"]) {
    $log->info("今天星期一，開始壓縮LOG檔！");
    zipLogs();
    $_SESSION["LOG_COMPRESS_DONE"] = true;
    $log->info("壓縮LOG檔結束！");
    
}

$tw_date = new Datetime("now");
$tw_date->modify("-1911 year");
$this_year = ltrim($tw_date->format("Y"), "0");	// ex: 108
$today = ltrim($tw_date->format("Ymd"), "0");	// ex: 1080325
$tw_date->modify("-1 week");
$week_ago = ltrim($tw_date->format("Ymd"), "0");	// ex: 1080318
?>
