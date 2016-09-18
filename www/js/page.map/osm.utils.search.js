search = {last:{}};

$(function() {
  search.content=$('#leftpantab #leftsearch .mainsearch')[0];
  search.drskContent=$('#leftpantab #leftsearch .drsksearch')[0];
  search.CoordContent=$('#leftpantab #leftsearch .coordsearch')[0];
  search.kadastrContent=$('#leftpantab #leftsearch .kadastrsearch')[0];
  search.kadastrPkkContent=$('#leftpantab #leftsearch .kadastrpkksearch')[0];
  search.nominatimContent=$('#leftpantab #leftsearch .othersearch')[0];
  osm.sManager.on(['q','qmap'], search.startSearch);
});

search.enable = function(){
  console.debug(new Date().getTime() + ' search.enable');
  osm.map.addLayer(osm.layers.search_marker);
  if (!osm.p.anchor.q && search.last.q) {
    osm.sManager.setP([
      {type:'anchor', k:'q', v:search.last.q},
      {type:'anchor', k:'qmap', v:search.last.map}
    ]);
  }
};
search.disable = function(){
  console.debug(new Date().getTime() + ' search.disable');
  osm.map.removeLayer(osm.layers.search_marker);
  osm.sManager.setP([
    {type:'anchor', k:'q', del:1},
    {type:'anchor', k:'qmap', del:1}
  ]);
};


search.processResults = function(results) {
 //  try {
    $("#leftsearch .loader").removeClass('on');
    if (results.error) {
      search.content.innerHTML='Произошла ошибка #1: ' + (results.error);
    } else {
      var content = $('<ul id="ol-search_result">')
      var matches=results.matches;
      for (var i in matches) {
        var zoom = (matches[i].this_poi?16:matches[i].addr_type_id/5*2+4).toFixed(0);
        var marker = new L.Marker(new L.LatLng(matches[i].lat, matches[i].lon), {icon: new search.Icon()});
        if (matches[i].this_poi) {
          osm.poi.createPopup(matches[i].id, marker);
        }
        else {
          marker.bindPopup((
            $('<div>').addClass('addr_popup info_popup')
              .append(osm.poi.addrForPopup({
                full: matches[i].display_name,
                city: matches[i].city,
                village: matches[i].village,
                street: matches[i].street,
                house: matches[i].house
              }))
              .append(osm.poi.technicalForPopup(matches[i].osm_id))
          )[0]);
        }
        var a = $('<a href="">');
        a.attr('search_id',matches[i].id);
        a.text(matches[i].display_name);
        a.bind("click", {
            center: new L.LatLng(matches[i].lat, matches[i].lon),
            zoom: zoom,
            marker: marker
            }, function (e){
          osm.map.setView(e.data.center, e.data.zoom);
          e.data.marker.openPopup();
          return false;
        });
        content.append(
          $('<li>').append(a)
        );
        osm.layers.search_marker.addLayer(marker);
      }
      $(search.content).empty().append(content);
      $('#ol-search_result a', search.content).eq(0).click();
    }
   //} catch(e) {
   //  search.content.innerHTML = 'Ошибка: ' + e.description + '<br /> Ответ поиск.серв.: '+results.error;
   //}
};


