$(function() {
    var prev_infowindow = []; 
    var gm = google.maps;
    $.fn.googleMap = function(params) {
        params = $.extend({
            zoom: 15,
            coords: [20.96532, 105.7673161],
            type: "ROADMAP",
            debug: false,
            langage: "english",
            scrollwheel: true,
            success: function(argument) {
                // body...
            }
        }, params);

        switch (params.type) {
            case 'ROADMAP':
            case 'SATELLITE':
            case 'HYBRID':
            case 'TERRAIN':
                params.type = google.maps.MapTypeId[params.type];
                break;
            default:
                params.type = google.maps.MapTypeId.ROADMAP;
                break;
        }

        this.each(function() {

            var map = new google.maps.Map(this, {
                zoom: params.zoom,
                center: new google.maps.LatLng(params.coords[0], params.coords[1]),
                mapTypeId: params.type,
                streetViewControl: true,
                mapTypeControl: true,
                scrollwheel: params.scrollwheel,
                mapTypeControl: true,
			    mapTypeControlOptions: {
			        style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
			        position: google.maps.ControlPosition.RIGHT_TOP
			    },
			    zoomControl: true,
			    zoomControlOptions: {
			        position: google.maps.ControlPosition.RIGHT_CENTER
			    },
			    // scaleControl: true,
			    // streetViewControl: true,
			    // streetViewControlOptions: {
			    //     position: google.maps.ControlPosition.LEFT_TOP
			    // }
                // zoomControlOptions: {
                //        position: google.maps.ControlPosition.TOP_CENTER
                //    },
            });
            // var mc = new MarkerClusterer(map);
            _map = map;
            google.maps.event.addListenerOnce(map, 'tilesloaded', function() {
                // $('#loading').animate({
                //         opacity: "hide"
                //     }, "700");
                // Routing.start();
                params.success(true);
            });

            $(this).data('googleMap', map);
            $(this).data('googleLang', params.langage);
            $(this).data('googleDebug', params.debug);
            $(this).data('googleMarker', new Array());
            $(this).data('googleBound', new google.maps.LatLngBounds());
        });

        return this;
    }
    $.fn.googleMaploaded = function(params) {

    }
    $.fn.focusToMarker = function(id) {
        var $this = $(this);
        var $markers = $this.data('googleMarker');
        _map.setCenter($markers[id].getPosition());
        _map.setZoom(15);
        if (prev_infowindow) {
        	//prev_infowindow.close();
        };
        
        google.maps.event.trigger($markers[id], 'click');
    }
    $.fn.unfocusToMarker = function(id) {
        _map.setZoom(15);
        prev_infowindow[id].close();
    }
    $.fn.addMarker = function(params) {
        params = $.extend({
            coords: false,
            address: false,
            url: false,
            id: false,
            icon: false,
            draggable: false,
            title: "",
            text: "",
            label: "",
            success: function() {}
        }, params);

        this.each(function() {
            $this = $(this);

            if (!$this.data('googleMap')) {
                if ($this.data('googleDebug'))
                    console.error("jQuery googleMap : Unable to add a marker where there is no map !");

                return false;
            }

            if (!params.coords && !params.address) {
                if ($this.data('googleDebug'))
                    console.error("jQuery googleMap : Unable to add a marker if you don't tell us where !");

                return false;
            }

            if (params.address && typeof params.address == "string") {

                var geocodeAsync = function($that) {

                    var geocoder = new google.maps.Geocoder();

                    geocoder.geocode({
                        address: params.address,
                        bounds: $that.data('googleBound'),
                        language: $that.data('googleLang')
                    }, function(results, status) {

                        if (status == google.maps.GeocoderStatus.OK) {
                            $that.data('googleBound').extend(results[0].geometry.location);

                            if (params.icon) {
                                var marker =new Marker({
                                    map: $this.data('googleMap'),
                                    position: results[0].geometry.location,
                                    title: params.title,
                                    icon: params.icon,
                                    draggable: params.draggable,
                                    map_icon_label: params.label
                                });
                            } else {
                                var marker =new Marker({
                                    map: $that.data('googleMap'),
                                    position: results[0].geometry.location,
                                    title: params.title,
                                    draggable: params.draggable,
                                    map_icon_label:params.label
                                });
                            }

                            if (params.draggable) {
                                google.maps.event.addListener(marker, 'dragend', function() {
                                    var location = marker.getPosition();

                                    var coords = {};

                                    coords.lat = location.lat();
                                    coords.lon = location.lng();

                                    params.success(coords, $this);
                                });
                            }

                            if (params.title != "" && params.text != "" && !params.url) {
                                var infowindow = new google.maps.InfoWindow({
                                    content: "<h1>" + params.title + "</h1>" + params.text
                                });
                                prev_infowindow[params.id] = infowindow;
                                var map = $that.data('googleMap');

                                google.maps.event.addListener(marker, 'click', function() {
                                	if( prev_infowindow ) {
	                                	// prev_infowindow.close();
	                                }
                        			
                                    infowindow.open(map, marker);
                                });
                            } else if (params.url) {
                                google.maps.event.addListener(marker, 'click', function() {
                                    document.location = params.url;
                                });
                            }

                            if (!params.id) {
                                $that.data('googleMarker').push(marker);
                            } else {
                                $that.data('googleMarker')[params.id] = marker;
                            }

                            if ($that.data('googleMarker').length == 1) {
                                $that.data('googleMap').setCenter(results[0].geometry.location);
                                $that.data('googleMap').setZoom($that.data('googleMap').getZoom());
                            } else {
                                $that.data('googleMap').fitBounds($that.data('googleBound'));
                            }

                            var coords = {};
                            coords.lat = results[0].geometry.location.lat();
                            coords.lon = results[0].geometry.location.lng();

                            params.success(coords, $this);

                        } else {
                            if ($this.data('googleDebug'))
                                console.error("jQuery googleMap : Unable to find the place asked for the marker (" + status + ")");
                        }
                    });
                }($this);
            } else {
                $this.data('googleBound').extend(new google.maps.LatLng(params.coords[0], params.coords[1]));

                if (params.icon) {
                    var marker =new Marker({
                        map: $this.data('googleMap'),
                        position: new google.maps.LatLng(params.coords[0], params.coords[1]),
                        title: params.title,
                        icon: params.icon,
                        draggable: params.draggable,
                        map_icon_label:params.label
                    });
                } else {
                    var marker =new Marker({
                        map: $this.data('googleMap'),
                        position: new google.maps.LatLng(params.coords[0], params.coords[1]),
                        title: params.title,
                        draggable: params.draggable,
                        map_icon_label: params.label
                    });
                }

                if (params.title != "" && params.text != "" && !params.url) {
                    var infowindow = new google.maps.InfoWindow({
                        content: "<h1>" + params.title + "</h1>" + params.text
                    });
                    prev_infowindow[params.id] = infowindow;
                    var map = $this.data('googleMap');

                    google.maps.event.addListener(marker, 'click', function() {
                    	if( prev_infowindow ) {
	                        //prev_infowindow.close();
	                    }
                        
                        
                        infowindow.open(map, marker);
                    });
                } else if (params.url) {
                    google.maps.event.addListener(marker, 'click', function() {
                        document.location = params.url;
                    });
                }

                if (params.draggable) {
                    google.maps.event.addListener(marker, 'dragend', function() {
                        var location = marker.getPosition();

                        var coords = {};

                        coords.lat = location.lat();
                        coords.lon = location.lng();

                        params.success(coords, $this);
                    });
                }

                if (!params.id) {
                    $this.data('googleMarker').push(marker);
                } else {
                    $this.data('googleMarker')[params.id] = marker;
                }

                if ($this.data('googleMarker').length == 1) {
                    $this.data('googleMap').setCenter(new google.maps.LatLng(params.coords[0], params.coords[1]));
                    $this.data('googleMap').setZoom($this.data('googleMap').getZoom());
                } else {
                    $this.data('googleMap').fitBounds($this.data('googleBound'));
                }

                params.success({
                    lat: params.coords[0],
                    lon: params.coords[1]
                }, $this);
            }
        });

        return this;
    }
   
    $.fn.removeMarker = function(id) {
        this.each(function() {
            var $this = $(this);

            if (!$this.data('googleMap')) {
                if ($this.data('googleDebug'))
                    console.log("jQuery googleMap : Unable to delete a marker where there is no map !");

                return false;
            }

            var $markers = $this.data('googleMarker');

            if (typeof $markers[id] != 'undefined') {
                $markers[id].setMap(null);

                if ($this.data('googleDebug'))
                    console.log('jQuery googleMap : marker deleted');

                return true;
            } else {
                if ($this.data('googleDebug'))
                    console.error("jQuery googleMap : Unable to delete a marker if it not exists !");

                return false;
            }
        });
    }
    $.fn.addWayTwoPoint = function(params) {
        params = $.extend({
            start: false,
            end: false,
            route: false,
            langage: 'english',
            step: [],
            color: _getRandomColor(),
            success: function() {

            }
        }, params);

        var direction = new google.maps.DirectionsService({
            region: "fr"
        });

        var way = new google.maps.DirectionsRenderer({
            draggable: false,
            map: $(this).data('googleMap'),
            panel: document.getElementById(params.route),
            provideTripAlternatives: true,
            markerOptions: {
                icon: 'img/marker.png',
            },
            suppressMarkers: true,
            polylineOptions: {
                strokeColor: params.color
            },
            preserveViewport: true
        });


        var request = {
            origin: {
                lat: params.start[0],
                lng: params.start[1]
            },
            destination: {
                lat: params.end[0],
                lng: params.end[1]
            },
            travelMode: google.maps.DirectionsTravelMode.DRIVING,
            region: "fr",
            waypoints: []
        };

        direction.route(request, function(response, status) {
            if (status == google.maps.DirectionsStatus.OK) {
                way.setDirections(response);
                params.success(response)
            } else {
                console.error("jQuery googleMap : Unable to find the place asked for the route (" + response + ")");
            }
        });
        return this;
    };
    $.fn.addWay = function(params) {
        params = $.extend({
            start: false,
            end: false,
            step: [],
            route: false,
            langage: 'english',
            color: _getRandomColor(),
            success: function() {}
        }, params);

        var direction = new google.maps.DirectionsService({
            region: "fr"
        });
        var way = new google.maps.DirectionsRenderer({
            draggable: false,
            map: $(this).data('googleMap'),
            panel: document.getElementById(params.route),
            provideTripAlternatives: true,
            markerOptions: {
                icon: 'img/marker.png',
            },
            // suppressMarkers: true,
            polylineOptions: {
                strokeColor: params.color
            }
        });

        document.getElementById.innerHTML = "";

        var waypoints = [];

        for (var i in params.step) {
            var step;
            if (typeof params.step[i] == "object") {
                step = new google.maps.LatLng(params.step[i][0], params.step[i][1]);
            } else {
                step = params.step[i];
            }

            waypoints.push({
                location: step,
                stopover: true
            });
        }

        if (typeof params.end != "object") {
            var geocodeAsync = function($that) {
                var geocoder = new google.maps.Geocoder();

                geocoder.geocode({
                    address: params.end,
                    bounds: $that.data('googleBound'),
                    language: params.langage
                }, function(results, status) {
                    if (status == google.maps.GeocoderStatus.OK) {
                        var request = {
                            origin: params.start,
                            destination: results[0].geometry.location,
                            travelMode: google.maps.DirectionsTravelMode.DRIVING,
                            region: "fr",
                            waypoints: waypoints
                        };

                        direction.route(request, function(response, status) {
                        	console.log(response);
                        	console.log(status);
                            if (status == google.maps.DirectionsStatus.OK) {
                            	
                                way.setDirections(response);
                            } else {
                                if ($that.data('googleDebug'))
                                    console.error("jQuery googleMap : Unable to find the place asked for the route (" + response + ")");
                            }
                        });

                    } else {
                        if ($that.data('googleDebug'))
                            console.error("jQuery googleMap : Address not found");
                    }
                });
            }($(this));
        } else {
            var request = {
                origin: params.start,
                destination: new google.maps.LatLng(params.end[0], params.end[1]),
                travelMode: google.maps.DirectionsTravelMode.DRIVING,
                region: "fr",
                waypoints: waypoints
            };

            direction.route(request, function(response, status) {
                if (status == google.maps.DirectionsStatus.OK) {
                	console.log(response)
                    params.success(response.routes[0])
                    way.setDirections(response);
                } else {
                    if ($(this).data('googleDebug'))
                        console.error("jQuery googleMap : Address not found");
                }
            });
        }

        return this;
    }
});