MarkerIcon = L.Icon.Default.extend({
  createIcon: function() {
    var img = this._createIcon(this.options.markerColor);
    this._setIconStyles(img, 'icon');
    return img;
  },
  getMarkerIconUrl: function() {
    return this._getIconUrl(this.options.markerColor);
  }
});

osm.markers = {
  _drawingMode: 0,// 0 - nothing, 1 - marker (single, permalink), 2 - multimarker, 3 - line
  _layerGroup: 0,
  _newPath: 0,
  _data: {
    points: [],
    lines: []
  },
  _color_array: [
    {image:'icon',   color:'#0033FF', text:'white'},
    {image:'red',    color:'#F21D53', text:'white'},
    {image:'green',  color:'#22DD44', text:'black'},
    {image:'yellow', color:'#F1E415', text:'black'},
    {image:'violet', color:'#9B5BA0', text:'white'},
    {image:'orange', color:'#E48530', text:'black'}
  ],
  _icons: [],
  _line_color: [],
  _admin: {
    hash: '',
    id: -1,
    editable: false
  },
  _300_alert: false
}
osm.markers.initialize = function() {
  osm.markers._layerGroup = new L.LayerGroup();
  osm.map.addLayer(osm.markers._layerGroup);
  // color generation enhanced
  var icons = [];
  var lines = [];
  var buttons="";
  var replacable = "<div class='colour-picker-button' style='background:{{bg}};color:{{text}}' onClick='$$$.toggleCheck({{i}});'>&#x2713;</div>";
  for (var i=0;i<osm.markers._color_array.length;i++) {
    var c = osm.markers._color_array[i];
    icons.push(new MarkerIcon({markerColor:c.image}));
    lines.push(c.color);
    var str = replacable.replace(/{{bg}}/, c.color).replace(/{{text}}/,c.text).replace(/{{i}}/,i);
    if (i!=0) str = str.replace("&#x2713;","");
    buttons+=str;
  }
  osm.markers._icons = icons;
  osm.markers._line_color = lines;
  $(".colour-picker").each(function(){$(this).html(buttons)});
  $(document).on('keyup', osm.markers.keyhandler);
}
osm.markers.decodehtml = function(s) {
  if(s) return $("<div/>").html(s).text(); else return s;
}
osm.markers.personalMap = function() {
  osm.markers._admin.editable = true;
}

osm.markers._removeHandlers = function() {
	var oldDrawingMode = osm.markers._drawingMode;
	var func, elementId;

	switch (oldDrawingMode)
	{
		case 2:
			func = osm.markers.createPoints;
			elementId = '#pm-button-marker';
			break;
		case 3:
			func = osm.markers.createPath;
			elementId = '#pm-button-path';
			// remove mousemove event if any
			$("#map").unbind("mousemove", osm.markers.mouseMovePath);
			osm.markers._newPath.finishEditing(true);
			break;
		default: return 0;
	}
	osm.map.off('click', func);

	if (elementId)
		$(elementId).removeClass('pm-button-pressed');
	$_('map').style.cursor='';
	osm.markers._drawingMode = 0;

	return oldDrawingMode;
}

osm.markers.addMultiMarker = function() {
  if (osm.markers._removeHandlers() === 2)
    return;

  osm.map.on('click', osm.markers.createPoints);
  $('#pm-button-marker').addClass('pm-button-pressed');
  $_('map').style.cursor = 'crosshair';
  osm.markers._drawingMode = 2;
}
osm.markers.createPoints = function(e) {
  var count = 0;
  var mlen = osm.markers._data.points.length;
  for(var i=0; i < mlen; i++) {
    if (osm.markers._data.points[i])
      count++;
  }
  if (count >= 300 && !osm.markers._300_alert) {
    alert("Большое количество маркеров может тормозить работу браузера!");
    osm.markers._300_alert = true;
  }
  if (count >= osm.markers._max_markers) {
    alert("Маркеров не может быть больше " + osm.markers._max_markers);
    return;
  }

  var p = new PersonalMarkerEditable(e.latlng);
  p.openPopup();
}
osm.markers.keyhandler = function(e) {
  if (e.keyCode == 27) {
    osm.markers._removeHandlers();
  }
}

