<?
$page_logo = "/img/logo_drsk.gif";

$page_head_css = <<<PHP_HEAD_CSS
<link rel="stylesheet" href="css/page.navigator.css" />
PHP_HEAD_CSS;

$page_head_js = <<<PHP_HEAD_JS
PHP_HEAD_JS;

$page_topmenu = <<<PHP_TOPMENU
PHP_TOPMENU;

$page_topbar = <<<PHP_TOPBAR
PHP_TOPBAR;

$param1 = "nohead";

$command = "python /opt/osm/local_web_services/fires/index.cgi";
$command .= " $param1 2>&1";

/*
$page_content = "<style type='text/css'>
body{
background:#000;
color: #7FFF00;
font-family:'Lucida Console',sans-serif !important;
font-size: 12px;
}
</style>"
dddw
*/
$pid = popen( $command,"r");

while( !feof( $pid ) ) 
{
$page_content .= fread($pid, 256);
flush();
ob_flush();
//$page_content .= "<script>window.scrollTo(0,99999);</script>";
//usleep(100000);
}
pclose($pid);

//$page_content .= "</pre><script>window.scrollTo(0,99999);</script>";
//$page_content .= "<br /><br />Script finalizado<br /><br />";


?>
