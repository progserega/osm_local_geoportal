var osm_api_server="http://osm.prim.drsk.ru"
var controlOsmNotes = false;

function saveNewNote(){
    var nameEl = $_('new_note_user_name');
    new_osm_note.fio = (nameEl.value==nameEl.defaultValue? 'Аноним': nameEl.value);

    var nameEl = $_('new_note_description');
    new_osm_note.description = (nameEl.value==nameEl.defaultValue? '': nameEl.value);
    // добавляем OSM note:
    url=osm_api_server+"/api/0.6/notes?lat="+new_osm_note.lat+"&lon="+new_osm_note.lng+"&text="+new_osm_note.fio+" сообщает: "+new_osm_note.description
    $.ajax({
      type: "POST",
      url: url,
      success: callback_create_new_note
    }).fail(
      function(){
        alert('Ошибка создания заметки! Обратитесь к системным администраторам.');
      }
    );
    new_osm_note.map.removeLayer(new_osm_note.marker);
    delete new_osm_note.marker;
}

function callback_create_new_note(data){
  //new_osm_note.osmNotesLayer._load();
  alert('Сообщение о неточности на карте успешно отправлено!');
}


new_osm_note={
  fio:"",
  description:"",
  lat:0.0,
  lng:0.0,
  map:0,
  marker:0,
  osmNotesLayer:0
}

L.Control.OsmNotes = L.Control.extend({
  options: {
    position: 'topleft',
    linktitle: 'Сообщить об ошибке на карте'
  },


  initialize: function (options) {
    L.Util.setOptions(this, options);
    new_osm_note.osmNotesLayer=0;
  },

  onAdd: function(map) {
    var className = 'leaflet-bar leaflet-control-OsmNotes',
    container = this._container = L.DomUtil.create('div', className);

    this._link = L.DomUtil.create('a', 'leaflet-control-OsmNotes', container);
    this._link.title = this.options.linktitle;
    this._link.href = '#';
    
    L.DomEvent
      .addListener(this._link, 'click', L.DomEvent.stopPropagation)
      .addListener(this._link, 'click', L.DomEvent.preventDefault)
      .addListener(this._link, 'click', this._click_link, this);

    
    this.errorDialog = $('<div><p>JOSM не запущен!</p><p>Пожалуйста запустите JOSM и повторите попытку.</p></div>')
      .dialog({
        autoOpen: false,
        modal: true,
        resizable: false,
        draggable: false,
        title: 'JOSM не запущен!',
        dialogClass: 'alert',
        buttons: [{
          text: 'Ok',
          position: 'center',
          click: function() {$(this).dialog('close');}
        }]
      });
    
    return container;
  },

  onRemove: function(map) {

  },
  
  _click_link: function() {

    if (controlOsmNotes)
    {
      //this._map.removeLayer(new_osm_note.osmNotesLayer);
      if(new_osm_note.marker)
      {
        this._map.removeLayer(new_osm_note.marker);
        delete new_osm_note.marker;
      }
    //  delete new_osm_note.osmNotesLayer;
      new_osm_note.osmNotesLayer=0;
      this._map.off('click', this._add_new_note);
      this._map.on('click', getInfoOnClick);
      controlOsmNotes=false;
      this._map.getContainer().style.cursor = 'default';
      L.DomUtil.removeClass(this._link, 'leaflet-control-distance-active');
    }
    else
    {
      /*
      if (!new_osm_note.osmNotesLayer)
      {
        new_osm_note.osmNotesLayer = new leafletOsmNotes();
      }
      this._map.addLayer(new_osm_note.osmNotesLayer);
      */
      this._map.on('click', this._add_new_note);
      controlOsmNotes=true;
      this._map.getContainer().style.cursor = 'crosshair';
      L.DomUtil.addClass(this._link, 'leaflet-control-distance-active');
    }
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
  );*/
    var pos = this._map.getBounds();
    //var url = 'http://127.0.0.1:8111/load_and_zoom?left=' + pos._southWest.lng + '&top=' + pos._northEast.lat + '&right=' + pos._northEast.lng + '&bottom=' + pos._southWest.lat;
    var url = 'http://tools.map.prim.drsk.ru/osm_deleted_chengesets/index.cgi?left_down_lon=' + pos._southWest.lng + '&right_up_lat=' + pos._northEast.lat + '&right_up_lon=' + pos._northEast.lng + '&left_down_lat=' + pos._southWest.lat;
    //this._send_JOSM(url);
	//window.open(url);
  },
  _add_new_note: function(e){
    //var marker = new L.Marker(new L.LatLng(matches[i].lat, matches[i].lon), {icon: new search.Icon()});
    if (new_osm_note.marker)
    {
      this.removeLayer(new_osm_note.marker);
      delete new_osm_note.marker;
    }
      new_osm_note.lat=e.latlng.lat;
      new_osm_note.lng=e.latlng.lng;
      new_osm_note.map=this;

      new_osm_note.marker = new L.Marker(new L.LatLng(e.latlng.lat,e.latlng.lng), {icon: new search.Icon()});
      //this.newOsmBug.bindPopup("dddd").openPopup();
      var popupHTML = $_('note_edit_popup').innerHTML;
      new_osm_note.marker.bindPopup(popupHTML);
      this.addLayer(new_osm_note.marker);
      new_osm_note.marker.openPopup();
/*
    var marker2 = L.marker(e.latlng).addTo(this._map);
    marker2.bindPopup("<b>Hello world!</b><br>I am a popup.").openPopup();

    var popup = L.popup()
    .setLatLng(e.latlng)
    .setContent("I am a standalone popup.")
    .openOn(this._map);
    */
  },
  
  _load_object: function(id) {
    var url = 'http://127.0.0.1:8111/load_object?objects=' + id;
    
    this._send_JOSM(url);
  },
  
  _send_JOSM: function(url) {
    var processResults = function(data, textStatus) {
      if (!(textStatus == 'success' && data == 'OK\r\n'))
        this.errorDialog.dialog('open');
    }
    
    if (this.click_ajax && this.click_ajax.state() == 'pending')
      this.click_ajax.abort();
    
    this.click_ajax = $.get(url, {}, $.proxy(processResults, this))
      .error($.proxy(processResults, this));
  }
});