search.processKadastrePkkResults = function(results) {
   try {
    $("#leftsearch .loader").removeClass('on');
    if (results.error) {
      search.content.innerHTML='Произошла ошибка #1: ' + (results.error);
    } else {
      var content = $('<ul id="ol-search_result">')
      var matches=results.matches;
      for (var i in matches) {
        var zoom = 16;
        var marker = new L.Marker(new L.LatLng(matches[i].lat, matches[i].lon), {icon: new search.Icon()});
          marker.bindPopup((
            $('<div>').addClass('addr_popup info_popup')
              .append(osm.poi.addrForPopup({
                //full: "Кадастровый номер:"+matches[i].cad_num+", Адрес: "+matches[i].address+", Стоимость земли: "+matches[i].cad_cost+" руб., Назначение участка:"+matches[i].description
                full: "Кадастровый номер:"+matches[i].cad_num+", Адрес: "+matches[i].address
              }))
          )[0]);
        var a = $('<a href="">');
        a.attr('search_id',matches[i].id);
        a.text("Найдено через новый (pkk5) сайт росреестра: "+matches[i].cad_num);
        a.bind("click", {
            center: new L.LatLng(matches[i].lat, matches[i].lon),
            zoom: zoom,
            marker: marker
            }, function (e){
          osm.map.setView(e.data.center, e.data.zoom);
          e.data.marker.openPopup();
          return false;
        });
        content.append(
          $('<li>').append(a)
        );
        osm.layers.search_marker.addLayer(marker);
      }
      $(search.kadastrPkkContent).empty().append(content);
      $('#ol-search_result a', search.kadastrPkkContent).eq(0).click();
    }
   } catch(e) {
     search.kadastrPkkContent.innerHTML = 'Ошибка: ' + e.description + '<br /> Ответ поиск.серв.: '+results.error;
   }
};

search.processKadastreResults = function(results) {
   try {
    $("#leftsearch .loader").removeClass('on');
    if (results.error) {
      search.content.innerHTML='Произошла ошибка #1: ' + (results.error);
    } else {
      var content = $('<ul id="ol-search_result">')
      var matches=results.matches;
      for (var i in matches) {
        var zoom = 16;
        var marker = new L.Marker(new L.LatLng(matches[i].lat, matches[i].lon), {icon: new search.Icon()});
          marker.bindPopup((
            $('<div>').addClass('addr_popup info_popup')
              .append(osm.poi.addrForPopup({
                full: "Кадастровый номер:"+matches[i].cad_num+", Адрес: "+matches[i].address+", Стоимость земли: "+matches[i].cad_cost+" руб., Назначение участка:"+matches[i].description
              }))
          )[0]);
        var a = $('<a href="">');
        a.attr('search_id',matches[i].id);
        a.text("Найдено через старый сайт росреестра: "+matches[i].cad_num);
        a.bind("click", {
            center: new L.LatLng(matches[i].lat, matches[i].lon),
            zoom: zoom,
            marker: marker
            }, function (e){
          osm.map.setView(e.data.center, e.data.zoom);
          e.data.marker.openPopup();
          return false;
        });
        content.append(
          $('<li>').append(a)
        );
        osm.layers.search_marker.addLayer(marker);
      }
      $(search.kadastrContent).empty().append(content);
      $('#ol-search_result a', search.kadastrContent).eq(0).click();
    }
   } catch(e) {
     search.kadastrContent.innerHTML = 'Ошибка: ' + e.description + '<br /> Ответ поиск.серв.: '+results.error;
   }
};

search.processCoordResults = function(results) {
   try {
    $("#leftsearch .loader").removeClass('on');
    if (results.error) {
      search.content.innerHTML='Произошла ошибка #1: ' + (results.error);
    } else {
      var content = $('<ul id="ol-search_result">')
      var matches=results.matches;
      for (var i in matches) {
        var zoom = (matches[i].this_poi?16:matches[i].addr_type_id/5*2+4).toFixed(0);
        var marker = new L.Marker(new L.LatLng(matches[i].lat, matches[i].lon), {icon: new search.Icon()});
          marker.bindPopup((
            $('<div>').addClass('addr_popup info_popup')
              .append(osm.poi.addrForPopup({
                full: "Координты: " + matches[i].display_name
              }))
          )[0]);
        var a = $('<a href="">');
        a.attr('search_id',matches[i].id);
        a.text(matches[i].display_name);
        a.bind("click", {
            center: new L.LatLng(matches[i].lat, matches[i].lon),
            zoom: zoom,
            marker: marker
            }, function (e){
          osm.map.setView(e.data.center, e.data.zoom);
          e.data.marker.openPopup();
          return false;
        });
        content.append(
          $('<li>').append(a)
        );
        osm.layers.search_marker.addLayer(marker);
      }
      $(search.CoordContent).empty().append(content);
      $('#ol-search_result a', search.CoordContent).eq(0).click();
    }
   } catch(e) {
     search.CoordContent.innerHTML = 'Ошибка: ' + e.description + '<br /> Ответ поиск.серв.: '+results.error;
   }
};

