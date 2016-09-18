osm.validators = {

  sources: [{
    "name": "Адресный и роутинговый валидатор Zkir",
    "url": "http://osm.alno.name/validators/zkir?minlat={minlat}&minlon={minlon}&maxlat={maxlat}&maxlon={maxlon}&types={filtered_types}",
    "types": {
      "city_without_population": {"text": "Город без населения"},
      "city_without_place_polygon": {"text": "Город без полигональной границы"},
      "city_without_place_node": {"text": "Город без точечного центра"},
      "routing_subgraph": {"text": "Изолированный подграф"},
      "routing_subgraph_trunk": {"text": "Изолированный подграф на уровне trunk"},
      "routing_subgraph_primary": {"text": "Изолированный подграф на уровне primary"},
      "routing_subgraph_secondary": {"text": "Изолированный подграф на уровне secondary"},
      "routing_subgraph_tertiary": {"text": "Изолированный подграф на уровне tertiary"},
      "duplicate_point": {"text": "Точка-дубликат"},
      "building_not_in_place": {"text": "Здание за пределами населенного пункта"},
      "address_without_street": {"text": "Адрес без улицы"},
      "address_street_not_found": {"text": "Адресная улица не найдена"},
      "address_street_not_in_place": {"text": "Улица из адреса не связана с городом"},
      "address_by_territory": {"text": "Здание нумеруется по территории"},
      "address_street_not_routed": {"text": "Не-рутинговая улица"},
      "street_not_in_place": {"text": "Улица за пределами города"}
    },
    "jsonp": true,
    "offset_limit": true
  },{
    "name": "Проверка параметров городов по Википедии",
    "url": "http://osm.alno.name/validators/cupivan_places?minlat={minlat}&minlon={minlon}&maxlat={maxlat}&maxlon={maxlon}&types={filtered_types}",
    "types": {
      "place":      { "text": "Тип населенного пункта" },
      "wikipedia":  { "text": "Ссылка на википедию" },
      "population": { "text": "Население" },
      "province":   { "text": "Область/край/республика" },
      "district":   { "text": "Район" },
      "official_status": { "text": "Статус населенного пункта" },
      "name":       { "text": "Название населенного пункта" },
      "old_name":   { "text": "Прежнее название населенного пункта" },
      "website":    { "text": "Вебсайт" }
    },
    "jsonp": true,
    "offset_limit": true
  }],

  errors: [{
    name: "Роутинг",
    children: [{
      name: "Изолированный подграф",
      type: "routing_subgraph"
    },{
      name: "Изолированный подграф trunk",
      type: "routing_subgraph_trunk"
    },{
      name: "Изолированный подграф primary",
      type: "routing_subgraph_primary"
    },{
      name: "Изолированный подграф secondary",
      type: "routing_subgraph_secondary"
    },{
      name: "Изолированный подграф tertiary",
      type: "routing_subgraph_tertiary"
    }]
  },{
    name: "Адресация",
    children: [{
      name: "Города",
      children: [{
        name: "Без населения",
        type: "city_without_population"
      },{
        name: "Без границы",
        type: "city_without_place_polygon"
      },{
        name: "Без центра",
        type: "city_without_place_node"
      }]
    },{
      name: "Улицы",
      children: [{
        name: "За пределами города",
        type: "street_not_in_place"
      }]
    },{
      name: "Здания",
      children: [{
        name: "За пределами города",
        type: "building_not_in_place"
      },{
        name: "Без улицы",
        type: "address_without_street"
      },{
        name: "Улица не найдена",
        type: "address_street_not_found"
      },{
        name: "Улица не связана с городом",
        type: "address_street_not_in_place"
      },{
        name: "Здание нумеруется по территории",
        type: "address_by_territory"
      },{
        name: "Улица не является рутинговой",
        type: "address_street_not_routed"
      }]
    },{
      name: "Другие",
      children: [{
        name: "Точка-дубликат",
        type: "duplicate_point"
      }]
    }]
  },{
    name: "Населенные пункты",
    children: [{
      name: "Тип",
      type: "place"
    },{
      name: "Статус",
      type: "official_status"
    },{
      name: "Название",
      type: "name"
    },{
      name: "Старое название",
      type: "old_name"
    },{
      name: "Регион",
      type: "region"
    },{
      name: "Район",
      type: "district"
    },{
      name: "Население",
      type: "population"
    },{
      name: "Вебсайт",
      type: "website"
    },{
      name: "Ссылка на википедию",
      type: "wikipedia"
    }]
  }],

  i18n: {
    errors: 'Ошибки',
    objects: 'Объекты',
    params: 'Параметры',
    error_info: 'Информация об ошибке',
    edit_in_potlatch: 'Редактировать в Potlatch',
    edit_in_josm: 'Редактировать в JOSM',
    created_at: 'Обнаружена',
    updated_at: 'Обновлена'
  },

  dateFormat: 'YYYY-MM-DD',

  initialize: function() {
    this.layer = new OsmJs.Validators.LeafletLayer({sources: this.sources, i18n: this.i18n, dateFormat: this.dateFormat});

    $('#validationerrors').validatorErrorsControl(this.layer, {errors: this.errors});
  },

  enable: function() {
    osm.map.addLayer(this.layer);
  },

  disable: function() {
    osm.map.removeLayer(this.layer);
  }

}
