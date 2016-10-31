var routing = function() {
    var settings = {};
    var dataAllOrder = {};
    var makeid = function(key, length) {
        if (length == undefined) {
            var length = 7;
        };
        var text = "";
        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

        for (var i = 0; i < length; i++)
            text += possible.charAt(Math.floor(Math.random() * possible.length));

        return key + text;
    };
    function round(value, decimals) {
        return Number(Math.round(value + 'e' + decimals) + 'e-' + decimals);
    }
    var _getValOfCheckBox = function(elm){
      var _array = [];
      elm.each(function (argument) {
        _array.push($(this).val());
      })
      return _array;
    };
    return {
        int: function(options) {
        	
        	var query = location.search.substring(1).split("=");
        	
            if (query.length > 0) {
                shop_routing_id = query[1];
                API.getRouting(shop_routing_id,function(res){
                    if (res.code == 1) {
                    	routing.addLine(res.data, res.driver);
                    }else{
                        bootbox.alert("not Ok !", function(res) {
                        });
                    }
                });
            } else {
            	
            }
        },
        addLine : function(data, driver) {
        	for (var i = 0; i < data.length; i++) {
        		
        		console.log(data[i]);
        		var driver_id = data[i].routings[0].driver_id;
            	routing.InformationRouting(data[i]);
            	var html = '';
        		html += '<div id="user-1" class="user" >';
        		html += '<div class="user-name pos-left-150">';
        		html += '<span class="glyphicon glyphicon-user" aria-hidden="true"></span> <span>' + driver[0].username+'</span>'
        		html += '</div>';
        		html += '<div class="user-time-line" id="user-time-line-' + i +'">';
        		
        		
        		var start = data[i].routings[0].start.time;
        		var end = data[i].routings[0].end.time;
        		var time_start = this._getTimeByHour(start);
        		var time_end = this._getTimeByHour(end);
        		var minute_to_px = 52/10;
        		var begin_minute = 6*60;
        		var start_minute = time_start[0]*60 + parseInt(time_start[1]);
        		var end_minute = time_end[0]*60 + parseInt(time_end[1]);
        		var length_time = (end_minute - start_minute)*minute_to_px;
        		console.log(time_start[1]);
        		var left = 20;
        		left = left + (start_minute - begin_minute)*minute_to_px;
        		console.log(left);
        	    
                $("<style>#user-time-line-" + i + "::before {left:" + left +"px; width:" + length_time+"px }</style>").appendTo("head");
                for(var k = 0; k < data[i].routings[0].stores.length; k++) {
                	if(data[i].routings[0].stores[k].order != null) {
                		var time_deliver = this._getTimeByHour(data[i].routings[0].stores[k].deliver_time);
                		var time_deliver_minute = time_deliver[0]*60 + parseInt(time_deliver[1]);
                		var length_time_deliver = 10 + (time_deliver_minute - begin_minute)*minute_to_px;
                		console.log(length_time_deliver);
                        html += '<span data-id= style="left: ' + length_time_deliver +'px" class="order-point glyphicon glyphicon-map-marker" aria-hidden="true"></span>';
                	}
                }
                html += '</div>';
        		html += '</div>';
        		$('#routing-user').append(html);
        		
        	}
        	
        },
        _getTimeByHour: function (time) {
            /*fomart h:m*/
            return time.split(":");
        },
        
        InformationRouting: function (data) {
            var html = '';
            html += '<ul id="routing-status" class="float-left col-md-6">';
            html += '<li><p>ORDER SEVERED</p><p>' + data.served_orders.length + '/' + data.total_orders.length+ '</p></li>';
            html += '<li><p>WORKING TIME</p><p>' + round(data.total_working_time, 1) + 'MINS</p></li>';
            html += '<li><p>TOTAL DISTANCE</p><p>' + round(data.total_distance, 1) + 'KM</p></li></ul>';
            html += '<div class="right col-md-6"><button class="n-btn btn-cancel">Cancel</button><button class="n-btn btn-ok">LINK THEO DÕI</button></div>';
            $('#routing-footer').append(html);

        },

    }
}();

