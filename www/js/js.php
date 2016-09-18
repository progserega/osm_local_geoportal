<?php
header('Content-type: application/javascript');

$UrlJs = preg_replace("/^(.*?)js\.php$/is", "$1", $_SERVER['SCRIPT_NAME']);
$UrlJs = preg_replace("/^".preg_quote($UrlJs, "/")."/is", "", urldecode($_SERVER['REQUEST_URI']));
$UrlJs = preg_replace("/(\/?)(\?.*)?$/is", "", $UrlJs);
$UrlJs = preg_replace("/[^0-9A-Za-z._\\-\\/]/is", "", $UrlJs); // вырезаем ненужные символы (не обязательно это делать)

$UrlJs = preg_replace("/[^\/]+\//is", "", $UrlJs);
$UrlJs = preg_replace("/.[^.]+$/is", "", $UrlJs);

$fileList = glob($UrlJs."/*.js");

if (!sizeof($fileList)) {
  include_once '../404.php';
}

// создание js

// список скриптов
echo "(function() {\n";
echo "  var file = [\n";
$files = "    '/js/" . implode("',\n    '/js/", $fileList) . "'\n";
echo $files;
echo "  ];\n";

// добавление на сайт скриптов
$endJs = <<<PHP_END_JS
  for (var i = 0; i < file.length; i++)
    document.writeln("<script src='" + file[i] + "'></script>");
})();
PHP_END_JS;
echo $endJs;

?>
