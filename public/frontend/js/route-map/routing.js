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
    var _getValOfCheckBox = function(elm) {
        var _array = [];
        elm.each(function(argument) {
            _array.push($(this).val());
        })
        return _array;
    };
    return {
        int: function(options) {
        	settings = options;
            var query = location.search.substring(1).split("=");

            if (query.length > 0) {
                var query_ = query[1];
                var query_last = query_.split("&");
                var shop_routing_id = query_last[0];
                if(location.pathname != '/frontend/shop-routing.html') {
                	API.getRouting(shop_routing_id, function(res) {
                        if (res.code == 1) {
                            routing.addLine(res.data, res.driver);
                            routing.addMarkers(res.data[0].routings[0].stores, res.data[0].served_orders);
                        } else {
                            bootbox.alert("not Ok !", function(res) {});
                        }
                    });
                } else {
                	API.ShopDispatching(shop_routing_id, function(res) {
                        if (res.code == 1) {
                        	console.log(res.data);
                            routing.addLine(res.data, res.driver);
                            routing.addMarkers(res.data[0].routings[0].stores, res.data[0].served_orders);
                        } else {
                            bootbox.alert("not Ok !", function(res) {});
                        }
                    });
                }
                
            } else {

            }

            $(document).on('click', '.user-time-line .marker-item', function () {
                nMap.focus($(this).data('id'));
            });
        },
        addMarkers: function(aMarkers, servedOrders) {
            console.log(aMarkers)
            var _servedOrders = [];
            for (var i = 0; i < servedOrders.length; i++) {
                _servedOrders[servedOrders[i]._id] = servedOrders[i];
            }
            var _i = 0;
            var _start = [];
            var _end = [];

            var setIntevalOrder = setInterval(function() {
                 var orderInfo = null;
                 var orderInfoAfterPoint = null;
                if (_i < aMarkers.length) {
                    var color = _getRandomColor();
                    var _markers = aMarkers[_i];
                    if (_markers.order == null || _markers.order == "") {
                        // wasehouse
                        
                        _start = [+_markers.other_location.location.lat,+_markers.other_location.location.lng];
                        console.log(_markers._id);
                        nMap.loadMarker({
                            lat: _markers.other_location.location.lat,
                            lng: _markers.other_location.location.lng,
                            id: _markers._id,
                            title: _markers.other_location.name,
                            text: _markers.other_location.address,
                            icon: {
                                path: SQUARE_PIN,
                                fillColor: color,
                                fillOpacity: 1,
                                strokeColor: '',
                                strokeWeight: 0,
                                size: new google.maps.Size(10, 12),
                                scale: 0.9,
                            },
                            label: '<span class="map-icon map-icon-store home"></span>' + '<b>' + _i + '</b>'
                        });
                    } else {
                        var orderId = _markers.order;
                        var orderInfo = _servedOrders[orderId];
                        _start = [+orderInfo.address.lat,+orderInfo.address.lng];
                        console.log(orderInfo._id);
                        nMap.loadMarker({
                            lat: orderInfo.address.lat,
                            lng: orderInfo.address.lng,
                            id: _markers._id,
                            title: routing._titleMarker(orderInfo),
                            text: routing._contentMarker(orderInfo),
                            icon: {
                                path: MAP_PIN,
                                fillColor: color,
                                fillOpacity: 1,
                                strokeColor: '',
                                strokeWeight: 0,
                                size: new google.maps.Size(10, 12),
                                scale: 0.7,
                            },
                            label: '<span class="map-icon label-icon map-icon-circle"></span>' + '<b>' + _i + '</b>'
                        });
                    }
                    if (_i < aMarkers.length - 1) {
                        var afterPoint =  aMarkers[_i+1];
                        if (afterPoint.order != null) {
                            var orderInfoAfterPoint = _servedOrders[afterPoint.order];
                        }
                        _end = routing._getLocation(afterPoint,orderInfoAfterPoint);
                        //addway
                        nMap.addWayTwoPoint(
                                _start,
                                _end,
                                color,
                                function (s) {
                                }
                        )
                    }
                    _i++;
                } else {
                    clearInterval(setIntevalOrder);
                }
            }, 700)
        },
        _getLocation:function  (point,order) {
            if (order == null) {
                return [+point.other_location.location.lat,+point.other_location.location.lng];
            }else{
                return [+order.address.lat,+order.address.lng]
            }
        },
        _titleMarker: function(orderInfo) {
            var text = "Order id : " + orderInfo.order_id;
            //text some thing in object
            return text;
        },
        _contentMarker: function(orderInfo) {
            var text = "<p>Customer: " + orderInfo.fullname + "</p>";
            text += "Address: " + orderInfo.address.title + "\n\n";
            //text some thing in object
            return text;
        },
        addLine: function(data, driver) {
        	var isStart = 0;
            for (var i = 0; i < data.length; i++) {
                var driver_id = data[i].routings[0].driver_id;
                routing.InformationRouting(data[i]);
                var html = '';
                html += '<div id="user-1" class="user" >';
                html += '<div class="user-name pos-left-150">';
                html += '<span class="glyphicon glyphicon-user" aria-hidden="true"></span> <span>' + driver[0].username + '</span>'
                html += '</div>';
                html += '<div class="user-time-line" id="user-time-line-' + i + '">';


                var start = data[i].routings[0].start.time;
                var end = data[i].routings[0].end.time;
                var time_start = this._getTimeByHour(start);
                var time_end = this._getTimeByHour(end);
                var minute_to_px = 52 / 10;
                var begin_minute = 6 * 60;
                var start_minute = time_start[0] * 60 + parseInt(time_start[1]);
                var end_minute = time_end[0] * 60 + parseInt(time_end[1]);
                var length_time = (end_minute - start_minute) * minute_to_px;
                var left = 20;
                left = left + (start_minute - begin_minute) * minute_to_px;

                $("<style>#user-time-line-" + i + "::before {left:" + left + "px; width:" + length_time + "px }</style>").appendTo("head");
                
                for (var k = 0; k < data[i].routings[0].stores.length; k++) {
                    if (data[i].routings[0].stores[k].order != null) {
                        var time_deliver = this._getTimeByHour(data[i].routings[0].stores[k].deliver_time);
                        var time_deliver_minute = time_deliver[0] * 60 + parseInt(time_deliver[1]);
                        var length_time_deliver = 10 + (time_deliver_minute - begin_minute) * minute_to_px;
                        html += '<span data-id="'+data[i].routings[0].stores[k]._id+'" style="left: ' + length_time_deliver + 'px" class="marker-item order-point glyphicon glyphicon-map-marker" aria-hidden="true"></span>';
                    }else{
                    	
                    	var time_deliver = this._getTimeByHour(data[i].routings[0].stores[k].other_location.time);
                        var time_deliver_minute = time_deliver[0] * 60 + parseInt(time_deliver[1]);
                        var length_time_deliver = 10 + (time_deliver_minute - begin_minute) * minute_to_px;
                        if(isStart == 0){
                    		var isStart = length_time_deliver;
                    	}
                        html += '<span data-id="'+data[i].routings[0].stores[k]._id+'" style="left: ' + length_time_deliver + 'px" class="marker-item glyphicon order-point glyphicon-home" aria-hidden="true"></span>';
                    	console.log(data[i].routings[0].stores[i]);
                    }
                }
               
                html += '</div>';
                html += '</div>';
                $('#routing-user').append(html);
                $('#routing-content #content').scrollLeft(isStart-100)

            }

        },
        _getTimeByHour: function(time) {
            /*fomart h:m*/
            return time.split(":");
        },

        InformationRouting: function(data) {
        	var query = location.search.substring(1).split("=");
        	var query_ = query[1];
            var query_last = query_.split("&");
            var shop_routing_id = query_last[0];
            var html = '';
            console.log(data);
            html += '<ul id="routing-status" class="float-left col-md-6">';
            html += '<li><p>ORDER SEVERED</p><p>' + data.served_orders.length + '/' + data.total_orders.length + '</p></li>';
            html += '<li><p>WORKING TIME</p><p>' + round(data.total_working_time, 1) + 'MINS</p></li>';
            html += '<li><p>TOTAL DISTANCE</p><p>' + round(data.total_distance, 1) + 'KM</p></li></ul>';
            if(settings && settings.page==1){
            	 html += '<div class="right col-md-6"> <a href="/frontend/routing.html?shop_routing_id='+shop_routing_id+'&customer=0" class="n-btn btn-ok">LINK THEO DÕI</a></div>';
            }else{
            	var LatDriver = data.routings[0].end.location.lat - 0.0006;
            	var LngDriver = data.routings[0].end.location.lng - 0.0006;
            	if(query_last[1] == 'customer') {
            		nMap.loadMarker({
                        lat: LatDriver,
                        lng: LngDriver,
                        title: 'Driver',
                        text: 'driver',
                        icon: {
                            path: MAP_PIN,
                            fillColor: "blue",
                            fillOpacity: 1,
                            strokeColor: '',
                            strokeWeight: 0,
                            size: new google.maps.Size(10, 12),
                            scale: 0.9,
                        },
                        label: '<span class="map-icon label-icon map-icon-bycicle"></span>' + '<b></b>'
                    });
            	} else {
                    html += '<div class="right col-md-6"><button class="n-btn btn-cancel">Cancel</button><a href="/frontend/shop-routing.html?shop_routing_id='+shop_routing_id+'" class="n-btn btn-ok">DISPATCHING</a></div>';

            	}
            }
            $('#routing-footer').append(html);

        },

    }
}();