osm.markers.addPath = function() {
  if (osm.markers._removeHandlers() === 3)
    return;

  osm.map.on('click', osm.markers.createPath);
  $('#pm-button-path').addClass('pm-button-pressed');
  $_('map').style.cursor = 'crosshair';
  osm.markers._drawingMode = 3;
  osm.markers._newPath = new PersonalLineEditable([]);
}
osm.markers.createPath = function(e) { // todo: move it to PersonalLine?
  var count = 0;
  var mlen = osm.markers._data.lines.length;
  for(var i=0; i < mlen; i++) {
    if (osm.markers._data.lines[i])
      count+=osm.markers._data.lines[i].getLatLngs().length;
  }
  if (osm.markers._newPath)
  count+=osm.markers._newPath.getLatLngs().length-1;
  if (count >= osm.markers._max_line_points) {
    alert("Суммарно точек в линиях не может быть больше "+
      osm.markers._max_line_points);
    return;
  }
  osm.markers._newPath.addLatLng(e.latlng);
  if (osm.markers._newPath.getLatLngs().length === 1) {
    osm.markers._newPath.addLatLng(e.latlng);
//    osm.map.doubleClickZoom.disable();
    $('#map').mousemove(osm.markers.mouseMovePath);
  }
  if (osm.markers._newPath.getLatLngs().length > 2) {
    var points = osm.markers._newPath.getLatLngs();
    var p1 = osm.map.latLngToLayerPoint(points[points.length-3]);
    var p2 = osm.map.latLngToLayerPoint(points[points.length-2]);
    if (p1.distanceTo(p2)<3) {
      points.pop();
      osm.markers._removeHandlers();
    }
  }
  osm.markers._newPath.refreshPath();
}
osm.markers.mouseMovePath = function(event){
  var points = osm.markers._newPath.getLatLngs();
  var coord = osm.map.mouseEventToLatLng(event);
  points[points.length-1] = coord;
  osm.markers._newPath.redraw();
}

// TODO: when IE whould support placeholder attribute for input elements - remove that
osm.markers.focusDefaultInput = function(el) {
  if(el.value==el.defaultValue) {
    el.value='';
  }
  el.className = 'default-input-focused';
}
osm.markers.blurDefaultInput = function(el) {
  if(el.value=='') {
    el.value=el.defaultValue;
    el.className = 'default-input';
  }
}

osm.markers.saveMap = function() {
  osm.markers._removeHandlers();
  var postData = {};
  var mapName = "";
  var mapDescription = "";
  postData.points = [];
  postData.lines = [];
  var mlen = osm.markers._data.points.length;
  for(var i = 0; i < mlen; i++) {
    var point = osm.markers._data.points[i];
    if (!point) continue;
    var coords = point.getLatLng();
    postData.points.push({
      lat:          coords.lat,
      lon:          coords.lng,
      name:         point._pm_name,
      description:  point._pm_description,
      color:        point._pm_icon_color
    });
  }
  var llen = osm.markers._data.lines.length;
  for(var i = 0; i < llen; i++) {
    var line = osm.markers._data.lines[i];
    if (!line) continue;
    var lineData = {
      name:       line._pl_name,
      description:line._pl_description,
      color:      line._pl_color_index,
      points:     []
    };
    var lPoints = line.getLatLngs();
    var lplen = lPoints.length;
    for(var j = 0; j < lplen; j++)
      lineData.points.push([lPoints[j].lat, lPoints[j].lng]);

    postData.lines.push(lineData);
  }
  if (postData.points.length == 0 && postData.lines.length == 0) {
    $_("pm-status").innerHTML = "<p>Нет данных для сохранения!</p>"
  } else {
    $_("pm-status").innerHTML = "<p>Сохранение...</p>";
    $.ajax({
      url: "mymap.php",
      type: "POST",
      data: {
        action:       "save",
        name:         mapName,
        description:  mapDescription,
        data:         postData,
        hash:         osm.markers._admin.hash,
        id:           osm.markers._admin.id
      },
      dataType: 'json',
      success: function(json, text, jqXHR){
        if (json.id) {
          osm.markers._admin.id = json.id;
          osm.markers._admin.hash = json.hash;
        }
        $_("pm-status").innerHTML = "<p><a href='/?mapid="+osm.markers._admin.id+"'>Ссылка на просмотр</a></p>"+
          "<p><a href='/?mapid="+osm.markers._admin.id+"&hash="+osm.markers._admin.hash+"'>Ссылка на редактирование</a></p>"+
          "<p>IFrame-встраивание карты на сайт:<br>"+
          "<textarea cols=28 rows=4><iframe width=\"500px\" height=\"400px\" src=\"http://map.prim.drsk.ru/frame.php?mapid="+osm.markers._admin.id+"\"></iframe></textarea></p>"+
          "<p><a href='/mymap.php?id="+osm.markers._admin.id+"&format=gpx'>Скачать GPX</a></p>";
      }
    }).fail(function (jqXHR,textStatus) {
      $_("pm-status").innerHTML = "Ошибка при сохранении!";
    });
  }
}

