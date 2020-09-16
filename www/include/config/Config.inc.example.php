<?php
const SYSTEM_CONFIG = array(
    "GA_IPS" => array(
        "總務" => "xxx.xxx.xxx.xxx"
    ),
    "RAE_IPS" => array(
        "研考" => "xxx.xxx.xxx.xxx"
    ),
    "SUPER_IPS" => array(
        "開發者" => "xxx.xxx.xxx.xxx"
    ),
    "CHIEF_IPS" => array(
        "資訊課長" => "xxx.xxx.xxx.xxx"
    ),
    // Only allow adm IP to access
    "ADM_IPS" => array(
        "誰" => "xxx.xxx.xxx.xxx",
        "伺服器" => "::1"
    ),
    "USER_PHOTO_FOLDER" => '\\\\xxx.xxx.xxx.xxx\\Pho\\',    // used for getting default fallback user image
    "MOCK_MODE" => false,
    // bureau
    "ORA_DB_L3HWEB" => "(DESCRIPTION=(ADDRESS_LIST=(ADDRESS=(PROTOCOL=TCP)(HOST=xxx.xxx.xxx.xxx)(PORT=xxxx)))(CONNECT_DATA=(SERVICE_NAME=XXXXX)))",
    // test svr
    "ORA_DB_TWEB" => "(DESCRIPTION=(ADDRESS_LIST=(ADDRESS=(PROTOCOL=TCP)(HOST=xxx.xxx.xxx.xxx)(PORT=xxxx)))(CONNECT_DATA=(SERVICE_NAME=XXXXX)))",
    // main db
    "ORA_DB_MAIN" => "(DESCRIPTION=(ADDRESS_LIST=(ADDRESS=(PROTOCOL=TCP)(HOST=xxx.xxx.xxx.xxx)(PORT=xxxx)))(CONNECT_DATA=(SERVICE_NAME=XXXXX)))",
    "ORA_DB_USER" => "xxxxxx",
    "ORA_DB_PASS" => "xxxxxx",
    // for message
    "MS_DB_SVR" => "xxx.xxx.xxx.xxx",
    "MS_DB_DATABASE" => "xxxxxx",
    "MS_DB_UID" => "xxxxxx",
    "MS_DB_PWD" => "xxxxxx",
    "MS_DB_CHARSET" => "xxxxxx",
    // for internal user data
    "MS_TDOC_DB_SVR" => "xxx.xxx.xxx.xxx",
    "MS_TDOC_DB_DATABASE" => "xxxxxx",
    "MS_TDOC_DB_UID" => "xxxxxx",
    "MS_TDOC_DB_PWD" => "xxxxxx",
    "MS_TDOC_DB_CHARSET" => "xxxxxx"
);
?>
