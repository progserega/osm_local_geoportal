    function get_cadastre (args) {

        var that=this
		, cadnum = args.cadnum
		, callback_fun = args.callback
        , cadparts = cadnum.split(':')
        , cadjoin = cadparts.join('')
        , unproject = function (x, y) {
            var earthRadius = 6378137;
            return L.CRS.EPSG900913.projection.unproject((new L.Point(x, y)).divideBy(earthRadius));
        }
        //, i18n = this.options.i18n
        , ajaxtype
        , zoom;

        if (cadparts.length==4) {
            ajaxtype='find';
            ajaxopt = {
                url : 'http://maps.rosreestr.ru/arcgis/rest/services/Cadastre/CadastreSelected/MapServer/exts/GKNServiceExtension/online/parcel/find'
                , dataType : 'jsonp'
		//		, async: false
                , data : {
                    'f' : 'json'
                    , 'cadNum' : cadnum
                    , 'onlyAttributes' : 'false'
                    , 'returnGeometry' : 'true'
                }
            }
        } else {
            var ajaxtype='query';

            if (cadjoin.length < 3) {
                zoom = 1;
            } else if (cadjoin.length < 5) {
                zoom = 7;
            } else {
                zoom = 12;
            }

            ajaxopt = {
                url : 'http://maps.rosreestr.ru/arcgis/rest/services/Cadastre/CadastreSelected/MapServer/'+zoom+'/query'
                , dataType : 'jsonp'
				, async: false
                , data : {
                    'f' : 'json'
                    , 'where' : 'PKK_ID like \''+cadjoin+'%\''
                    , 'returnGeometry' : 'true'
                    , 'spatialRel' : 'esriSpatialRelIntersects'
                    , 'outFields' : '*'
                }
            }
        }


        $.ajax(ajaxopt)
        .done(function(data){
            if (data.features.length>0) {
				var result={};
                var res=data.features[0].attributes;
				var item={};
				var matches=[];

                if (ajaxtype=='find') {
					item.kadastre_req_type="find";
                    item.cad_num=res['CAD_NUM'];
                    item.address=res['OBJECT_ADDRESS'];
					item.area_value=res['AREA_VALUE'];
					item.cad_cost=res['CAD_COST'];
					item.description=res['UTIL_BY_DOC'];
                } else {
					item.kadastre_req_type="query";
                    item.cad_num=res['CAD_NUM'];
                    item.name=res['NAME'];
                }

                var latlon = unproject(res['XC'],res['YC']);
				item.lat=latlon.lat;
				item.lon=latlon.lng;
                item.bounds = new L.LatLngBounds(unproject(res['XMIN'],res['YMIN']), unproject(res['XMAX'],res['YMAX']));
				matches[0]=item;
				result.matches=matches;
				callback_fun(result);
            }
        });
    }
	/*
	args={cadnum:"61:6:10104:12",cb:{latlon:'',bounds:'',content:''}}
	data = get_cadastre(args);
	//alert( "адрес: " + data);
	alert( "координаты: " + args.cb.latlng);
	alert( "адрес: " + args.cb.content);
 */
	/*
	var data = 2;
	data   = $.ajax({
			url: "http://maps.rosreestr.ru/arcgis/rest/services/Cadastre/CadastreSelected/MapServer/exts/GKNServiceExtension/online/parcel/find", 
			type: "POST", 
			data: { 
                    'f' : 'json'
                    , 'cadNum' : '61:6:10104:12'
                    , 'onlyAttributes' : 'false'
                    , 'returnGeometry' : 'true'
				}, 
			async: false, 
			dataType: 'jsonp' 
		}).done(function(data){
			var data2=data.features[0].attributes.OBJECT_ADDRESS;
			alert( "адрес: " + data2);
			//alert( "адрес: " + data.features.0.attributes.OBJECT_ADDRESS);
		
		
		}
		);
    */
