<?
Header('Content-Type: text/html; charset=UTF-8');
setlocale(LC_ALL, 'ru_RU.UTF-8');

include_once ('passwd.php');
include_once ('functions.php');
include_once ('db.php');

$PERSMAP_MAX_POINTS = 1500;
$PERSMAP_MAX_LINE_POINTS = 600;

$pages_menu=array(
"map" => array("name"=>"map","text"=>"Карта Online","color"=>"#99bd1b") ,
//"navigator" => array("name"=>"navigator","text"=>"Для навигаторов","color"=>"#f58720"),
"fires" => array("name"=>"fires","text"=>"Пожары","color"=>"#f58720"),
"power_stations" => array("name"=>"power_stations","text"=>"Подстанции","color"=>"#f58720"),
"tp_stations" => array("name"=>"tp_stations","text"=>"ТП/ЗТП/КТП","color"=>"#f58720"),
"about" => array("name"=>"about","text"=>"О проекте","color"=>"#db4c39")
);

$db_type = "postgresql";

if (function_exists("pg_connect")) { // чтобы можно было тестировать не поднимая БД
  $dbapi = db_open($db_type, $pg_base, $pg_user, $pg_pass, $pg_host);

  pg_connect("host='".$pg_host."' user='".$pg_user."' password='".$pg_pass."' dbname='".$pg_base."'");
  //mysql_query('SET CHARACTER SET utf8');
  //mysql_query('SET NAMES utf8');
  //mysql_select_db($mysql_base);
}

session_start();
ob_start();
?>
