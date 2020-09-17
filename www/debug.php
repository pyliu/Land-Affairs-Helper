﻿<?php
require_once("./include/init.php");
require_once("./include/Query.class.php");
require_once("./include/Message.class.php");
require_once("./include/StatsOracle.class.php");
require_once("./include/Logger.class.php");
require_once("./include/TdocUserInfo.class.php");
require_once("./include/api/FileAPICommandFactory.class.php");
require_once("./include/Watchdog.class.php");
require_once("./include/StatsOracle.class.php");

echo date("Ymdhis", strtotime("-10 minutes"));
echo "\n\ntest\n\n";

$user_info = new SQLiteUser();
$users = $user_info->getTopTreeData();
var_dump($users);
?>