search.processTextResults = function(results) {
   try {
    $("#leftsearch .loader").removeClass('on');
    if (results.error) {
      search.content.innerHTML='Произошла ошибка #1: ' + (results.error);
    } else {
      var content = $('<ul id="ol-search_result">')
      var matches=results.matches;
      for (var i in matches) {
        //var zoom = (matches[i].this_poi?16:matches[i].addr_type_id/5*2+4).toFixed(0);
        var zoom = 18; 
        var marker = new L.Marker(new L.LatLng(matches[i].lat, matches[i].lon), {icon: new search.Icon()});
        if (matches[i].this_poi) {
          osm.poi.createPopup(matches[i].id, marker);
        }
        else {
          marker.bindPopup((
            $('<div>').addClass('addr_popup info_popup')
              .append(osm.poi.addrForPopup({
                full: matches[i].display_name
              }))
          )[0]);
        }
        var a = $('<a href="">');
        a.attr('search_id',matches[i].id);
        a.text(matches[i].display_name);
        a.bind("click", {
            center: new L.LatLng(matches[i].lat, matches[i].lon),
            zoom: zoom,
            marker: marker
            }, function (e){
          osm.map.setView(e.data.center, e.data.zoom);
          e.data.marker.openPopup();
          return false;
        });
        content.append(
          $('<li>').append(a)
        );
        osm.layers.search_marker.addLayer(marker);
      }
      $(search.drskContent).empty().append(content);
      $('#ol-search_result a', search.drskContent).eq(0).click();
    }
   } catch(e) {
     search.drskContent.innerHTML = 'Ошибка: ' + e.description + '<br /> Ответ поиск.серв.: '+results.error;
   }
};

search.processNominatimResults = function(results) {
  // try {
    $("#leftsearch .loader").removeClass('on');
    var from = $('<div style="font-size: 0.8em">Результаты от <a href="http://nominatim.openstreetmap.org/">Nominatim</a></div>');
    var content = $('<ul id="ol-search_result">')
    var matches=results;
    for (var i in matches) {
      var zoom = 12;
      var marker = new L.Marker(new L.LatLng(matches[i].lat, matches[i].lon), {icon: new search.Icon()});
      marker.bindPopup("<b>Адрес:</b><br /> " + matches[i].display_name);
      var a = $('<a href="">');
      // a.attr('search_id',matches[i].place_id);
      a.text(matches[i].display_name);
      a.bind("click", {
          center: new L.LatLng(matches[i].lat, matches[i].lon),
          zoom: zoom,
          marker: marker
          }, function (e){
        osm.map.setView(e.data.center, e.data.zoom);
        e.data.marker.openPopup();
        return false;
      });
      content.append(
        $('<li>').append(a)
      );
      osm.layers.search_marker.addLayer(marker);
    }
    $(search.nominatimContent).empty().append(from).append(content);
    // $('#ol-search_result a', search.nominatimContent).eq(0).click();
  // } catch(e) {
    // search.nominatimContent.innerHTML = 'Ошибка: ' + e.description + '<br /> Ответ поиск.серв.: '+results.error;
  // }
};

search.reportError = function() {
  comment=$_('rsearch').value;
  $.get("/api/search_report_add", {search: search.q, comment: comment.replace("\n", " ")} );
  search.content.innerHTML='Спасибо за помощь в улучшении OpenStreetMap';
  return false;
}

search.errorHandler = function(jqXHR, textStatus, errorThrown) {
  $("#leftsearch .loader").removeClass('on');
  search.content.innerHTML = 'Ошибка #2: ' + textStatus + '<br />' + errorThrown.message;
};

