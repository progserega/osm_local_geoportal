<?
$page_logo = "/img/logo_drsk.gif";

$page_head_css = <<<PHP_HEAD_CSS
  <link rel="stylesheet" href="/css/page.about.css" />
PHP_HEAD_CSS;

$page_head_js = <<<PHP_HEAD_JS
  <script type="text/javascript" src="/js/page.about.js"></script>
PHP_HEAD_JS;

$page_topmenu = <<<PHP_TOPMENU
PHP_TOPMENU;

$page_topbar = <<<PHP_TOPBAR
  <!--<div class="top-about">Отдельное спасибо компании <a target="_blank" href="http://rambler.ru">Рамблер</a> за всестороннюю помощь проекту!
  </div>-->

PHP_TOPBAR;

$page_content = <<<PHP_CONTENT
<div id="page-about">
  <div id="left">
    <img id="img-osm-help" class="menu-img" src='/img/osm-ru.png' />
    <img id="img-osm-ru" class="menu-img" src='/img/osm-ru.png' />
    <img id="img-osm-new" class="menu-img" src='/img/osm-ru.png' />
    <img id="img-osm-org" class="menu-img" src='/img/osm-org.png' />
    <img id="img-osm-dev" class="menu-img" src='/img/osm-dev.png' />
    <img id="img-osm-utils" class="menu-img" src='/img/osm-dyk.png' />
    <div id='menu'>
      <ul>
        <li id="menu-osm-help"><a href="/about/help">Помощь по использованию</a></li>
        <li id="menu-osm-new"><a href="/about/new">Что нового</a></li>
        <li id="menu-osm-ru"><a href="/about/ru">Разработчики</a></li>
        <li id="menu-osm-utils"><a href="/about/utils">Дополнительные инструменты</a></li>
        <li id="menu-osm-org"><a href="/about/org">Исходный код</a></li>
        <li id="menu-osm-dev"><a href="/about/dev">Полезные ссылки</a></li>
      </ul>
    </div>
  </div>
  <div id="center">
    <div id="osm-help" class="content">
       <div class="section">
        <p class="head">Использование поиска</p>
        <p class="text"><b>Поиск объектов АО "ДРСК" по имени:</b>
		</p>
        <p class="text">Для поиска объекта АО ДРСК введите часть его имени в строку поиска и нажмите кнопку "поиск".</p>
        <p class="text"><b>Поиск опоры по имени линии и номеру опоры:</b>
		</p>
        <p class="text">Для поиска опоры линии введите имя линии или часть имени линии, запятую, имя опоры или часть имени опоры. Например: 
		<a href="/#map=14/43.17/132.7491&layer=Mpjq&q=%D0%B0%D0%BD%D0%B8%D1%81%D0%B8%D0%BC%D0%BE%D0%B2%D0%BA%D0%B0,%20201&qmap=">анисимовка, 201</a> (можно нажать по ссылке) и в списке результатов поиска выбрать нужное.
		</p>
        <p class="text"><b>Поиск разъединителя на линии линии:</b>
		</p>
        <p class="text">Для поиска опоры, содержащей разъединитель - введите имя линии или часть имени линии, запятую, ключевое слово "разъед". Например: 
		<a href="/#map=18/43.08853/131.96387&layer=Mqj&q=%D0%B3%D0%BE%D0%BB%D0%B4%D0%BE%D0%B1%D0%B8%D0%BD,%20%D1%80%D0%B0%D0%B7%D1%8A%D0%B5%D0%B4&qmap=">голдобин, разъед</a> (можно нажать по ссылке) и в списке результатов поиска выбрать нужное. Опоры с разъединителем выделены красным фоном и символом переключателя.
		</p>
        <p class="text"><b>Поиск места по известным координатам:</b>
		</p>
        <p class="text">В строку поиска введите известные вам координаты, и карта перейдёт по этим координатам. Координаты можно вводить как в "десятичном формате" (пример: 
		<a href="/#map=16/43.1769/132.778&layer=M&q=43.17694%20132.77804&qmap=">43.17694 132.77804</a>
		) или же в формате "градусы°минуты′секунды″ (пример: 
		<a href="/#map=16/43.185/132.768&layer=M&q=43%C2%B011%E2%80%B26%E2%80%B3%20132%C2%B046%E2%80%B25%E2%80%B3&qmap=">43°11′6″ 132°46′5″</a>
		) или же в формате "градусы'минуты'секунды" (пример: 
		<a href="/#map=16/43.185/132.768&layer=M&q=43%2711%276%20132%2746%275&qmap=">43'11'6 132'46'5</a>
		) - последняя запись удобна тем, что сложно вводить с клавиатуры символ градуса: '°'.
		</p>
        <p class="text"><b>Поиск земельного участка по кадастровому номеру:</b>
		</p>
        <p class="text">Для поиска земельного участка введите его кадастровый номер в поле поиска и нажмите "поиск". Например: 
		<a href="/#map=16/43.1105/131.9459&layer=Ms&q=25:28:010038:363&qmap=">25:28:010038:363</a> (можно нажать по ссылке) и в списке результатов поиска выбрать нужное.
		</p>
        <p class="text"><b>Поиск адреса объекта:</b>
		</p>
        <p class="text">Для поиска по обычному адресу введите адрес через запятую в поле поиска и нажмите "поиск". Например: 
		<a href="/#map=18/43.09987/131.9827&layer=Ms&q=%D0%92%D0%BB%D0%B0%D0%B4%D0%B8%D0%B2%D0%BE%D1%81%D1%82%D0%BE%D0%BA,%20%D0%9A%D0%BE%D0%BC%D0%B0%D0%BD%D0%B4%D0%BE%D1%80%D1%81%D0%BA%D0%B0%D1%8F,%2013&qmap=">Владивосток, Командорская, 13</a> (можно нажать по ссылке) и в списке результатов поиска выбрать нужное.
		</p>

      </div>

      <div class="section">
        <p class="head">Сообщение о неточностях на карте</p>
        <p class="text">На карте могут быть неточности. И любой пользователь карты может передать сообщение инженеру, ответственному за наполнение карты о том, что в данном месте содержится ошибка. Для этого на основной странице
		<a href="/#map">карты</a> слева посередине есть кнопка с изображдением восклицательного знака в красном кружочке. Нажмите её. После этого вы можете нажать в лбом месте карты и в выпадающем сообщении написать своё ФИО и описание неточности на карте. Поcле этого нажмите кнопку "Отправить замечание". В случае успешной отправки будет выведено соответствующее уведомление на экран. При первой же возможности инженер, ответственный за наполнение карты прочтёт ваше замечание и исправит неточность, либо свяжется с Вами.
		</p>
      </div>

      <div class="section">
        <p class="head">Рисование личной карты</p>
        <p class="text">Это позволяет легко нанести на карту свои линии и маркеры с подписями и поделиться полученным результатом с коллегой. Коллега может посмотреть эту карту по ссылке или отредактировать её и вы увидите изменения. При этом добавленные вами линии и маркеры не будут видны всем остальным, а будут видны только тем, с кем вы поделитесь ссылкой на вашу "персональную карту".</p>
        <p class="text">Чтобы создать "персональную карту" - на основном экране
		<a href="/#map">карты</a>
		в левом меню нажмите "Персональная карта" и выберите либо "поставить маркер" либо "Нарисовать путь". После этого на карте можно установить маркер, либо нарисовать путь. После того как вызакончили рисовать свою "персональную карту" - нажмите "Сохранить". После этого появится три ссылки: "Ссылка на просмотр" - скопируйте её (правой кнопкой мыши по ссылке, "копировать ссылку") и отправьте коллеге. Коллега сможет посмотреть вашу карту по этой ссылке. "Ссылка на редактирование" - соответственно даст вашему коллеге возможность изменить вашу карту, "Скачать GPX" - позволит скачать гео-файл формата 
		<a href="https://ru.wikipedia.org/wiki/GPX">GPX</a> с данными вашей персональной карты. Этот файл можно загрузить в большинстве программ по работе с ГЕО-данными на ПК и на мобильных устрйоствах.
		</p>
      </div>

      <div class="section">
        <p class="head">Функции разработчика</p>
        <p class="text">На основном экране 
		<a href="/#map">карты</a> 
		нажмите "Другие инструменты" и нажмите галочку "Режим маппера". После этого под "бегунком" масштабирования карты появится два значка: "карандашек" и красный "крестик".
		</p>
        <p class="text"><b>Быстрое редактирование в JOSM.</b>
		</p>
        <p class="text">Нажмите "карандашек", чтобы открыть просматриваемый участок карты в программе редактирования <a href="http://josm.ru">Josm</a> (перед этим в настройках Josm должно быть
		<a href="http://wiki.rs.int/doku.php/osm:josm#%D1%83%D0%B4%D0%B0%D0%BB%D1%91%D0%BD%D0%BD%D0%BE%D0%B5_%D1%83%D0%BF%D1%80%D0%B0%D0%B2%D0%BB%D0%B5%D0%BD%D0%B8%D0%B5">
		включено удалённое управление
		</a> 
		)
		</p>
        <p class="text"><b>Просмотр удалённых данных</b>
		</p>
        <p class="text">Если на карте нет данных, а Вы точно знаете, что они были внесены ранее, то есть вероятность, что эти данные были удалены из системы. Чтобы проверить это - найдите на карте место где, по-вашему, должны быть "исчезнувшие" данные и нажмите кнопку с изображением красного "крестика". В результате откроется страница со списком "правок" (пакетов изменений, которые совершили редакторы карты). Щёлкнув по ссыке любой из появившихся правок, можно посмотреть детальную информацию по данному пакету "правок" (зачёркнутые объекты - это удалённые с карты объекты). В том числе выяснить кто именно удалил эти данные ("ник" редактора).
		</p>
      </div>
    </div>
    <div id="osm-new" class="content">
       <div class="section">

        <p class="head">12.09.2016</p>
          <p class="text">
          Добавлена ссылка на прогноз погоды Windyty в разделе "Это место на другой карте" для просмотра прогноза погоды, выбранной в окне просмотра карты местности.
        </p>

        <p class="head">08.09.2016</p>
          <p class="text">
          Опоры 220, 500 кВ вынесены в отдельный слой. Добавлено отображение опор 500 кВ. Исправлена работа всплывающих сообщений по "клику" на объекте карты (отображается информация только для включеных слоёв - ранее порой вообще не отображалась).
        </p>

        <p class="head">06.09.2016</p>
          <p class="text">
      Добавлены слои с рельефом: "Рельеф OSM" и "Топо OSM".
        </p>

        <p class="head">01.09.2016</p>
          <p class="text">
      Добавлена возможность сообщать об ошибках на карте. (см. 
		<a href="/about/help">"Помощь по использованию"</a>		
		). 
        </p>

        <p class="head">29.08.2016</p>
        <p class="text">
		Добавлено свойство "разъединитель" у опоры. Так же изменено отображение таких опор (красный фон опоры и символ выключателя). Так же добавлена возможность поиска опор с разъединителями на линии (см. 
		<a href="/about/help">"Помощь по использованию"</a>		
		). 
		</p>

        <p class="head">24.08.2016</p>
        <p class="text">
		Переработан поиск. Добавлена возможность поиска по линиям и их опорам (см. 
		<a href="/about/help">"Помощь по использованию"</a>		
		). Так же добавлен раздел "Помощь по использованию" и "Что нового".
		</p>

      </div>
    </div>

    <div id="osm-ru" class="content">
       <div class="section">
        <p class="head">Разработка сайта, серверной ГЕО-инфраструктуры и сопутствующих утилит</p>
        <p class="text">Семёнов Сергей Валерьевич (<a href="mailto:semenov@rsprim.ru">semenov@rsprim.ru</a>, <a href="mailto:progserega@yandex.ru">progserega@yandex.ru</a>)</p>
        <p class="text">Техническая реализация идей, разработка утилит, скриптов, разворачивание серверной инфраструктуры проекта и её поддержка.</p>
      </div>
    </div>

    <div id="osm-org" class="content">
      <div class="section">
        <p class="head">Исходный открытый код - разработки ДРСК</p>
        <p class="text">Ссылки на локальный git-репозитарий. Брать с помощью команды: git clone ссылка</p>
        <ul>
          <li><a target="_blank" href="http://git.rs.int/osm/openstreetmap-ru_drsk.git">http://git.rs.int/osm/openstreetmap-ru_drsk.git</a> - исходный код сайта OpenStreetMap.ru с изменениями от ДРСК</li>
          <li><a target="_blank" href="http://git.rs.int/osm/drsk_osm_map_styles">http://git.rs.int/osm/drsk_osm_map_styles</a> - стили mapcss по отрисове объектов энерго-инфраструктуры</li>
          <li><a target="_blank" href="http://git.rs.int/osm/fires_data_process.git">http://git.rs.int/osm/fires_data_process.git</a> - утилиты по обработке и импорту данных пожаров НАСА</li>
          <li><a target="_blank" href="http://git.rs.int/osm/stapio_drsk.git">http://git.rs.int/osm/stapio_drsk.git</a> - исходный stapio с изменениями ДРСК - подсистемы импорта POI-данных на сайт</li>
          <li><a target="_blank" href="http://git.rs.int/osm/import_tp_loading.git">http://git.rs.int/osm/import_tp_loading.git</a> - скрипты и правила для бота по импорту загрузки ТП/КТП/ЗТП на сайт</li>
          <li><a target="_blank" href="http://git.rs.int/osm/import_station_loading.git">http://git.rs.int/osm/import_station_loading.git</a> - скрипты и правила для бота по импорту загрузки подстанций на сайт</li>
          <li><a target="_blank" href="http://git.rs.int/osm/power_lines_profile.git">http://git.rs.int/osm/power_lines_profile.git</a> - расчёт профиля линии</li>
          <li><a target="_blank" href="http://git.rs.int/osm/lines_with_zero_altitude.git">http://git.rs.int/osm/lines_with_zero_altitude.git</a> - генерация списка опор с нулевой высотой</li>
          <li><a target="_blank" href="http://git.rs.int/osm/osmcatalog_drsk.git">http://git.rs.int/osm/osmcatalog_drsk.git</a> - исходный osmCatalog с изменениями ДРСК - подсистемы импорта POI-данных на сайт</li>
          <li><a target="_blank" href="http://git.rs.int/osm/personal_map2osm_layer.git">http://git.rs.int/osm/personal_map2osm_layer.git</a> - скрипты генерации слоя объектов из личной карты пользователя на сайте (слой нарушений охранных зон)</li>
          <li><a target="_blank" href="http://git.rs.int/osm/tp_station_list.git">http://git.rs.int/osm/tp_station_list.git</a> - скрипты генерации списка ТП/КТП/ЗТП из базы ГЕО-данных или отображение из файла</li>
          <li><a target="_blank" href="http://git.rs.int/osm/map_power_station_list.git">http://git.rs.int/osm/map_power_station_list.git</a> - скрипты генерации списка подстанций из базы ГЕО-данных или отображение из файла</li>
        </ul>
        <p class="text">Ссылки на github-репозитарий. Заходить по ссылке браузером:</p>
        <ul>
          <li><a target="_blank" href="https://github.com/progserega/wms2png">https://github.com/progserega/wms2png</a> - генерация бумажной карты из тайлов</li>
          <li><a target="_blank" href="https://github.com/progserega/gpx2csv">https://github.com/progserega/gpx2csv</a> - конвертация gpx в csv</li>
          <li><a target="_blank" href="https://github.com/progserega/osmbot">https://github.com/progserega/osmbot</a> - робот, в автоматическом режиме обрабатывающий гео-данные на сервере через OSM-API по правилам, описанным в XML. Используется для автоматического импорта и правки ГЕО-данных</li>
          <li><a target="_blank" href="https://github.com/progserega/csv2osm">https://github.com/progserega/csv2osm</a> - конвертация данных из csv в osm-формат</li>
          <li><a target="_blank" href="https://github.com/progserega/gml2osm">https://github.com/progserega/gml2osm</a> - конвертация данных из gml (yandex) в osm-формат</li>
        </ul>
      </div>
      <div class="section">
        <p class="head">Исходный открытый код - разработки мирового сообщества</p>
        <ul>
          <li><a target="_blank" href="https://github.com/openstreetmap/mod_tile">https://github.com/openstreetmap/mod_tile</a> - mod_tile - генерация тайлов</li>
          <li><a target="_blank" href="https://github.com/ErshKUS/OpenStreetMap.ru">https://github.com/ErshKUS/OpenStreetMap.ru</a> - код сайта OpenStreetMap.ru</li>
          <li><a target="_blank" href="https://github.com/openstreetmap/openstreetmap-website.git">https://github.com/openstreetmap/openstreetmap-website.git</a> - OSM API сервер</li>
          <li><a target="_blank" href="https://github.com/ErshKUS/osmCatalog">https://github.com/ErshKUS/osmCatalog</a> - osmCatalog</li>
          <li><a target="_blank" href="https://github.com/ErshKUS/stapio">https://github.com/ErshKUS/stapio</a> - stapio</li>
          <li><a target="_blank" href="https://github.com/jimmyrocks/EsriRest-leaflet">https://github.com/jimmyrocks/EsriRest-leaflet</a> - EsriRest Layer Leaflet plugin</li>
        </ul>
      </div>
    </div>
    <div id="osm-dev" class="content">
        <p class="head">Полезные ссылки ДРСК</p>
        <ul>
          <li><a target="_blank" href="http://tools.map.prim.drsk.ru/">Дополнительные утилиты и гео-сервисы</a> - набор веб-утилит по обреботке и аналитике ГЕО-данных проекта</li>
          <li><a target="_blank" href="http://arm-geo.rs.int/">АРМ-ы по работе с ГЕО-данными с привелегированным доступом</a> - набор АРМ-ов, для доступа к засекреченной информации (массывые выгрузки данных и т.п.)</li>
          <li><a target="_blank" href="http://wiki.rs.int/doku.php/osm:osm_help">Инструкция по оформлению данных</a> - как правильно оформлять данные энергетики</li>
          <li><a target="_blank" href="http://wiki.rs.int/doku.php/osm:josm">Инструкция по использованию и установке редактора ГЕО-данных Josm</a> - удобное и функциональное средство по работе с гео-данными</li>
          <li><a target="_blank" href="http://wiki.rs.int/doku.php/osm:osm_export_data">Инструкция по экспорту данных в другие организации</a></li>
        </ul>

        <p class="head">Полезные ссылки сообщества OSM о проекте OSM:</p>
        <p><a target="_blank" href="http://wiki.openstreetmap.org/wiki/RU:Main_Page">Документация по проекту - в формате Wiki</a></p>
        <ul>
          <li><a target="_blank" href="http://wiki.openstreetmap.org/wiki/RU:Map_Making_Overview">Краткая вводная</a> - как мы рисуем карту</li>
          <li><a target="_blank" href="http://wiki.openstreetmap.org/wiki/RU:Map_Making_Overview">Краткая вводная</a> - как мы рисуем карту</li>
          <li><a target="_blank" href="http://wiki.openstreetmap.org/wiki/RU:%D0%9A%D0%B0%D0%BA_%D0%BE%D0%B1%D0%BE%D0%B7%D0%BD%D0%B0%D1%87%D0%B8%D1%82%D1%8C">Как обозначать объекты</a> - наиболее полный список</li>
          <li><a target="_blank" href="http://wiki.openstreetmap.org/wiki/RU:Map_Features">Каталог объектов</a>  - развёрнутое описание</li>
        </ul>
        <p><a target="_blank" href="http://josm.ru/">Русскоязычный сайт о JOSM</a> - хорошей программе для редактирования</p>
      </div>
      <div id="osm-utils" class="content">
        <p class="head">Полезные ссылки ДРСК</p>
        <ul>
          <li><a target="_blank" href="http://tools.map.prim.drsk.ru/">Дополнительные утилиты и гео-сервисы</a> - набор веб-утилит по обработке и аналитике ГЕО-данных проекта</li>
          <li><a target="_blank" href="http://arm-geo.rs.int/">АРМ-ы по работе с ГЕО-данными с привелегированным доступом</a> - набор АРМ-ов, для доступа к засекреченной информации (массывые выгрузки данных и т.п.)</li>
        </ul>
	  </div>
    </div>

    <div id="osm-dyk" class="content">
