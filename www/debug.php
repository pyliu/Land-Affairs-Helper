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
require_once("./include/SQLiteUser.class.php");
require_once("./include/System.class.php");
require_once("./include/Temperature.class.php");
require_once("./include/StatsSQLite3.class.php");
require_once("./include/Ping.class.php");

try {
    $dog = new Watchdog();
    var_dump($dog->findProblematicSURCases());
}
catch(Exception $e)
{
    die($e->getMessage());
}
