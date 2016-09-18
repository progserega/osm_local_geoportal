function onEachFeature(feature, layer) {
    var popupContent="";
    if (feature.properties){
        popupContent+= "Спутник - "+feature.properties.Platform+"<br>";
        popupContent+= "Дата: "+feature.properties.DateTime+"<br>";
        popupContent+= "Яркость относительная: "+Math.round(feature.properties.Confidence)+"%<br>";
        popupContent+= "Сила пожара (мощность в МВт): "+Math.round(feature.properties.Power)+"<br>";
        if (feature.properties.Descr) {popupContent+= "Описание: "+feature.properties.Descr+"<br>"};
        if (feature.properties.Town) {popupContent+= "Населенный пункт: "+feature.properties.Town+"<br>"};
        popupContent+= "Координаты: "+feature.geometry.coordinates;
        layer.bindPopup(popupContent);
    }
}

var geojsonMarkerOptions = {
    radius: 8,
    fillColor: "red",
    color: "red",
    weight: 1,
    opacity: 1,
    fillOpacity: 0.4
};

function onEachFeature2(feature, layer) {
    var popupContent="";
    if (feature.properties){
        if (feature.properties.name) {popupContent+= "<b>Имя:</b> "+feature.properties.name+"<br>"};
        if (feature.properties.description) {popupContent+= "<b>Описание:</b> "+feature.properties.description+"<br>"};
        if (feature.properties.coordinates) {popupContent+= "<b>Координаты: </b>"+feature.properties.coordinates+"<br>"};
        layer.bindPopup(popupContent);
    }
}

