var nMap = function () {
	var settings = {
	};
	var nMapElement = $('#n-map');
	var icon = "";
	return {
		int : function (callback) {

			this.loadMap(callback);
			
		},
		loadMap:function(callback){
			nMapElement.googleMap({
		    	type : "TERRAIN",
		    	success:function(data){
					callback(data);
				}

		    });
		    
		},
		markerWithLabel:function(_aMarker){
			nMapElement.addMarkerWithLabel({
		      coords: [_aMarker.lat, _aMarker.lng], // GPS coords
		      id: _aMarker.id, // Unique ID for your marker
		      title:_aMarker.title,
		      text:_aMarker.text,
		      icon:_aMarker.icon,
		      label:_aMarker.label
		    });
		},
		loadMarkers:function(){
			var aMarkerLength = aMarker.length;
			var aStep = [];
			for (var i = 0; i < aMarkerLength; i++) {
				aMarker[i].text = i;
				this.loadMarker(aMarker[i]);
				if (i != 0 && i != aMarkerLength-1) {
					aStep.push([aMarker[i].lat, aMarker[i].lng])
				};
			};
			// this.addWay(aMarker[0],aMarker[aMarkerLength-1],aStep);
		},
		loadMarker:function(_aMarker){
			nMapElement.addMarker({
		      coords: [_aMarker.lat, _aMarker.lng], // GPS coords
		      id: _aMarker.id, // Unique ID for your marker
		      title:_aMarker.title,
		      text:_aMarker.text,
		      icon:_aMarker.icon,
		      label:_aMarker.label
		    });

		},
		focus:function(id){
			nMapElement.focusToMarker(id);
		},
		unfocus:function  (id) {
			nMapElement.unfocusToMarker(id);
		},
		addWayTwoPoint:function (start,end,color,callback) {
			nMapElement.addWayTwoPoint({
				color:color,
		    	start:start,
				end:  end,
				success:function(data){
					callback(data);
				}
			});
		},
		addWay:function(start,end,step,color,callback){
			nMapElement.addWay({
				color:color,
		    	start:start,
				end:  end,
				route : 'way',
				langage : 'english',
				step:step,
				success:function(data){
					//callback(data);
				}
			});
		},
		removeMarker:function(id){
			nMapElement.removeMarker(id);
			// Marker.removeMarker(id);
		},
		resertMap:function(){
			$('#list-visits table tr.info-marker').remove();
			nMapElement.googleMap();
		}
                ,
		clearMap:function(){
			nMapElement.googleMap();
		}
	}
}();