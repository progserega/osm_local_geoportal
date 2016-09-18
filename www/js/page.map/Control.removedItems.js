L.Control.removedItems = L.Control.extend({
  options: {
    position: 'topleft',
    linktitle: 'Показать удалённые объекты'
  },

  initialize: function (options) {
    L.Util.setOptions(this, options);
  },

  onAdd: function(map) {
    var className = 'leaflet-bar leaflet-control-removedItems',
    container = this._container = L.DomUtil.create('div', className);

    this._link = L.DomUtil.create('a', 'leaflet-control-removedItems-link', container);
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
    var pos = this._map.getBounds();
    //var url = 'http://127.0.0.1:8111/load_and_zoom?left=' + pos._southWest.lng + '&top=' + pos._northEast.lat + '&right=' + pos._northEast.lng + '&bottom=' + pos._southWest.lat;
    var url = 'http://tools.map.prim.drsk.ru/osm_deleted_chengesets/index.cgi?left_down_lon=' + pos._southWest.lng + '&right_up_lat=' + pos._northEast.lat + '&right_up_lon=' + pos._northEast.lng + '&left_down_lat=' + pos._southWest.lat;
    //this._send_JOSM(url);
	window.open(url);
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