osm.initLayers = function(){

  osm.layerHashes = {};
  osm.layerHash2name = {};
  osm.layerHash2title = {};
  osm.baseLayers = {};
  osm.overlays = {};
/*
  osm.registerLayer(
    'layerMS',
    new L.TileLayer('http://openmapsurfer.uni-hd.de/tiles/roads/x={x}&y={y}&z={z}', {
      maxZoom: 19,
      attribution: "Map data &copy; <a href='http://osm.org'>OpenStreetMap</a> contributors, rendering <a href=\"http://giscience.uni-hd.de/\" target=\"_blank\">GIScience Research Group @ Heidelberg University</a>"}),
    'MapSurfer.net',
    'S',
    true
  );
*/
		   //attribution: "Данные пожаров &copy; <a href=\"http://fires.kosmosnimki.ru/\" target=\"_blank\">RDC SCANEX, Fires.Kosmosnimki.Ru</a>",
// Приморье:
//http://maps.kosmosnimki.ru/rest/ver1/layers/F2840D287CD943C4B1122882C5B92565/search?query=%22DateTime%22%3E=%272015-04-12%27%20and%20%22DateTime%22%3C=%272015-04-13%27%20&BorderFromLayer=78E56184F48149DF8A39BA81CA25A01E&BorderID=1&api_key=L5VW1QBBHJ&out_cs=EPSG:3395
  osm.registerLayer(
    'kosmo_fire_last_day',
    new L.geoJson( fire_test,{
           pointToLayer: function (feature, latlng) {
           return L.circleMarker(latlng, geojsonMarkerOptions);
        },
        onEachFeature: onEachFeature,
    }),
    'Пожары за сутки',
    'F',
    false
 );

  osm.registerLayer(
    'protect_zones_points',
    new L.geoJson( protect_zones_points,{
		// каждая точка рисуется цветом, заданным в json:
		style: function(feature) {
			return {color: feature.properties.color};
		},
		pointToLayer: function(feature, latlng) {
			return new L.CircleMarker(latlng, {radius: 8, fillOpacity: 0.4});
		},
        onEachFeature: onEachFeature2,
    }),
    'Заявки о нарушениях охранных зон',
    'G',
    false
 );

  osm.registerLayer(
    'layerMS',
    //'layerMapnik',
    //new L.TileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {maxZoom: 19, attribution: "Map data &copy; <a href='http://osm.org'>OpenStreetMap</a> contributors"}),
    new L.TileLayer('http://tile.osm.prim.drsk.ru/osm/{z}/{x}/{y}.png', {maxZoom: 21, attribution: "Map data &copy; <a href='http://osm.org'>OpenStreetMap</a> contributors"}),
    'Карта OSM (локальная)',
    'M',
    true
  );

  osm.registerLayer(
    'layerVelo',
    //'layerMapnik',
    //new L.TileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {maxZoom: 19, attribution: "Map data &copy; <a href='http://osm.org'>OpenStreetMap</a> contributors"}),
    new L.TileLayer('http://{s}.tile.opencyclemap.org/cycle/{z}/{x}/{y}.png', {maxZoom: 18, attribution: "Map data &copy; <a href='http://osm.org'>OpenStreetMap</a> contributors (Cycle)"}),
    'Рельеф OSM (интернет)',
    'R',
    true
  );

  osm.registerLayer(
    'layerTopo',
    //'layerMapnik',
    //new L.TileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {maxZoom: 19, attribution: "Map data &copy; <a href='http://osm.org'>OpenStreetMap</a> contributors"}),
    new L.TileLayer('http://alt.opentopomap.org/{z}/{x}/{y}.png', {maxZoom: 14, attribution: 'Kartendaten: &copy; <a href="https://openstreetmap.org/copyright">OpenStreetMap</a>-Mitwirkende, <a href="http://viewfinderpanoramas.org">SRTM</a> | Kartendarstellung: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'}),
    'Топо OSM (интернет)',
    'W',
    true
  );

  osm.registerLayer(
    'layerBing',
    new L.BingLayer('ApaoUzCK5_6HzEgOsPL_HFxYj-RVA2FAvcvQHX4XKeR6tjzl9lquWXiZSwBFe8h-', {maxZoom: 18}),
    'Снимки Bing (интернет)',
    'B',
    true
  );

  osm.registerLayer(
    'layerEmpty',
    new L.TileLayer('img/blank.png', {maxZoom: 21}),
    'Пустой фоновый слой',
    'E',
    true
  );

// admin_levels
  osm.registerLayer(
    'admin_levels',
    new L.TileLayer.WMS('http://wms.osm.prim.drsk.ru/tilecache.cgi?', {
		layers: 'admin_levels', 
		transparent: 'true', 
		opacity: 0.6,
		format: 'png',
    	attribution: "Map data &copy; <a href='http://osm.org'>OpenStreetMap</a> contributors"}),
    'Районное деление',
    'c',
    false
  );

// Территории Опережающего Развития
  osm.registerLayer(
    'tor',
    new L.TileLayer.WMS('http://wms.osm.prim.drsk.ru/tilecache.cgi?', {
		layers: 'tor',
		transparent: 'true',
		opacity: 0.4,
		format: 'png',
        attribution: "Данные <a href='http://www.prim.drsk.ru'>АО ДРСК</a>"}),
    'ТОР',
    'T',
    false
  );

// groz_front
  osm.registerLayer(
    'groz_front',
    new L.TileLayer.WMS('http://wms.osm.prim.drsk.ru/tilecache.cgi?', {
		layers: 'groz_front', 
		transparent: 'true', 
		opacity: 0.7,
		format: 'png',
      	attribution: "Данные <a href='http://www.prim.drsk.ru'>АО ДРСК</a>"}),
    'Среднегодовая продолжительность гроз',
    'A',
    false
  );

// water_zones
  /*
  osm.registerLayer(
    'water_zones',
    new L.TileLayer.WMS('http://wms.osm.prim.drsk.ru/tilecache.cgi?', {
		layers: 'water_zones', 
		transparent: 'true', 
		opacity: 0.3,
		format: 'png',
      	attribution: "Данные <a href='http://www.prim.drsk.ru'>АО ДРСК</a>"}),
    'Зоны подтопления',
    'g',
    false
  );
*/
// drsk_pipe
  osm.registerLayer(
    'drsk_pipe',
    new L.TileLayer.WMS('http://wms.osm.prim.drsk.ru/tilecache.cgi?', {
		layers: 'drsk_pipe', 
		transparent: 'true', 
		opacity: 0.8,
		maxZoom: 21,
		format: 'png',
      	attribution: "Данные <a href='http://www.prim.drsk.ru'>АО ДРСК</a>"}),
    'Трубопроводы',
    'n',
    false
  );

// Кадастр
/*
   // старый кадастр:
  osm.registerLayer(
    'kadastre',
    //new L.TileLayer.WMS('http://maps.rosreestr.ru/arcgis/services/CadastreNew/CadastreWMS/MapServer/WMSServer?', {
    	new L.TileLayer.WMS('http://maps.rosreestr.ru/arcgis/rest/services/Cadastre/Cadastre/MapServer/export?', {
		layers: '1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20', 
		transparent: 'true', 
		//crs: 'EPSG:3857',
		version: '1.3.0',
		opacity: 0.7,
		//format: 'png',
		f: 'image',
      	attribution: "Данные <a href='http://rosreestr.ru'>Росреестр</a>"}),
    'Кадастр',
    's',
    false
  );
 */
   // новый кадастр:
 osm.registerLayer(
    'kadastre',
	new L.TileLayer.EsriRest("http://pkk5.rosreestr.ru/arcgis/rest/services/Cadastre/Cadastre/MapServer", {
		subdomains: "abcd",
		layers: '0,8,17,21',
		transparent: true,
		maxZoom: 20,
		opacity: 0.7,
      	attribution: "Данные <a href='http://pkk5.rosreestr.ru'>Росреестр</a>"
		}),
    'Кадастр',
    's',
    false
  );
//
//

// drsk_line_ohran_zones
  osm.registerLayer(
    'drsk_line_ohran_zones',
    new L.TileLayer.WMS('http://wms.osm.prim.drsk.ru/tilecache.cgi?', {
		layers: 'drsk_line_ohran_zones', 
		transparent: 'true', 
		opacity: 0.3,
		format: 'png',
      	attribution: "Данные <a href='http://www.prim.drsk.ru'>АО ДРСК</a>"}),
    'Охранные зоны линий (на малых масштабах)',
    'a',
    false
  );

// drsk_station_ohran_zones
  osm.registerLayer(
    'drsk_station_ohran_zones',
    new L.TileLayer.WMS('http://wms.osm.prim.drsk.ru/tilecache.cgi?', {
		layers: 'drsk_station_ohran_zones', 
		transparent: 'true', 
		opacity: 0.3,
		format: 'png',
      	attribution: "Данные <a href='http://www.prim.drsk.ru'>АО ДРСК</a>"}),
    'Охранные зоны подстанций',
    'd',
    false
  );

/// Линии //////

// drsk_line_0_4
  osm.registerLayer(
    'drsk_line_0_4',
    new L.TileLayer.WMS('http://wms.osm.prim.drsk.ru/tilecache.cgi?', {
		layers: 'drsk_line_0_4', 
		transparent: 'true', 
		format: 'png',
		maxZoom: 21,
      	attribution: "Данные <a href='http://www.prim.drsk.ru'>АО ДРСК</a>"}),
    'Линии 0,4 кВ',
    't',
    false
  );

// drsk_line_6
  osm.registerLayer(
    'drsk_line_6',
    new L.TileLayer.WMS('http://wms.osm.prim.drsk.ru/tilecache.cgi?', {
		layers: 'drsk_line_6', 
		transparent: 'true', 
		maxZoom: 21,
		format: 'png',
      	attribution: "Данные <a href='http://www.prim.drsk.ru'>АО ДРСК</a>"}),
    'Линии 6 кВ',
    'r',
    false
  );

// drsk_line_10
  osm.registerLayer(
    'drsk_line_10',
    new L.TileLayer.WMS('http://wms.osm.prim.drsk.ru/tilecache.cgi?', {
		layers: 'drsk_line_10', 
		transparent: 'true', 
		format: 'png',
		maxZoom: 21,
      	attribution: "Данные <a href='http://www.prim.drsk.ru'>АО ДРСК</a>"}),
    'Линии 10 кВ',
    'e',
    false
  );

// drsk_line_35
  osm.registerLayer(
    'drsk_line_35',
    new L.TileLayer.WMS('http://wms.osm.prim.drsk.ru/tilecache.cgi?', {
		layers: 'drsk_line_35', 
		transparent: 'true', 
		format: 'png',
		maxZoom: 21,
      	attribution: "Данные <a href='http://www.prim.drsk.ru'>АО ДРСК</a>"}),
    'Линии 35 кВ',
    'w',
    false
  );

// drsk_line_110
  osm.registerLayer(
    'drsk_line_110',
    new L.TileLayer.WMS('http://wms.osm.prim.drsk.ru/tilecache.cgi?', {
		layers: 'drsk_line_110', 
		transparent: 'true', 
		format: 'png',
		maxZoom: 21,
      	attribution: "Данные <a href='http://www.prim.drsk.ru'>АО ДРСК</a>"}),
    'Линии 110 кВ',
    'q',
    false
  );

// drsk_line_500_220
  osm.registerLayer(
    'drsk_line_500_220',
    new L.TileLayer.WMS('http://wms.osm.prim.drsk.ru/tilecache.cgi?', {
		layers: 'drsk_line_500_220', 
		transparent: 'true', 
		format: 'png',
		maxZoom: 21,
      	attribution: "Данные <a href='http://www.prim.drsk.ru'>АО ДРСК</a>"}),
    'Линии 220,500 кВ',
    'v',
    false
  );
 
// drsk_line_construction
  osm.registerLayer(
    'drsk_line_construction',
    new L.TileLayer.WMS('http://wms.osm.prim.drsk.ru/tilecache.cgi?', {
		layers: 'drsk_line_construction', 
		transparent: 'true', 
		format: 'png',
		maxZoom: 21,
      	attribution: "Данные <a href='http://www.prim.drsk.ru'>АО ДРСК</a>"}),
    'Строящиейся линии, планируемые к постройке',
    'y',
    false
  );
 
// drsk_objects_error
  osm.registerLayer(
    'drsk_objects_error',
    new L.TileLayer.WMS('http://wms.osm.prim.drsk.ru/tilecache.cgi?', {
		layers: 'drsk_objects_error', 
		transparent: 'true', 
		format: 'png',
		maxZoom: 21,
      	attribution: "Данные <a href='http://www.prim.drsk.ru'>АО ДРСК</a>"}),
    'Объекты с ошибками (без указанного напряжения и др.)',
    'u',
    false
  );

/* // drsk_tower
  osm.registerLayer(
    'drsk_tower',
    new L.TileLayer.WMS('http://wms.osm.prim.drsk.ru/tilecache.cgi?', {
		layers: 'drsk_tower', 
		transparent: 'true', 
		format: 'png',
      	attribution: "Данные <a href='http://www.prim.drsk.ru'>АО ДРСК</a>"}),
    'Опоры ЛЭП',
    'i',
    false
  );
*/
///////// Опоры //////
// drsk_tower_04
  osm.registerLayer(
    'drsk_tower_04',
    new L.TileLayer.WMS('http://wms.osm.prim.drsk.ru/tilecache.cgi?', {
		layers: 'drsk_tower_04', 
		transparent: 'true', 
		maxZoom: 21,
		format: 'png',
      	attribution: "Данные <a href='http://www.prim.drsk.ru'>АО ДРСК</a>"}),
    'Опоры ЛЭП 0,4 кВ',
    'x',
    false
  );
// drsk_tower_6
  osm.registerLayer(
    'drsk_tower_6',
    new L.TileLayer.WMS('http://wms.osm.prim.drsk.ru/tilecache.cgi?', {
		layers: 'drsk_tower_6', 
		transparent: 'true', 
		format: 'png',
		maxZoom: 21,
      	attribution: "Данные <a href='http://www.prim.drsk.ru'>АО ДРСК</a>"}),
    'Опоры ЛЭП 6 кВ',
    'z',
    false
  );
// drsk_tower_10
  osm.registerLayer(
    'drsk_tower_10',
    new L.TileLayer.WMS('http://wms.osm.prim.drsk.ru/tilecache.cgi?', {
		layers: 'drsk_tower_10', 
		transparent: 'true', 
		format: 'png',
		maxZoom: 21,
      	attribution: "Данные <a href='http://www.prim.drsk.ru'>АО ДРСК</a>"}),
    'Опоры ЛЭП 10 кВ',
    'l',
    false
  );

// drsk_tower_35
  osm.registerLayer(
    'drsk_tower_35',
    new L.TileLayer.WMS('http://wms.osm.prim.drsk.ru/tilecache.cgi?', {
		layers: 'drsk_tower_35', 
		transparent: 'true', 
		format: 'png',
		maxZoom: 21,
      	attribution: "Данные <a href='http://www.prim.drsk.ru'>АО ДРСК</a>"}),
    'Опоры ЛЭП 35 кВ',
    'k',
    false
  );
// drsk_tower_110
  osm.registerLayer(
    'drsk_tower_110',
    new L.TileLayer.WMS('http://wms.osm.prim.drsk.ru/tilecache.cgi?', {
		layers: 'drsk_tower_110', 
		transparent: 'true', 
		format: 'png',
		maxZoom: 21,
      	attribution: "Данные <a href='http://www.prim.drsk.ru'>АО ДРСК</a>"}),
    'Опоры ЛЭП 110 кВ',
    'j',
    false
  );
// drsk_tower_220_500
  osm.registerLayer(
    'drsk_tower_220_500',
    new L.TileLayer.WMS('http://wms.osm.prim.drsk.ru/tilecache.cgi?', {
		layers: 'drsk_tower_220_500', 
		transparent: 'true', 
		format: 'png',
		maxZoom: 21,
      	attribution: "Данные <a href='http://www.prim.drsk.ru'>АО ДРСК</a>"}),
    'Опоры ЛЭП 220,500 кВ',
    'g',
    false
  );

// drsk_station
  osm.registerLayer(
    'drsk_station',
    new L.TileLayer.WMS('http://wms.osm.prim.drsk.ru/tilecache.cgi?', {
		layers: 'drsk_station', 
		transparent: 'true', 
		format: 'png',
		maxZoom: 21,
      	attribution: "Данные <a href='http://www.prim.drsk.ru'>АО ДРСК</a>"}),
    'Подстанции',
    'o',
    false
  );

// drsk_tp
  osm.registerLayer(
    'drsk_tp',
    new L.TileLayer.WMS('http://wms.osm.prim.drsk.ru/tilecache.cgi?', {
		layers: 'drsk_tp', 
		transparent: 'true', 
		format: 'png',
		maxZoom: 21,
      	attribution: "Данные <a href='http://www.prim.drsk.ru'>АО ДРСК</a>"}),
    'ТП, КТП, ЗТП',
    'p',
    false
  );

// drsk_power_usage
  osm.registerLayer(
    'drsk_power_usage',
    new L.TileLayer.WMS('http://wms.osm.prim.drsk.ru/tilecache.cgi?', {
		layers: 'drsk_power_usage', 
		transparent: 'true', 
		opacity: 1,
		maxZoom: 21,
		format: 'png',
      	attribution: "Данные <a href='http://www.prim.drsk.ru'>АО ДРСК</a>"}),
    'Загрузка подстанций (процент и дата замера показаний)',
    'f',
    false
  );

// drsk_power_tp_usage
  osm.registerLayer(
    'drsk_power_tp_usage',
    new L.TileLayer.WMS('http://wms.osm.prim.drsk.ru/tilecache.cgi?', {
		layers: 'drsk_power_tp_usage', 
		transparent: 'true', 
		opacity: 1,
		maxZoom: 21,
		format: 'png',
      	attribution: "Данные <a href='http://www.prim.drsk.ru'>АО ДРСК</a>"}),
    'Загрузка ТП/КТП/ЗТП (процент и дата замера показаний)',
    'i',
    false
  );

// drsk_units
  osm.registerLayer(
    'drsk_units',
    new L.TileLayer.WMS('http://wms.osm.prim.drsk.ru/tilecache.cgi?', {
		layers: 'drsk_units', 
		transparent: 'true', 
		opacity: 1,
		maxZoom: 21,
		format: 'png',
      	attribution: "Данные <a href='http://www.prim.drsk.ru'>АО ДРСК</a>"}),
    'Управления, РЭС, мастерские участки',
    'b',
    false
  );

// drsk_fider_color
  osm.registerLayer(
    'drsk_fider_color',
    new L.TileLayer.WMS('http://wms.osm.prim.drsk.ru/tilecache.cgi?', {
		layers: 'drsk_fider_color', 
		transparent: 'true', 
		opacity: 1,
		maxZoom: 21,
		format: 'png',
      	attribution: "Данные <a href='http://www.prim.drsk.ru'>АО ДРСК</a>"}),
    'Фидеры, раскрашенные по разным цветам',
    'm',
    false
  );

////////////////// Связь //////////////

// drsk_network
  osm.registerLayer(
    'drsk_network',
    new L.TileLayer.WMS('http://wms.osm.prim.drsk.ru/tilecache.cgi?', {
		layers: 'drsk_network', 
		transparent: 'true', 
		opacity: 1,
		maxZoom: 21,
		format: 'png',
      	attribution: "Данные <a href='http://www.prim.drsk.ru'>АО ДРСК</a>"}),
    'Линии связи',
    'h',
    false
  );

/////////////////////// Внешние слои /////////////
  osm.registerLayer(
    'layerMSHyb',
    new L.TileLayer('http://129.206.74.245:8003/tms_h.ashx?x={x}&y={y}&z={z}', {
      maxZoom: 18,
      attribution: "Map data &copy; <a href='http://osm.org'>OpenStreetMap</a> contributors, rendering " +
                   "<a href=\"http://giscience.uni-hd.de/\" target=\"_blank\">GIScience Research Group @ University of Heidelberg</a>"}),
    'Названия улиц (прозрачные)',
    'Y',
    false
  );
/*
// OsmNotes
  osm.registerLayer(
    'osmnotes',
    new leafletOsmNotes({
		layers: 'osmnotes', 
      	attribution: "Данные <a href='http://www.prim.drsk.ru'>АО ДРСК</a>"}),
    'Ошибки на карте',
    'Q',
    false
  );
*/
  if (!frame_map) {
  osm.registerLayer(
    'search_marker',
    new L.LayerGroup()
  );

  WPCLayer = L.KML.extend({
    visible: false,
    onAdd: function(map) {
      L.KML.prototype.onAdd.apply(this, [map]);
      this._map.on('moveend',reloadKML,this);
      this.visible = true;
      reloadKML();
    },
    onRemove: function(map) {
      this._map.off('moveend',reloadKML,this);
      this.visible = false;
      L.KML.prototype.onRemove.apply(this, [map]);
    }
  });

  }

}

osm.registerLayer = function (name, layer, title, hash, isBase){
    if (isUnd(layer.options)) layer.options = {};
    layer.options['osmName'] = name;
    osm.layers[name] = layer;

    if(title){
        layer.options['osmTitle'] = title;
        osm.layerHashes[title] = hash;
    }

    if(hash){
        layer.options['osmHash'] = hash;
        osm.layerHash2name[hash] = name;
        if(title){
            osm.layerHash2title[hash] = title;
        }
    }

    if(undefined !== isBase){
        layer.options['osmIsBase'] = isBase;
        if(isBase){
          osm.baseLayers[title] = osm.layers[name];
        }
        else {
          osm.overlays[title] = osm.layers[name];
        }
    }
}

