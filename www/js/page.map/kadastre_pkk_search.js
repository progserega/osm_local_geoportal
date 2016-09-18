    function get_cadastre_pkk (args) {

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
                url : 'http://pkk5.rosreestr.ru/api/features/1?text='+ cadnum + '&tolerance=4&limit=1'
                , dataType : 'jsonp'
		//		, async: false
                }
            }

        $.ajax(ajaxopt)
        .done(function(data){
            if (data.features.length>0) {
				var result={};
                var res=data.features[0].attrs;
				var item={};
				var matches=[];

                if (ajaxtype=='find') {
					item.kadastre_req_type="find";
                    item.cad_num=res['cn'];
                    item.address=res['address'];
					item.area_value='';
					item.cad_cost='';
					item.description='';
                } else {
					item.kadastre_req_type="query";
                    item.cad_num=res['CAD_NUM'];
                    item.name=res['NAME'];
                }

                var latlon = unproject(data.features[0].center['x'],data.features[0].center['y']);
				item.lat=latlon.lat;
				item.lon=latlon.lng;
                item.bounds = new L.LatLngBounds(unproject(data.features[0].extent['xmin'],data.features[0].extent['ymin']), unproject(data.features[0].extent['xmax'],data.features[0].extent['ymax']));
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
