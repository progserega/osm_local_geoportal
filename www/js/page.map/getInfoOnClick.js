//------------------------ go ------------------------
// Срабатывает по клику на карте.
// По географическим координатам опредеяет объект
// электросетевого хозяйства (ЭСХ) и выводит информацию о нем.
//----------------------------------------------------
var popup = L.popup();

function getInfoOnClick(e) {
    if (controlDistanceActive) {
      return; //возврат, если включен режим измерения расстояний
    }
    if (controlOsmNotes) {
      return; //возврат, если включен режим добавления ошибок
    }

//    alert ( window.location.hash);
    var endURL=window.location.hash;//Окончание url страницы, прим.  #map=14/50.2873/127.5137&layer=Mo
    var i=endURL.indexOf("#map=");
    if (i==-1) {
	return; //не нашли параметр zoom
    } 
    if (parseInt(endURL.slice(i+5)) < 12){
	return; //zoom < 12, поиск информации по объектам не выполняем
    }
/*
Проверяем, включено ли отображение каких-либо объектов ЭСХ -
a - Охранные зоны линий
t - Линии 0.4 кВ
r - Линии 6 кВ
e - Линии 10 кВ
w - Линии 35 кВ
q - Линии 110 кВ
v - Линии 220,500 кВ
y - Строящиейся линии, планируемые к постройке
u - Объекты с ошибками (без указанного напряжения и др.)

x - Опоры 0.4 кВ
z - Опоры 6 кВ
l - Опоры 10 кВ
k - Опоры 35 кВ
j - Опоры 110 кВ
g - Опоры 220,500 кВ

o - Подстанции
p - ТП, КТП, ЗТП, РП
*/
    //var regexp = /[dQqDJjoO]/;
    var regexp = /[trewqvyuxzlkjgop]/;
    i=endURL.indexOf("layer=");
    if (i==-1) {
	return; //не нашли параметр layer
    } 
    endURL=endURL.slice(i+6); //остаток url-строки
    if (endURL.search(regexp)==-1) {
	return; //На карте не включено ни одного слоя с объектами ЭСХ
    }

    //опредеяем границы поиска объектов
    var DELTA=0.001;
    var l_box=e.latlng.lng - DELTA;
    var r_box=e.latlng.lng + DELTA;
    var b_box=e.latlng.lat - DELTA;
    var t_box=e.latlng.lat + DELTA;

    //Retrieving map data by bounding box:
    //GET /api/0.6/map?bbox=left,bottom,right,top
    var xhr = new XMLHttpRequest();

    // GET-запрос на URL
    // http://osm.amur.drsk.ru/api/0.6/map?bbox=127.558,50.29,127.563,50.293
    var url_txt='http://osm.prim.drsk.ru/api/0.6/map?bbox='+l_box+','+b_box+','+r_box+','+t_box;
    xhr.open('GET', url_txt, true);
    // 3. Отсылаем запрос
    xhr.send();
    xhr.onreadystatechange = function() { // (3)
	if (xhr.readyState != 4) return;

        // 4. Если код ответа сервера не 200, то это ошибка
        if (xhr.status != 200) {
		// обработать ошибку
    	    alert( "Ошибка выполнения запроса:\n"+url_txt+"\n"+
		xhr.status + ': ' + xhr.statusText ); // пример вывода: 404: Not Found
	    return;
	}

	var nodeXML=xhr.responseXML.getElementsByTagName("node");
	if (nodeXML.length == 0) {
	    return; // никаких объектов ЭСХ в выборке нет
	}
	//**************************************************************************
	// Преобразуем результат запроса в ассоциативные массивы для удобства работы
	var node = {};
	var tag;
	for (var n=0; n < nodeXML.length; n++) {
	    var id = nodeXML[n].attributes.id.value;
	    node[id]={};
	    node[id].lat=nodeXML[n].attributes.lat.value;
	    node[id].lon=nodeXML[n].attributes.lon.value;
	    // остальные характеристики узла записаны в тегах
	    tag=nodeXML[n].getElementsByTagName("tag");
	    for (var t=0; t < tag.length; t++) {
		// узлу присваиваем пары ключ-значение из тегов
		node[id][tag[t].attributes.k.value] = tag[t].attributes.v.value;
	    }
	}

	var way = {};
	var nd;
        var wayXML=xhr.responseXML.getElementsByTagName("way");
	for (var n=0; n < wayXML.length; n++) {
	    var id = wayXML[n].attributes.id.value;
	    // собираем массив узлов
	    way[id]={"nd":[]};
	    nd=wayXML[n].getElementsByTagName("nd");
	    for (var t=0; t < nd.length; t++) {
		way[id].nd.push(nd[t].attributes.ref.value);
	    }
	    // остальные характеристики узла записаны в тегах
	    tag=wayXML[n].getElementsByTagName("tag");
	    for (var t=0; t < tag.length; t++) {
		// узлу присваиваем пары ключ-значение из тегов
		way[id][tag[t].attributes.k.value] = tag[t].attributes.v.value;
	    }
	}

	var relation = {};
	var rel_way;
        var relationXML=xhr.responseXML.getElementsByTagName("relation");
	for (var n=0; n < relationXML.length; n++) {
	    var id = relationXML[n].attributes.id.value;
	    // собираем массив членов отношения
	    relation[id]={"way":[]};
	    rel_way=relationXML[n].getElementsByTagName("member");
	    for (var t=0; t < rel_way.length; t++) {
		if (rel_way[t].attributes.type.value == "way") {
		    relation[id].way.push(rel_way[t].attributes.ref.value);
		}
	    }
	    // остальные характеристики отношения записаны в тегах
	    tag=relationXML[n].getElementsByTagName("tag");
	    for (var t=0; t < tag.length; t++) {
		// узлу присваиваем пары ключ-значение из тегов
		relation[id][tag[t].attributes.k.value] = tag[t].attributes.v.value;
	    }
	}

	//*************************************************
	// Определение кандидатов для вывода информации
	var candidate = {};
	// ищем O - ТП, КТП, ЗТП, РП среди узлов
	if (endURL.indexOf("p") != -1) {
	    for (var n in node) {
		if (node[n].power == "sub_station") {
		    node[n].name = node[n].ref; // для единообразия добавим имя
		    candidate["sub_station#"+n] = node[n];
		}
	    }
	}

	// ищем o - подстанции, заданные одной точкой
	if (endURL.indexOf("o") != -1) {
	    for (var n in node) {
		if (node[n].power == "station") {
		    candidate["station_node#"+n] = node[n];
		}
	    }
	}

	// ищем o - подстанции, заданные полигоном
	if (endURL.indexOf("o") != -1) {
	    for (var n in way) {
		if (way[n].power == "station") {
		    //упрощенно определим геометрическй центр подстанции как среднее арифметическое координат
		    way[n].lat=0;
		    way[n].lon=0;
		    for (var i=1; i < way[n].nd.length; i++) { //первая и последняя точка одна и таже, поэтому цикл с 1
			way[n].lat += +node[way[n].nd[i]].lat;
			way[n].lon += +node[way[n].nd[i]].lon;
		    }
		    way[n].lat /= (way[n].nd.length-1);
		    way[n].lon /= (way[n].nd.length-1);
		    candidate["station#"+n] = way[n];
		}
	    }
	}

	// ищем trewqvxzlkjg - линии и опоры, заданные way
        regexp = /[trewqvxzlkjg]/;
	if(endURL.search(regexp)!=-1) {
	    for (var n in way) {
        if (way[n].power == "line" || way[n].power == "cable" || way[n].power == "minor_line") {
            // Проверяем по классу напряжения 
            if( (endURL.indexOf("v")!=-1 || endURL.indexOf("g")!=-1) && 
              way[n].voltage in {"220":0, "220000":0, "500":0, "500000":0}) {
                candidate["line#"+n] = way[n];
            }
            if( (endURL.indexOf("q")!=-1 || endURL.indexOf("j")!=-1) && 
              way[n].voltage in {"110":0, "110000":0}) {
                candidate["line#"+n] = way[n];
            }
            if( (endURL.indexOf("w")!=-1 || endURL.indexOf("k")!=-1) && 
              way[n].voltage in {"35":0, "35000":0}) {
                candidate["line#"+n] = way[n];
            }
            if( (endURL.indexOf("e")!=-1 || endURL.indexOf("l")!=-1) && 
              way[n].voltage in {"10":0, "10000":0}) {
                candidate["line#"+n] = way[n];
            }
            if( (endURL.indexOf("r")!=-1 || endURL.indexOf("z")!=-1) && 
              way[n].voltage in {"6":0, "6000":0}) {
                candidate["line#"+n] = way[n];
            }
            if( (endURL.indexOf("t")!=-1 || endURL.indexOf("x")!=-1) && 
              way[n].voltage in {"0.4":0, "400":0}) {
                candidate["line#"+n] = way[n];
            }
        }
	    }
  }

	// ищем trewqvxzlkjg - линии и опоры, заданные отношением (relation)
        regexp = /[trewqvxzlkjg]/;
	if(endURL.search(regexp)!=-1) {
	    for (var n in relation) {
        if (relation[n].power == "line" || relation[n].power == "cable" || relation[n].power == "minor_line") {
            // Проверяем по классу напряжения 
            if( (endURL.indexOf("v")!=-1 || endURL.indexOf("g")!=-1) && 
              relation[n].voltage in {"220":0, "220000":0, "500":0, "500000":0}) {
                candidate["line_rel#"+n] = relation[n];
            }
            if( (endURL.indexOf("q")!=-1 || endURL.indexOf("j")!=-1) && 
              relation[n].voltage in {"110":0, "110000":0}) {
                candidate["line_rel#"+n] = relation[n];
            }
            if( (endURL.indexOf("w")!=-1 || endURL.indexOf("k")!=-1) && 
              relation[n].voltage in {"35":0, "35000":0}) {
                candidate["line_rel#"+n] = relation[n];
            }
            if( (endURL.indexOf("e")!=-1 || endURL.indexOf("l")!=-1) && 
              relation[n].voltage in {"10":0, "10000":0}) {
                candidate["line_rel#"+n] = relation[n];
            }
            if( (endURL.indexOf("r")!=-1 || endURL.indexOf("z")!=-1) && 
              relation[n].voltage in {"6":0, "6000":0}) {
                candidate["line_rel#"+n] = relation[n];
            }
            if( (endURL.indexOf("t")!=-1 || endURL.indexOf("x")!=-1) && 
              relation[n].voltage in {"0.4":0, "400":0}) {
                candidate["line_rel#"+n] = relation[n];
            }
        }
	    }
  }

	//******************************************************
	// Для линий (way) - определение ближайшей к точке клика опоры
	var nodeId;
	var nodeIdMin=-1;
	var deltaMin=1000;
	var delta;
	for (var n in candidate) {
	    if (n.indexOf("line#") != -1) {
		for (var i=0; i < candidate[n].nd.length; i++) {
		    nodeId=candidate[n].nd[i];
		    delta= Math.sqrt(Math.pow(+node[nodeId].lat - e.latlng.lat, 2)+ Math.pow(+node[nodeId].lon - e.latlng.lng, 2))
		    if (deltaMin > delta) {
			deltaMin=delta;
			nodeIdMin=nodeId;
		    }
		}
		candidate[n].lat=node[nodeIdMin].lat; //запомним координаты и id опоры
		candidate[n].lon=node[nodeIdMin].lon;
		candidate[n].nodeIdMin=nodeIdMin;
	    }
	}
	// и для линий, заданных через отношения
	nodeIdMin=-1;
	deltaMin=1000;
	for (var n in candidate) {
	    if (n.indexOf("line_rel#") != -1) {
		for (var i=0; i < candidate[n].way.length; i++) {
		    if ( way[candidate[n].way[i]] != undefined ) {
			//определим в полученном way ближайшую к клику мышки опору
			for (var k=0; k < way[candidate[n].way[i]].nd.length; k++) {
			    nodeId=way[candidate[n].way[i]].nd[k];
			    delta= Math.sqrt(Math.pow(+node[nodeId].lat - e.latlng.lat, 2)+ Math.pow(+node[nodeId].lon - e.latlng.lng, 2))
			    if (deltaMin > delta) {
				deltaMin=delta;
				nodeIdMin=nodeId;
			    }
			}
		    }
		}
		candidate[n].lat=node[nodeIdMin].lat; //запомним координаты и id опоры
		candidate[n].lon=node[nodeIdMin].lon;
		candidate[n].nodeIdMin=nodeIdMin;
	    }
	}

	//*****************************************************************
	// Из кандитатов определяем победителя по расстоянию между объектом
	// и координатами клика мышки
	var winId;
	var winIdMin=-1;
	deltaMin=1000;
	for (winId in candidate) {
	    delta= Math.sqrt(Math.pow(+candidate[winId].lat - e.latlng.lat, 2)+ Math.pow(+candidate[winId].lon - e.latlng.lng, 2))
		if (deltaMin > delta) {
		    deltaMin=delta;
		    winIdMin=winId;
		}
	}
	var win = {};
	win[winIdMin]=candidate[winIdMin];
	if ( winIdMin.indexOf("line_rel#") != -1) {
	    //двухцепная линия, заданная через отношения, поищем еще одну на этой же опоре
	    for (winId in candidate) {
		if ((winId != winIdMin) && (winId.indexOf("line_rel#") != -1) &&
		    (win[winIdMin].nodeIdMin == candidate[winId].nodeIdMin)) {
		    win[winId]=candidate[winId];
		}
	    }
	}
	//*****************************************************************
	// Победитель определен, выводим данне на экран
	var infoTxt="";
	for (winId in win) {
	    if (win[winId].power == "station") {infoTxt += "Подстанция<br>"};
	    if (win[winId].power == "line" || win[winId].power == "minor_line"||  win[winId].power == "cable" ) {
		infoTxt += "Линия<br>";
	    }
	    infoTxt += "<b>"+win[winId].name+"</b><br><br>";

	    infoTxt += "Обслуживающая компания - "+win[winId].operator+ "<br>";
	    if ((win[winId].power == "line") || (win[winId].power == "minor_line")) {
		    infoTxt += "Тип линии - воздушная<br>";
	    }
	    if (win[winId].power == "cable") {
		    infoTxt += "Тип линии - кабельная<br>";
	    }
	    if (win[winId].voltage != undefined ){
			infoTxt += "Напряжение - ";
			if (+win[winId].voltage > 1000 || +win[winId].voltage == 400 ) {
			win[winId].voltage = +win[winId].voltage / 1000 //Напрядение приведем к кВ
			}
			infoTxt += win[winId].voltage + " кВ<br>";
		}
		if ((win[winId].power == "line") || (win[winId].power == "minor_line")) {
			if (node[win[winId].nodeIdMin].ref != undefined){
			infoTxt += "№ опоры - "+node[win[winId].nodeIdMin].ref+"<br><br>";
			}
		}
	}

	popup.setLatLng(e.latlng);
	popup.setContent(infoTxt);
	popup.openOn(osm.map);

    }
}