PHP_CONTENT;

if (function_exists("pg_connect")) {
  $result = pg_query("SELECT * FROM \"did_you_know\" ORDER BY \"id\"");
  while ($row = pg_fetch_assoc($result)) {
    $page_content = $page_content.'<div id="id'.$row['id'].'" class="section-link">';
    $page_content = $page_content.'<p class="head-link"><a name="id'.$row['id'].'">'.$row['head'].'</a></p>';
    $page_content = $page_content.'<div class="text" style="display: none;">'.$row['text'].'</div>';
    $page_content = $page_content.'</div>';
  }
}

$page_content = $page_content.<<<PHP_CONTENT
      <div id="dyk-tools">
        <div class="tools-head">Настроить оповещения</div>
          <p class="tools-null"></p>
          <p class="tools-button" id="dyk-know">
            Я все эти советы знаю
          </p>
          <p class="tools-text">
            Старые подсказки больше не будут всплывать в левой панели, но если у нас появится что-то новенькое, мы обязательно вам сообщим.
          </p>
          <p class="tools-space"></p>
          <p class="tools-button" id="dyk-forget">
            Забыть, что советы я смотрел
          </p>
          <p class="tools-text">
            Если нажать эту кнопку, то при входе на сайт вы снова сможете увидеть все советы и подсказки.
          </p>
      </div>
    </div>
  </div>
</div>
PHP_CONTENT;

// add date actual
if (function_exists("pg_connect")) {
  $result = pg_query("SELECT * FROM \"config\" WHERE \"key\"='dateaddr'");
  while ($row = pg_fetch_assoc($result)) {
    $page_content = str_replace('<i id="dateaddr">неизвестно</i>', '<samp>'.$row['value'].'</samp>', $page_content);
  }
  
  $result = pg_query("SELECT * FROM \"config\" WHERE \"key\"='datepoi'");
  while ($row = pg_fetch_assoc($result)) {
    $page_content = str_replace('<i id="datepoi">неизвестно</i>', '<samp>'.$row['value'].'</samp>', $page_content);
  }
}

?>
