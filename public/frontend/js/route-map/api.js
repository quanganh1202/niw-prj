var API = function() {
    var settings = {};
    var _urlAPI = 'http://125.212.207.183:1337/';

    var _listWarehouseUrl = _urlAPI + 'list-warehouse';
    var _addNewOrder = _urlAPI + 'add-new-order';
	var _editOrder = _urlAPI + 'edit-order';

    var _findCustomerByPhone = _urlAPI + 'find-customer';
    
    var _listOrder = _urlAPI + 'list-order';
    var _delOrder = _urlAPI+'del-order';

    var _listDriver = _urlAPI + 'list-driver';
    var _getDriver = _urlAPI + 'get-driver';
    var _getDispatching = _urlAPI + 'get-dispatching';
    var _shopDispatching = _urlAPI + 'shop-dispatching';

    var _route_optimize_url = _urlAPI+'optimize'



    var _headers = {};

    var _APITIMEOUT = 30 * 1000;
    var _TIMEOUTMSG = 'timeout';
    return {
        setHeader: function(oHeaders) {
            _headers = oHeaders;
            $.ajaxSetup({
                global: false,
                beforeSend: function(xhr) {
                    $('#loading').show();
                },
                statusCode: {
                    401: function(error) {
                        console.log(error);
                        $('#loading').hide();
                    },
                    403: function(error, callback) {
                        console.log(error);
                        $('#loading').hide();
                        _redirectLogin();
                    },
                    500: function(error) {
                        console.log(error);
                        $('#loading').hide();

                        alert('500 Internal Server Error');

                    }
                },
                success: function(result, status, xhr) {
                    $('#loading').hide();
                    $('#loading').addClass('op');
                }
            });
        },
        int: function(options) {

        },
        listWarehouse: function(data, callback) {
            $.ajax({
                type: 'POST',
                url: _listWarehouseUrl,
                data: data,
                timeout: _APITIMEOUT
            }).done(function(response) {
                callback(response)
            }).fail(function(jqXHR, textStatus) {
                if (textStatus === 'timeout') {
                    callback({
                        code: -1,
                        msg: _TIMEOUTMSG
                    })
                }
            });
        },
        addNewOrder:function(data,callback) {
            var request = {};
			var url = data;
			var pairs = url.substring(url.indexOf('?') + 1).split('&');
			for (var i = 0; i < pairs.length; i++) {
				if(!pairs[i])
					continue;
				var pair = pairs[i].split('=');
				request[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1]);
			}
			if(request._id && request._id != '') {
				$.ajax({
                type: 'POST',
                url: _editOrder,
                data: data,
                timeout: _APITIMEOUT
				}).done(function(response) {
					callback(response)
				}).fail(function(jqXHR, textStatus) {
					if (textStatus === 'timeout') {
						callback({
							code: -1,
							msg: _TIMEOUTMSG
						})
					}
				});
			} else {
				$.ajax({
                type: 'POST',
                url: _addNewOrder,
                data: data,
                timeout: _APITIMEOUT
				}).done(function(response) {
					callback(response)
				}).fail(function(jqXHR, textStatus) {
					if (textStatus === 'timeout') {
						callback({
							code: -1,
							msg: _TIMEOUTMSG
						})
					}
				});
			}
            
        },
		editOrder:function(data,callback) {
            $.ajax({
                type: 'POST',
                url: _editOrder,
                data: data,
                timeout: _APITIMEOUT
            }).done(function(response) {
                callback(response)
            }).fail(function(jqXHR, textStatus) {
                if (textStatus === 'timeout') {
                    callback({
                        code: -1,
                        msg: _TIMEOUTMSG
                    })
                }
            });
        },
        listOrder:function(data,callback){
            $.ajax({
                type: 'POST',
                url: _listOrder,
                data: data,
                timeout: _APITIMEOUT
            }).done(function(response) {
                callback(response)
            }).fail(function(jqXHR, textStatus) {
                if (textStatus === 'timeout') {
                    callback({
                        code: -1,
                        msg: _TIMEOUTMSG
                    })
                }
            });
        },
        delOrder:function (data,callback) {
            $.ajax({
                type: 'POST',
                url: _delOrder,
                data: data,
                timeout: _APITIMEOUT
            }).done(function(response) {
                callback(response)
            }).fail(function(jqXHR, textStatus) {
                if (textStatus === 'timeout') {
                    callback({
                        code: -1,
                        msg: _TIMEOUTMSG
                    })
                }
            });
        },
        findCustomerByPhone:function (data,callback) {
             $.ajax({
                url: _findCustomerByPhone,
                dataType: "json",
                data: data,
                success: function(data) {
                    callback(data);
                }
            });
        },
        listDriver:function(data,callback){
            $.ajax({
                type: 'GET',
                url: _listDriver,
                data: data,
                timeout: _APITIMEOUT
            }).done(function(response) {
                callback(response)
            }).fail(function(jqXHR, textStatus) {
                if (textStatus === 'timeout') {
                    callback({
                        code: -1,
                        msg: _TIMEOUTMSG
                    })
                }
            });
        },
        getDriver:function(data,callback){
        	console.log(data);
            $.ajax({
                type: 'POST',
                url: _getDriver,
                data: data,
                timeout: _APITIMEOUT
            }).done(function(response) {
                callback(response)
            }).fail(function(jqXHR, textStatus) {
                if (textStatus === 'timeout') {
                    callback({
                        code: -1,
                        msg: _TIMEOUTMSG
                    })
                }
            });
        },
        getRouting:function(routing_id,callback){
            $.ajax({
                type: 'POST',
                url: _getDispatching,
                data: {
                    shop_routing_id: routing_id
                },
                timeout: _APITIMEOUT
            }).done(function(response) {
                callback(response)
            }).fail(function(jqXHR, textStatus) {
                if (textStatus === 'timeout') {
                    callback({
                        code: -1,
                        msg: _TIMEOUTMSG
                    })
                }
            });
        },
        ShopDispatching:function(routing_id,callback){
            $.ajax({
                type: 'POST',
                url: _shopDispatching,
                data: {
                    shop_routing_id: routing_id
                },
                timeout: _APITIMEOUT
            }).done(function(response) {
                callback(response)
            }).fail(function(jqXHR, textStatus) {
                if (textStatus === 'timeout') {
                    callback({
                        code: -1,
                        msg: _TIMEOUTMSG
                    })
                }
            });
        },
        StartRouting: function(data,callback) {
            $.ajax({
                type: 'POST',
                url: _route_optimize_url,
                data: {
                    // token: _headers['x-access-token'],
                    // user_id: _headers['x-user-id'],
                    routing_date: API.getNowTime(),
                    order_ids: data.order_ids,
                    driver_ids: data.driver_ids
                },
                timeout: false,
                beforeSend: function(xhr) {
                    $('#loading').addClass('op').show();
                }
            }).done(function(data) {
                callback(data)
            }).fail(function(jqXHR, textStatus) {
                callback({
                    code:-1,
                    textStatus:textStatus,
                    jqXHR:jqXHR
                })
            });
        },
        getNowTime: function() {
            var date = new Date();
            return new Date((date.getMonth() + 1) + '/' + (date.getDate()) + '/' + date.getFullYear()).getTime();
        }
    }
}();
