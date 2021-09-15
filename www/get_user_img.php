<?php
require_once("./include/init.php");

$default_path = ROOT_DIR.DIRECTORY_SEPARATOR."assets".DIRECTORY_SEPARATOR."img".DIRECTORY_SEPARATOR."users".DIRECTORY_SEPARATOR;

$key = array_key_exists('id', $_REQUEST) ? $_REQUEST['id'] : '';
// $full_path = $default_path.$key.'.jpg';
$full_path = $default_path.$key.'.jpg';
if (!file_exists($full_path)) {
    $key = $_REQUEST["name"];
    $full_path = $default_path.$_REQUEST["name"].'.jpg';
    if (!file_exists($full_path)) {
        $key = 'not_found';
        $full_path = $default_path.'not_found.jpg';
    }
}

$finfo = finfo_open(FILEINFO_MIME_TYPE);
$contentType = finfo_file($finfo, $full_path);
finfo_close($finfo);
header('Content-Type: ' . $contentType);
header('Content-Length: '.filesize($full_path));
ob_clean();
flush();
readfile($full_path);