osm.markers.readMap = function() {
  var url = document.URL;
  var results = url.match(/\Wmapid=(\d+)/);
  if (!results)
    return;
  var mapid = results[1];
  results = url.match(/\Whash=([0-9a-fA-F]{32})/);
  var adminhash = "";
  if (results)
    adminhash = results[1];
  $('#loader-overlay').show();
  $.ajax({
    url: "mymap.php",
    type: "POST",
    data: {
      action: "load",
      id:     mapid,
      hash:   adminhash
    },
    dataType: 'json',
    success: function(json, text, jqXHR){
      if (!json.service.existing) { alert("Карта не существует"); return; }
      osm.markers._admin.editable = json.service.editing;
      osm.markers._admin.hash = adminhash;
      osm.markers._admin.id = mapid;
      if (osm.markers._admin.editable)
        osm.leftpan.toggleItem('leftpersmap', true);
      else {
        // will fill after creating message...
        //$('#pm-control').html("Невозможно редактировать существующую персональную карту! Перейдите по ссылке <a href='/'>OpenStreetMap.ru</a>, чтоб начать новую персональную карту");
      }
      //process map name and description
      var latlngs = new Array();
      var text_items = new Array();
      var p;
      if (json.data.points)
        for(var i=0;i<json.data.points.length;i++) {
          var point = json.data.points[i];
          var coords = new L.LatLng(point.lat, point.lon);
          latlngs.push(coords);
          if (osm.markers._admin.editable)
            p = new PersonalMarkerEditable(coords, point);
          else
            p = new PersonalMarker(coords, point);
          text_items.push(p.panelText());
        }
      if (json.data.lines)
        for(var i=0;i<json.data.lines.length;i++) {
          var line = json.data.lines[i];
          var coords = [];
          for(var j=0;j<line.points.length; j++) {
            var point = new L.LatLng(line.points[j][0], line.points[j][1]);
            coords.push(point);
            latlngs.push(point);
          }
          if (osm.markers._admin.editable) {
            p = new PersonalLineEditable(coords, line);
            p.finishEditing(false);
          }
          else
            p = new PersonalLine(coords, line);
          text_items.push(p.panelText());
        }
      if (latlngs.length>1)
        osm.map.fitBounds(new L.LatLngBounds(latlngs));
      else if (latlngs.length==1) {
        osm.map.panTo(latlngs[0]);
        p.openPopup();
        if (p instanceof PersonalMarkerEditable)
          p.loadEditableMarker();
      }
      $('#loader-overlay').hide();
      if (!osm.markers._admin.editable && !frame_map) {
        text_items.sort(); // built-in sort for now
        var readonly_text = text_items.join("<br>");
        $('#pm-editing').hide();
        $('#pm-legend').html(readonly_text);
        osm.leftpan.toggleItem('leftpersmap', true);
      }
    }
  }).fail(function (jqXHR, textStatus) {
    alert("Произошла ошибка при чтении карты");
    $('#loader-overlay').hide();
  });
}

