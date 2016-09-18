<?
$page_logo = "/img/logo-navigator.png";

$page_head_css = <<<PHP_HEAD_CSS
<link rel="stylesheet" href="css/page.navigator.css" />
PHP_HEAD_CSS;

$page_head_js = <<<PHP_HEAD_JS
PHP_HEAD_JS;

$page_topmenu = <<<PHP_TOPMENU
PHP_TOPMENU;

$page_topbar = <<<PHP_TOPBAR
PHP_TOPBAR;
//<area id="garmin" shape="rect" coords="335,1,625,85" href="http://gis-lab.info/data/mp" target="blank">

$page_content = <<<PHP_CONTENT
<div id="center">
<p class="head">Нажмите на изображение навигатора, чтобы скачать для него карту объектов ДРСК</p>
<p class="text">Скачать приложение Osmand можно по <a href="https://play.google.com/store/apps/details?id=net.osmand">ссылке</a></p>
</div>
<div id="ncontent">
<img src="/img/osmand.png" usemap="#navigators">
<map id="navigators" name="navigators">
<area id="osmand" shape="rect" coords="1,1,275,95" href="http://export.osm.prim.drsk.ru/osmand/drsk_map.obf" target="blank">
</map>
</div>

PHP_CONTENT;
?>
