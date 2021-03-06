<?php
require_once('init.php');
require_once('SQLiteUser.class.php');

abstract class IPResolver {
    private static $server_map = array(
        '220.1.34.43' => 'G08儲存',
        '220.1.34.3' => 'AD主機',
        '220.1.34.212' => 'PS謄本主機',
        '220.1.34.211' => '建物平面圖同步主機',
        '220.1.35.214' => 'PS權狀主機',
        '220.1.34.204' => '次AD主機',
        '220.1.34.205' => 'AP1登記(1)',
        '220.1.34.206' => 'AP2登記(2)',
        '220.1.34.156' => 'AP8地價',
        '220.1.34.207' => 'AP3測量(1)',
        '220.1.34.62' => 'AP6測量(2)',
        '220.1.34.118' => 'AP15工作站',
        '220.1.34.161' => 'AP61跨域',
        '220.1.34.60' => 'AP14外掛',
        '220.1.34.50' => '資料庫HA-MASTER',
        '220.1.34.51' => '資料庫HA-SLAVE',
        '220.1.33.5' => '局同步異動',
        '220.5.61.33' => '內政部主機'
    );
    private static $remote_eps = array(
        '220.1.34.2' => '資料庫',
        '220.1.33.71' => '地政局',
        '220.1.35.123' => '中壢跨域',
        '220.1.37.246' => '楊梅跨域',
        '220.1.38.30' => '蘆竹跨域',
        '220.1.34.161' => '桃園跨域',
        '220.1.36.45' => '大溪跨域',
        '220.1.39.57' => '八德跨域',
        '220.1.40.33' => '平鎮跨域',
        '220.1.41.20' => '龜山跨域',
        '220.2.33.85' => '自強櫃台',
        '220.2.33.84' => '自強審查',
        '220.2.33.89' => '普義櫃台1',
        '220.2.33.90' => '普義審查',
        '220.2.33.93' => '普義櫃台2',
        '220.2.33.44' => '觀音櫃台',
        '220.2.33.43' => '觀音審查'
    );

    function __construct() { }

    function __destruct() { }

    public static function resolve($ip) {
        if (filter_var($ip, FILTER_VALIDATE_IP)) {
            if (array_key_exists($ip, IPResolver::$server_map)) {
                return IPResolver::$server_map[$ip];
            } else if (array_key_exists($ip, IPResolver::$remote_eps)) {
                return IPResolver::$remote_eps[$ip];
            }
            // find user by ip address
            $sqlite_user = new SQLiteUser();
            $user_data = $sqlite_user->getUserByIP($ip);
            if (array_key_exists(0, $user_data)) {
                return $user_data[0]['name'];
            }
            return '';
        } else {
            Logger::getInstance()->warning(__METHOD__.": Not a valid IP address. [$ip]");
        }
        return false;
    }

    public static function isServerIP($ip) {
        return array_key_exists($ip, IPResolver::$server_map);
    }
    
}