PersonalMarker = L.Marker.extend({ // simple marker without editable functions
  initialize: function(coords, details) {
    this.setLatLng(coords);
    this.addToLayerGroup();
    this.fillDetails(details);
    if (this._pm_name || this._pm_description) {
      var popupHTML = $_('pm_show_popup').innerHTML;
      popupHTML = popupHTML.replace(/\#name/g, this._pm_name);
      popupHTML = popupHTML.replace(/\#description/g, this._pm_description.replace(/\n/g, "<br>"));
      this.bindPopup(popupHTML);
    }
  },
  fillDetails: function(details) {
    if (!this.index) {
      osm.markers._data.points.push(this);
      this.index = osm.markers._data.points.length - 1;
    }

    if (!details) return;

    this._pm_name = details.name;
    this._pm_description = details.description;
    this._set_pm_icon_color(details.color);
  },
  addToLayerGroup: function() {
    if (!osm.markers._layerGroup) {
      osm.markers._layerGroup = new L.LayerGroup();
      osm.map.addLayer(osm.markers._layerGroup);
    }
    osm.markers._layerGroup.addLayer(this);
  },
  display: function() {
    osm.map.panTo(this.getLatLng());
    this.openPopup();
  },
  panelText: function() {
    var text = this._pm_name || "Маркер";
    return "<div onclick='osm.markers._data.points["+this.index+"].display()' style='display:table'><img style='float:left; margin-right:5px' src='" + this.options.icon.getMarkerIconUrl() + "' alt='.'/> <div style='display:table-cell;min-height:41px;vertical-align:middle'>" + text + "</div></div>";
  },
  _set_pm_icon_color: function(colorIndex) {
    if (isNaN(parseFloat(colorIndex)) || !isFinite(colorIndex) ||
      colorIndex < 0 || colorIndex >= osm.markers._icons.length )
      colorIndex = 0;
    this.setIcon(osm.markers._icons[colorIndex]);
    this._pm_icon_color = colorIndex;
  }
});

PersonalMarkerEditable = PersonalMarker.extend({
  initialize: function(coords, details) {
    this.setLatLng(coords);
    this.setIcon(osm.markers._icons[0]);
    this.fillDetails(details);
    // fix html entities for editable markers
    this._pm_name = osm.markers.decodehtml(this._pm_name);
    this._pm_description = osm.markers.decodehtml(this._pm_description);
    this.addToLayerGroup();
    var popupHTML = $_('pm_edit_popup').innerHTML;
    popupHTML = popupHTML.replace(/\$\$\$/g, 'osm.markers._data.points['+this.index+']');
    popupHTML = popupHTML.replace(/\#\#\#/g, this.index);
    this.bindPopup(popupHTML);
    this.on('popupopen', function(e){e.target.loadEditableMarker(e)});
  },
  saveData: function() {
    var nameEl = $_('marker_name_'+this.index);
    this._pm_name = (nameEl.value==nameEl.defaultValue? '': nameEl.value);

    var nameEl = $_('marker_description_'+this.index);
    this._pm_description = (nameEl.value==nameEl.defaultValue? '': nameEl.value);
  },
  toggleCheck: function(colorIndex) {
    var colorBoxes = $_('marker_popup_'+this.index).getElementsByClassName('colour-picker-button');
    for (var i=0; i < colorBoxes.length; i++) {
      colorBoxes[i].innerHTML = '';
    }
    colorBoxes[colorIndex].innerHTML = '&#x2713;';

    this._set_pm_icon_color(colorIndex);
  },
  loadEditableMarker: function(event) {
    if (this._pm_name) {
      $_('marker_name_'+this.index).value = this._pm_name;
      $_('marker_name_'+this.index).className = 'default-input-focused';
    }
    if (this._pm_description) {
      $_('marker_description_'+this.index).value = this._pm_description;
      $_('marker_description_'+this.index).className = 'default-input-focused';
    }
    if (this._pm_icon_color) {
      this.toggleCheck(this._pm_icon_color);
    }
  },
  remove: function() {
    osm.markers._layerGroup.removeLayer(this);
    delete osm.markers._data.points[this.index];
  }
});

PersonalLine = L.Polyline.extend({
  initialize: function(points, details) {
    L.Polyline.prototype.initialize.call(this, points, details);
    //this.setLatLngs(points);
    this.addToLayerGroup();
    this._addToDataArray();
    this.fillDetails(details);
    if (this._pl_name || this._pl_description) {
      var popupHTML = $_('pl_show_popup').innerHTML;
      popupHTML = popupHTML.replace(/\#name/g, this._pl_name);
      popupHTML = popupHTML.replace(/\#description/g, this._pl_description.replace(/\n/, "<br>"));
      popupHTML = popupHTML.replace(/\#moreinfo/g, this.formatLength(this.pathLength()));
      this.bindPopup(popupHTML);
    }
  },
  fillDetails: function(details) {
    if (!details) return;

    this._pl_name = details.name;
    this._pl_description = details.description;
    this._pl_color_index = details.color;
    this._pl_weight = details.weight;
    this._updateLineStyle();
  },
  display: function() {
    osm.map.fitBounds(this.getBounds());
    this.openPopup();
  },
  panelText: function() {
    var text = this._pl_name || "Линия";
    text += " <span class='marker-moreinfo'>(" + this.formatLength(this.pathLength()) + ")</span>";
    return "<div onclick='osm.markers._data.lines["+this.index+"].display()'><div style='background-image:url(/img/pm-lines.png);width:25px;height:6px;background-position:0px -" + (this._pl_color_index * 6) + "px;float:left;margin: 5px 5px 0 0;'/> " + text + "</div>";
  },
  _updateLineStyle: function() {
    var properties = {};
    if (this._pl_color_index !== undefined) properties.color = osm.markers._line_color[this._pl_color_index];
    this.setStyle(properties);
  },
  addToLayerGroup: function() {
    if (!osm.markers._layerGroup) {
      osm.markers._layerGroup = new L.LayerGroup();
      osm.map.addLayer(osm.markers._layerGroup);
    }
    osm.markers._layerGroup.addLayer(this);
  },
  _addToDataArray: function() {
    if (!this.index) {
      osm.markers._data.lines.push(this);
      this.index = osm.markers._data.lines.length - 1;
    }
  },
  pathLength: function() {
    var length = 0;
	var a=this.getLatLngs();
	for(var i=1;i<a.length;i++) {
	  length += a[i-1].distanceTo(a[i]);
	}
	return length;
  },
  formatLength: function(len) {
    if (len <= 0) return "";
	if (len < 10) return len.toFixed(1) + " м";
	if (len < 1000) return len.toFixed(0) + " м";
	if (len < 10000) return (len / 1000).toFixed(2) + " км";
	if (len < 100000) return (len / 1000).toFixed(1) + " км";
	return (len / 1000).toFixed(0) + " км";
  }
});
PersonalLineEditable = PersonalLine.extend({
  initialize: function(points, details) {
    PersonalLine.prototype.initialize.call(this, points, details);

    this._pl_name = osm.markers.decodehtml(this._pl_name);
    this._pl_description = osm.markers.decodehtml(this._pl_description);
  },
  refreshPath: function() {
    osm.markers._layerGroup.removeLayer(this);
    osm.markers._layerGroup.addLayer(this);
  },
  remove: function() {
    if (this._popup) this._popup._close();
    osm.markers._layerGroup.removeLayer(this);
    if (this.index !== undefined)
      delete osm.markers._data.lines[this.index];
  },
  finishEditing: function(truncate) {
    var points = this.getLatLngs();
    if (truncate) {
      points.pop();
      this.redraw();
    }
    if (points.length < 2) {
      this.remove();
      return;
    }
    this.editing.enable();
    var popupHTML = $_('pl_edit_popup').innerHTML;
    popupHTML = popupHTML.replace(/\$\$\$/g, 'osm.markers._data.lines['+this.index+']');
    popupHTML = popupHTML.replace(/\#\#\#/g, this.index);
    this.bindPopup(popupHTML);
    this.on('popupopen', function(e){e.target.loadEditableLine(e);e.target.on('edit', e.target.refreshLengthOnOpenedPopup);});
    this.on('popupclosed', function(e){e.target.off('edit', e.target.refreshLengthOnOpenedPopup);});
  },
  saveData: function(e) {
    var nameEl = $_('line_name_'+this.index);
    this._pl_name = (nameEl.value==nameEl.defaultValue? '': nameEl.value);

    var nameEl = $_('line_description_'+this.index);
    this._pl_description = (nameEl.value==nameEl.defaultValue? '': nameEl.value);
  },
  loadEditableLine: function(e) {
    if (this._pl_name) {
      $_('line_name_'+this.index).value = this._pl_name;
      $_('line_name_'+this.index).className = 'default-input-focused';
    }
    if (this._pl_description) {
      $_('line_description_'+this.index).value = this._pl_description;
      $_('line_description_'+this.index).className = 'default-input-focused';
    }
    if (this._pl_color_index) {
      this.toggleCheck(this._pl_color_index);
    }
    this.refreshLengthOnOpenedPopup();
  },
  refreshLengthOnOpenedPopup: function(e) {
    $('#line_popup_'+this.index+' .marker-moreinfo').text(this.formatLength(this.pathLength()));
  },
  toggleCheck: function(colorIndex) {
    var colorBoxes = $_('line_popup_'+this.index).getElementsByClassName('colour-picker-button');
    for (var i=0; i < colorBoxes.length; i++) {
      colorBoxes[i].innerHTML = '';
    }
    colorBoxes[colorIndex].innerHTML = '&#x2713;';

    this._pl_color_index = colorIndex;
    this._updateLineStyle();
  }
});