search.search = function(inQuery) {
  console.debug(new Date().getTime() + ' search.search');
  inQuery = inQuery || $('#qsearch').val();
  $('#qsearch').val(inQuery);
  if (inQuery.length < 1)
    return false;
    
  if (search.parserUrlIn(inQuery)) {
    $('#qsearch').val('');
    return false;
  }
    
  search.last = {
    q: inQuery,
    pos: osm.permalink.p.center,
    zoom: osm.permalink.p.zoom,
    map: osm.permalink.p.map
  };
  osm.sManager.setP([
    {type:'anchor', k:'q', v:search.last.q},
    {type:'anchor', k:'qmap', v:search.last.map}
  ]);
  
  // search.startSearch();
  return false;
};

search.startSearch = function() {
  console.debug(new Date().getTime() + ' search.startSearch');

  $("#leftsearch .loader").addClass('on');
  osm.leftpan.toggleItem('leftsearch', true);
  osm.layers.search_marker.clearLayers();

  var q = osm.sManager.decodeURI(osm.p.anchor.q || osm.p.get.q);
  $('#qsearch').val(q);
  if (osm.p.anchor.qmap)
    var center = osm.permalink.parseHash(osm.p.anchor.qmap).center;
  else if (osm.p.get.qmap)
    var center = osm.permalink.parseHash(osm.p.get.qmap).center;
  else
    var center = osm.map.getCenter();
  
  var st = '';
  if (q.search(/^пои[: ]/i) + 1)
    st = 'poi';
  else if (q.search(/^адрес[а]?[: ]/i) + 1)
    st = 'addr';

  $.getJSON('api/search_in_search_db', {
      q: q,
      stype: st,
      accuracy: 1,
	  cnt: 20,
      lat: center.lat,
      lon: center.lng
    }, search.processTextResults).error(search.errorHandler);

  $.getJSON('api/search_coordinates', {
      q: q,
      stype: st,
      accuracy: 1,
	  cnt: 20,
      lat: center.lat,
      lon: center.lng
    }, search.processCoordResults).error(search.errorHandler);

  $.getJSON('http://openstreetmap.ru/api/search', {
      q: q,
      stype: 'addr',
      accuracy: 1,
	  cnt: 12,
      lat: center.lat,
      lon: center.lng
    }, search.processResults).error(search.errorHandler);
/*
  $.getJSON('http://open.mapquestapi.com/nominatim/v1/search.php', {
      q: q,
      format: 'json',
      limit: 5,
      'accept-language': 'ru'
      }, search.processNominatimResults).error(search.errorHandler);
*/
	// search in kadastre:
	var args={
		cadnum:q,
		callback:search.processKadastreResults,
		cb:{latlon:'',bounds:'',content:''}
		}
	get_cadastre(args);

	var args2={
		cadnum:q,
		callback:search.processKadastrePkkResults,
		cb:{latlon:'',bounds:'',content:''}
		}
	get_cadastre_pkk(args2);

  return false;
};

search.parserUrlIn = function(inQuery) {
  inQuery = $.trim(inQuery);
  var res;
  if (res = inQuery.match(/map=(\d+)[/]([\d.]+)[/]([\d.]+)/i)) { //openstreetmap.org
    osm.map.setView(new L.LatLng(res[2], res[3]), res[1]);
    return true;
  }
  else if (res = inQuery.match(/yandex.+ll=([\d.]+)(%2C|,)+([\d.]+).+z=(\d+)/i)) { //yandex
    osm.map.setView(new L.LatLng(res[3], res[1]), res[4]);
    return true;
  }
  else if (res = inQuery.match(/google.+ll=([\d.]+)(%2C|,)+([\d.]+).+z=(\d+)/i)) { //google
    osm.map.setView(new L.LatLng(res[1], res[3]), res[4]);
    return true;
  }
}

search.inLoad = function() {
  var query = osm.p.get.q || '';
  if (query != '')
    search.search(query);
};

search.Icon =  L.Icon.extend({
  options: {
    iconUrl: 'img/marker-addr.png',
    iconSize: new L.Point(32, 37),
    shadowSize: new L.Point(0, 0),
    iconAnchor: new L.Point(16, 35),
    popupAnchor: new L.Point(0, -11)
  }
});

