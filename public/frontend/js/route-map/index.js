var index = function() {
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
    var _getValOfCheckBox = function(elm){
      var _array = [];
      elm.each(function (argument) {
        _array.push($(this).val());
      })
      return _array;
    };
    var validateForm = function(form) {
        $('.error').removeClass('error');
        var _validate = true;
        form.find('.validate').each(function() {
            if ($(this).val() == '' && $(this).data('type') == 'not-null') {
                _validate = false;
                $(this).addClass('error');
            }
            if ($(this).data('type') == 'email' && !validateEmail($(this).val())) {
                _validate = false;
                $(this).addClass('error');
            }
        })
        return _validate;
    };
    var validateEmail = function(email) {
        var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email);
    }
    return {
        int: function(options) {
            $("#file-csv").on('change', function(e) {
                $('#upload-prosess').hide().html('0/0');
                var ext = $(this).val().split(".").pop().toLowerCase();
                if ($.inArray(ext, ["csv"]) == -1) {
                    $('#upload-area').addClass('wap-error animation-one');
                    $(this).val("");
                    bootbox.alert("Chỉ chập nhận CSV file !");
                    return false;
                }
                $('#upload-prosess').show();


                if (e.target.files != undefined) {
                    var reader = new FileReader();
                    reader.onload = function(e) {
                        var csvval = e.target.result.split("\n");
                        $('#upload-prosess').html('0/' + csvval.length);
                        //Orders.sendCsv(csvval)
                    };
                    reader.readAsText(e.target.files.item(0));
                }
                $(this).val("");

            })
            
            $(document).on('click', '#cancel-order', function() {
                index.resertForm($('#add-new-order-form'));
                
            });
            $(document).on('click', '#routing-btn', function() {
                if ($('.check-driver:checked').length == 0) {
                    bootbox.alert("Vui lòng chọn Driver !", function(res) {
                                console.log(res);
                            });
                    return false;
                }else{

                    var box = bootbox.alert("Vui lòng chờ.... !", function(res) {
                        console.log(res);
                    });
                    $('.bootbox-close-button,.modal-footer').hide();
                    API.StartRouting({
                        order_ids: _getValOfCheckBox($('input.check-box-order:checked')).toString(),
                        driver_ids: _getValOfCheckBox($('input.check-driver:checked')).toString()
                    },function(res){
                        box.modal('hide');
                        console.log(res.code);
                        if (res.code == 0) {
                        	console.log(res);
                        	window.location.href = 'frontend/routing.html?shop_routing_id='+res.data._id;
                        }else{
                            bootbox.alert("not Ok !", function(res) {
                            });
                        }
                    });
                    // setTimeout(function() {
                    //     box.modal('hide');
                    //     bootbox.alert("Ok !", function(res) {
                    //             console.log(res);
                    //         });
                    // }, 1000);
                }
            });
            $(document).on('click', '.del-oder', function() {
                var idOrder = $(this).data('id');
                index.delOrder({_id:idOrder});
                return false;
            });

            $(document).on('click', '.edit-oder', function() {
                var idOrder = $(this).data('id');
                showBlock('add-new-order-content');
                index.fillFormEditOrder(idOrder);
                return false;
            });
            
            $('#check-all-driver').change(function() {
                $("input.check-driver").prop('checked', $(this).prop("checked"));
            });
            $('#check-all-order').change(function() {
                $("input.check-box-order").prop('checked', $(this).prop("checked"));
            });
            $("#address-title").geocomplete({
                details: "#add-new-order-form"
            }).bind("geocode:result", function(event, result) {
                $('#address-lat').val(result.geometry.location.lat());
                $('#address-lng').val(result.geometry.location.lng());
            });
            $('#order_id').val(makeid('O-', 7));
            index.listWarehouse($('#list-warehouse'));
            index.listOrder({
                status: 0
            }, function(res) {
                if (res.code == 1) {
                    index.pendingOrder(res.data)
                } else {

                }
            });
            index.listOrder({
                status: 1
            }, function(res) {
                if (res.code == 1) {
                    index.checkingOrder(res.data)
                } else {

                }
            });
            index.listDriver({
                is_removed: 0
            }, function(res) {
                if (res.code == 1) {
                    index.driverTbl(res.data)
                } else {

                }
            });

            $('#phone,.product-qty').mask('PPPPPPPPPPPPPPPPPPPPP', {
                'translation': {
                    P: {
                        pattern: /[0-9]/
                    }
                }
            });
            $('#phone').blur();
            $(document).on('focusout', '.product-qty', function() {
                var _this = $(this);
                var parrents = _this.parents('.parent-product');
                var qty = parrents.find('.product-qty').val();
                var size = parrents.find('.product-size').val();
                var aSize = size.split('/')
                parrents.find('.w-v').html("w : " + (qty * aSize[0]) + " / v : " + (qty * aSize[1]));
                parrents.find('.product-v').val(qty * aSize[1]);
                parrents.find('.product-w').val(qty * aSize[0]);
            })
            $(document).on('change', '.product-size', function() {
                var _this = $(this);
                var parrents = _this.parents('.parent-product');
                var qty = parrents.find('.product-qty').val();
                var size = parrents.find('.product-size').val();
                var aSize = size.split('/')
                parrents.find('.w-v').html("w : " + (qty * aSize[0]) + " / v : " + (qty * aSize[1]));
                parrents.find('.product-v').val(qty * aSize[1]);
                parrents.find('.product-w').val(qty * aSize[0]);
            })
            $("#phone").autocomplete({
                source: function(request, response) {
                    API.findCustomerByPhone({
                        phone: request.term
                    }, function(data) {
                        if (data.code == 1) {
                            var aData = data.data;
                            var newData = [];
                            for (var i = 0; i < aData.length; i++) {
                                newData.push({
                                    label: aData[i].fullname + '-' + aData[i].phone,
                                    id: aData[i]._id,
                                    fullname: aData[i].fullname,
                                    address: aData[i].address,
                                    phone: aData[i].phone,
                                    email: aData[i].email
                                });
                            }
                        }
                        response(newData);
                    })
                },
                minLength: 1,
                select: function(event, ui) {
                    console.log(ui);
                    setTimeout(function() {
                        $("#phone").val(ui.item.phone);
                    }, 1);
                    $("#email").val(ui.item.email);
                    $("#address-title").val(ui.item.address.title);
                    $("#fullname").val(ui.item.fullname);
                    $('#address-lat').val(ui.item.address.lat);
                    $('#address-lng').val(ui.item.address.lng);
                },
                open: function() {
                    $(this).removeClass("ui-corner-all").addClass("ui-corner-top");
                },
                close: function() {
                    $(this).removeClass("ui-corner-top").addClass("ui-corner-all");
                }
            });

            $('#add-new-order-btn').click(function() {
                if (validateForm($('#add-new-order-form'))) {
                    index.addNewOrder($('#add-new-order-form').serialize());
                }
            })

        },
        listWarehouse: function(parent) {
            API.listWarehouse(false, function(res) {
                if (res.code == 1) {
                    var data = res.data;
                    for (var i = 0; i < data.length; i++) {
                    	console.log(data[i]);
                        index._addWarehouseMarker(data[i]);

                        parent.append('<option value="' + data[i]._id + '">' + data[i].name + '</option>');
                    }
                    parent.select2({
                        placeholder: 'Chọn cửa hàng'
                    });
                } else {
                    console.log(res);
                }
            })
        },
        
        _addWarehouseMarker: function (warehouse) {
        	var MAP_PIN = 'M0-48c-9.8 0-17.7 7.8-17.7 17.4 0 15.5 17.7 30.6 17.7 30.6s17.7-15.4 17.7-30.6c0-9.6-7.9-17.4-17.7-17.4z';
        	var SQUARE_PIN = 'M22-48h-44v43h16l6 5 6-5h16z';
            nMap.loadMarker({
                lat: warehouse.address.lat,
                lng: warehouse.address.lng,
                title: warehouse.name,
                text: warehouse.address.title,
                id: warehouse._id,
                icon: {
                	path: SQUARE_PIN,
                    fillColor: "blue",
                    fillOpacity: 1,
                    strokeColor: '',
                    strokeWeight: 0,
                    size: new google.maps.Size(10, 12),
                    scale: 0.9,
                },
                label: '<span class="map-icon map-icon-store home"></span>' + '<b>' + '' + '</b>'

            });
            
        },
        
        
        
        listDriver: function(data, callback) {
            API.listDriver(data, function(res) {
                callback(res);
            })
        },
        addNewOrder: function(formData) {
            API.addNewOrder(formData, function(res) {
                if (res.code == 1) {
                    bootbox.alert("Thêm Mới Thành Công !", function() {
                        index.resertForm($('#add-new-order-form'));
                        index.listOrder({
                            status: 0
                        }, function(res) {
                            if (res.code == 1) {
                                index.pendingOrder(res.data)
                            } else {

                            }
                        });
                    });
                } else {
                    bootbox.alert("Thêm Mới Không Thành Công !", function() {
                        console.log(res);
                    });
                }
            })
        },
        listOrder: function(data, callback) {
            API.listOrder(data, function(res) {
                callback(res);
            })
        },
        resertForm: function(form) {
            form.find('input:not(.not-reset),textarea:not(.not-reset)').val('');
            $('#order_id').val(makeid('O-', 7));
            $('.new-p').remove();
        },
        pendingOrder: function(aDataOrder) {
            if (aDataOrder.length == 0) {
                $('#pending-order-table .no-result').show();
                return;
            } else {
                $('#pending-order-table .no-result').hide();
            }
            $('#pending-order-table > tbody').html('');
            for (var i = 0; i < aDataOrder.length; i++) {
                var html = '';
                
                dataAllOrder[aDataOrder[i]._id] = aDataOrder[i];
                dataAllOrder[aDataOrder[i]._id]['address-lat'] = aDataOrder[i].address.lat;
                dataAllOrder[aDataOrder[i]._id]['address-lng'] = aDataOrder[i].address.lng;
                dataAllOrder[aDataOrder[i]._id]['address-title'] = aDataOrder[i].address.title;
                
                html += '<tr class=" ' + aDataOrder[i]._id + '">';
                html += '<td><input class="check-box-order" value="'+aDataOrder[i]._id+'" type="checkbox"></td>';
                html += '<td>' + aDataOrder[i].order_id + '</td>';
                html += '<td>' + aDataOrder[i].warehouse_id.name + '</td>';
                html += '<td>' + aDataOrder[i].customer_id.fullname + '</td>';
                html += '<td>' + aDataOrder[i].address.title + '</td>';
                html += '<td>' + aDataOrder[i].delivery_time_start + '-' + aDataOrder[i].delivery_time_end + '</td>';
                html += '<td> <a class="extend-btn"><span class="glyphicon glyphicon-chevron-down " aria-hidden="true" style="display: inline-block;"></span><span class="glyphicon glyphicon-chevron-up" aria-hidden="true" style="display: none;"></span></a></td>';
                html += '</tr>';
                html += '<tr class=" tr-loading- hidden-tr ' + aDataOrder[i]._id + '">';
                html += '<td colspan="4" class="vertical-top padding0">';
                html += '<table class="list-products-in-table" style="width:100%">';
                html += index.listProductForListOrder(aDataOrder[i].product);
                html += '</table>';
                html += '<div class="btn-action"><a class="edit-oder" data-id="' + aDataOrder[i]._id + '"><span class="glyphicon glyphicon-wrench" aria-hidden="true"></span>Sửa</a><a class="del-oder" data-id="' + aDataOrder[i]._id + '"><span class="glyphicon glyphicon-trash" aria-hidden="true"></span>Xóa</a></div>';
                html += '</td>';
                html += '<td colspan="3" class="vertical-top">';
                html += '<p class="left">Điện thoại : <b>' + aDataOrder[i].phone + '</b></p>';
                html += '<p class="left">Ghi chú</p>';
                html += '<p class="left note">' + aDataOrder[i].note + ' </p>';

                html += '</td>';
                html += '</tr>';
                $('#pending-order-table > tbody').append(html);
            }
        },
        listProductForListOrder: function(products) {
            var html = '<tr> <th> Sản phẩm </th> <th> Số lượng </th> <th> Giá tiền </th> <th> Kích cỡ </th> </tr>';

            for (var i = 0; i < products.length; i++) {
                html += '<tr>';
                html += '<td>' + products[i].name + '</td>';
                html += '<td>' + products[i].qty + '</td>';
                html += '<td>' + products[i].price + '</td>';
                html += '<td>' + products[i].size + '</td>';

                html += '</tr>';
            }
            return html;
        },
        checkingOrder: function(aDataOrder) {
            if (aDataOrder.length == 0) {
                $('#checking-order-table .no-result').show();
                return;
            } else {
                $('#checking-order-table .no-result').hide();
            }
            $('#checking-order-table > tbody').html('');
            for (var i = 0; i < aDataOrder.length; i++) {
                var html = '';
                console.log(aDataOrder[i]);
                dataAllOrder[aDataOrder[i]._id] = aDataOrder[i];
                dataAllOrder[aDataOrder[i]._id]['address-lat'] = aDataOrder[i].address.lat;
                dataAllOrder[aDataOrder[i]._id]['address-lng'] = aDataOrder[i].address.lng;
                dataAllOrder[aDataOrder[i]._id]['address-title'] = aDataOrder[i].address.title;
                
                html += '<tr class=" ' + aDataOrder[i]._id + '">';
                html += '<td>' + aDataOrder[i].order_id + '</td>';
                html += '<td>' + aDataOrder[i].warehouse_id.name + '</td>';
                html += '<td>' + aDataOrder[i].customer_id.fullname + '</td>';
                html += '<td>' + aDataOrder[i].address.title + '</td>';
                html += '<td>' + aDataOrder[i].fullname + '</td>';
                html += '<td> <a class="extend-btn"><span class="glyphicon glyphicon-chevron-down " aria-hidden="true" style="display: inline-block;"></span><span class="glyphicon glyphicon-chevron-up" aria-hidden="true" style="display: none;"></span></a></td>';
                html += '</tr>';
                html += '<tr class=" tr-loading- hidden-tr ' + aDataOrder[i]._id + '">';
                html += '<td colspan="4" class="vertical-top padding0">';
                html += '<table class="list-products-in-table" style="width:100%">';
                html += index.listProductForListOrder(aDataOrder[i].product);
                html += '</table>';
                html += '</td>';
                html += '<td colspan="3" class="vertical-top">';
                html += '<p class="left">Điện thoại : <b>' + aDataOrder[i].phone + '</b></p>';
                html += '<p class="left">Ghi chú</p>';
                html += '<p class="left note">' + aDataOrder[i].note + ' </p>';

                html += '</td>';
                html += '</tr>';
                $('#checking-order-table > tbody').append(html);
            }
        },
        driverTbl: function(drivers) {
            if (drivers.length == 0) {
                $('#driver-table .no-result').show();
                return;
            } else {
                $('#driver-table .no-result').hide();
            }
            $('#driver-table > tbody').html('');
            for (var i = 0; i < drivers.length; i++) {
                if (drivers[i].vehicle == 0) {
                    var vehicle = "Xe máy";
                } else if (drivers[i].vehicle == 1) {
                    var vehicle = "Ôtô";
                } else if (drivers[i].vehicle == 2) {
                    var vehicle = "Tàu hỏa";
                } else {
                    var vehicle = "Máy bay";
                }
                var html = '';
                html += '<tr>';
                html += '<td><input type="checkbox" value="'+drivers[i]._id+'" class="check-driver" /></td>';
                html += '<td>' + drivers[i].username + '</td>';
                html += '<td>' + vehicle + '</td>';
                html += '<td>' + drivers[i].warehouse_id.name + '</td>';
                html += '</tr>';
                $('#driver-table > tbody').append(html);

            }
        },
        delOrder:function (data) {
            $('tr.'+data._id).addClass('tr-loading');
            API.delOrder(data,function (res) {
                if (res.code == 1) {
                    $('.'+res.data._id).remove();
                }else{
                    $('.'+res.data._id).addClass('warming').removeClass('tr-loading');
                }
            })
        },
        fillFormEditOrder:function(id){
            var dataOrder = dataAllOrder[id];
            for (k in dataOrder) {
                if(k == 'delivery_date'){
                    var time = new Date(dataOrder[k]);
                    $('#'+k).val(time.customFormat('#DD#/#MM#/#YYYY#'));
                }else if(k == 'product'){
                    index.loadListProductOrder(dataOrder[k]);
                }else{
                    $('#'+k).val(dataOrder[k]);
                }
            }
            $('#add-new-order').addClass('is-edit-form');
        },
        loadListProductOrder:function(listProduct){
            $("input[name='product[0][name]']").val(listProduct[0].name);
            $("input[name='product[0][qty]']").val(listProduct[0].qty);
            $("input[name='product[0][price]']").val(listProduct[0].price);
            for (var i = 1; i < listProduct.length; i++) {
                // var i = $('.new-p').length + 1;
                $('.products-area').append('<div class="new-p parent-product">' + $('.main-products-area').html().replace(/\[0\]/g, "[" + i + "]") + '</div>');
                $('.product-qty').mask('PPPPPPPPPPPPPPPPPPPPP', {
                    'translation': {
                        P: {
                            pattern: /[0-9]/
                        }
                    }
                });
                $("input[name='product["+i+"][size]']").AddValueForSelect(listProduct[i].size);
                $("input[name='product["+i+"][name]']").val(listProduct[i].name);
                $("input[name='product["+i+"][qty]']").val(listProduct[i].qty);
                $("input[name='product["+i+"][price]']").val(listProduct[i].price);
            }

        }
    }
}();
$.fn.AddValueForSelect = function(val) {
   var $this = $(this);
   $this.find('option').removeAttr('selected')
   $this.find('option').each(function (argument) {
       if($(this).attr('value') == val){
        $(this).attr('selected','selected');
       }

   })
}
