"use strict";

let _module = new __viewRender('frontend', 'routing'),
	async = require('async'),
    _ = require('underscore'), 
    datetime = require('../../../../../config/datetime'),
    fs = require('fs'),
    exec = require('child_process').exec,
    xml2js = require('xml2js'),
	parser = new xml2js.Parser();


_module.getRouting  = function(req, res) {
    __models.ShopRouting.find({_id : req.body.shop_routing_id}).populate('routings').populate('served_orders').populate('total_orders').exec(function(err, shopRouting) {
        var driver = [];
        for (var i = 0; i < shopRouting[0].routings.length; i++) {
        	driver[i] = shopRouting[i].routings[0].driver_id;
        }
        __models.Driver.find({_id: {$in : driver}}).exec(function(err, driver) {
        	console.log(driver);
        	res.json({
                code: 1,
                data: shopRouting,
                driver : driver
            })
        });
    	
    })
};

var generateInputData = function(req, callback) {
	if(!req.body.user_id) {
		var user_id = '572326627e284878410eca52';
	} else {
		var user_id = req.body.user_id;
	}
	var routing_date = req.body.routing_date;
	var current = datetime.getCurrentDateTimeByTimeZone();
	var filename = "input_" + user_id + "_" + current + ".vrp";
	var output_filename = "output_" + user_id + "_" + current + ".xml";
	var input_text = 'NAME: Route\n';
	var visits_section = 'NODE_COORD_SECTION\n';
	var demand_section = 'DEMAND_SECTION\n';
	var demand_section1 = '';
	var depot_section = 'DEPOT_SECTION\n';
	var vehicle_section = 'VEHICLES_SECTION\n';
	var eof = "EOF";
	var orders = [];
	var now = new Date(parseInt(routing_date));
	now.setHours(0, 0, 0, 0);
	var start = now.getTime();
	now.setHours(23, 59, 59, 999);
	var end = now.getTime();
	var orderIds = req.body.order_ids.split(',');
	var driverIds = req.body.driver_ids.split(',');
	

	Promise.all([
                 __models.User.find({_id : user_id}).exec(function (err, foundUser) {
                     if (!err) return foundUser;
                 }),
                 __models.Driver.find({_id : {$in : driverIds}}).populate("warehouse_id").exec(function (err, foundDriver) {
                     if (!err) return foundDriver;
                 }),
                 __models.Order.find({_id : {$in : orderIds}}).populate('warehouse_id').exec(function (err, foundOrder) {
                     if (!err) return foundOrder;
                 }),
                 __models.Warehouse.find({_id : req.body.warehouse_id}).exec(function (err, foundOrder) {
                     if (!err) return foundOrder;
                 }),
    ]).then(function (results) {
    	
		var deport_array = {};
		var foundUser = results[0];
		var foundOrders = results[2];
		var foundDrivers = results[1];

		var foundWarehouses = results[3];
		var serve_time = 5*60;
		var load_time = 5*60;
		var visits_section_warehouse = [];
		var number_of_store = 0;
		var number_of_orders = 0;
		var SOLVER_DIR_BALANCE = "public/routing-solver-balance";
		var SOLVER_DIR_INPUT = "/input/";
		var SOLVER_DIR_OUTPUT = "/output/";
		var SOLVER_FILENAME = "vroute_solver.jar";
		var BREAK_LINE = "\n";
		
		async.each(foundOrders, function(order, next) {
			if(visits_section_warehouse.indexOf(order.warehouse_id._id) == -1) {
				visits_section += order.warehouse_id._id + " " + order.warehouse_id.address.lat + " " + order.warehouse_id.address.lng + " " + order.warehouse_id._id + BREAK_LINE;	
				visits_section_warehouse.push(order.warehouse_id._id);
				number_of_store++;
			}
			_.each(foundWarehouses, function(w, i, list) {
				if(w._id.toString() == order.warehouse_id._id.toString()) {
					if(!deport_array.hasOwnProperty(w._id.toString())) {
						var deport_id = "DEPORT_" + (i + 1).toString();
						deport_array[w._id.toString()] = deport_id;
						depot_section += deport_id + " " + w._id + " " +  datetime.hoursMinutesToSeconds(w.start) + " " +  datetime.hoursMinutesToSeconds(w.end) + "\n";
					}
				}
			});
			visits_section += order._id + " " + order.address.lat + " " + order.address.lng + " " + order.order_id + BREAK_LINE;
			number_of_store++;
			if(order.warehouse_id.start) {
				var start_time_warehouse = datetime.hoursMinutesToSeconds(order.warehouse_id.start);

			} else {
				var start_time_warehouse = datetime.hoursMinutesToSeconds('08:00');

			}
			if(order.warehouse_id.end) {
				var end_time_warehouse = datetime.hoursMinutesToSeconds(order.warehouse_id.end);
			} else {
				var end_time_warehouse = datetime.hoursMinutesToSeconds('22:00');
			}
			var start_time = datetime.hoursMinutesToSeconds(order.delivery_time_start);
			var end_time = datetime.hoursMinutesToSeconds(order.delivery_time_end);
			var priority = order.priority ? order.priority : 0;
			number_of_orders++;
			var total_weight = 0;
			var total_volume = 0
			_.each(order.product, function(pro, i, list) {
				total_volume += parseInt(pro.v);
				total_weight += parseInt(pro.w);
			});
			
			demand_section1 += order._id + " " + order._id + " " + "-" + total_weight.toString() + " " + "-" + total_volume.toString() + " " + start_time.toString() + " " + end_time.toString() + " " + serve_time.toString() + " " + priority + BREAK_LINE;
			next();
		}, function(error) {
			var number_of_bikes = 0;
			var bike_section = '';
			var number_of_trucks = 0;
			var truck_section = '';
			_.each(foundDrivers, function(v, index, list) {
				if(!deport_array.hasOwnProperty(v.warehouse_id._id.toString())) {
					var deport_id = "DEPORT_" + (_.keys(deport_array).length + 1).toString();
					deport_array[v.warehouse_id._id.toString()] = deport_id;
					depot_section += deport_id + " " + v.warehouse_id._id + " " +  datetime.hoursMinutesToSeconds('08:00') + " " +  datetime.hoursMinutesToSeconds("22:00") + "\n";
				}
				var rest_start = datetime.hoursMinutesToSeconds("12:00");
				var rest_end = datetime.hoursMinutesToSeconds("13:00");
				var shift_start = datetime.hoursMinutesToSeconds("08:00");
				var currentTime = new Date();
				var current_start = datetime.hoursMinutesToSeconds(currentTime.getHours() + ":" + currentTime.getMinutes());
				
				// if(shift_start < current_start) {
				// 	shift_start = current_start;
				// }
				var shift_end = datetime.hoursMinutesToSeconds("22:00");
				var weight = v.weight ? v.weight.toString() : '200';
				var volume = v.volume ? v.volume.toString() : '200';
				if(v.vehicle == 1) {
					number_of_trucks++;
					truck_section += v._id + " " + deport_array[v.warehouse_id._id] + " " + weight + " " + volume +  " 35 25 400000 1000 " + shift_start + " " + shift_end + " " + rest_start + " " + rest_end + "\n";
				} else {
					number_of_bikes++;
					bike_section += v._id + " " + deport_array[v.warehouse_id._id] + " " + weight + " " + volume +  " 35 25 200000 300 " + shift_start + " " + shift_end + " " + rest_start + " " + rest_end + "\n";
				}
			});
			vehicle_section += "BIKE: " + number_of_bikes.toString() + "\n";
			vehicle_section += "TRUCK: " + number_of_trucks.toString() + "\n";
			if(number_of_bikes > 0) {
				vehicle_section += bike_section;	
			}
			
			if(number_of_trucks > 0) {
				vehicle_section += truck_section;	
			}
			input_text += "NUMBER_OF_STORES: " + number_of_store + '\n';
			input_text += "NUMBER_OF_ORDERS: " + number_of_orders + '\n';
			input_text += "NUMBER_OF_VEHICLES: " + foundDrivers.length + "\n";
			input_text += "NUMBER_OF_DEPOT: " + _.size(deport_array) + "\n";
			input_text += visits_section;
			input_text += demand_section;
			input_text += demand_section1;
			input_text += depot_section;
			input_text += vehicle_section;
			input_text += eof;
            var input_forder = '';
            
            input_forder = SOLVER_DIR_BALANCE;
            fs.writeFile(input_forder + SOLVER_DIR_INPUT + filename, input_text, function(error) {
			    if(error) {
			        callback(error);
			        return;
			    }
                var command = "cd " + input_forder + " && ";
			    command += "java -server -jar " + SOLVER_FILENAME + " ."+ SOLVER_DIR_INPUT + filename + " ." + SOLVER_DIR_OUTPUT + output_filename;
			    exec(command, {'maxBuffer' : 128 * 1024 * 1024}, function (error, stdout, stderr) {
				    callback(error, stdout, foundUser, foundDrivers, foundWarehouses, foundOrders, output_filename);
				});
			}); 
		});
    }).catch(function (error) {
        __.logger.error(error);
        _module.render_error(req, res, '500');
    });
};




_module.readOutputData = function(filename, foundUser, routing_date, foundDrivers, foundWarehouses, foundOrders, callback) {
	var SOLVER_DIR_BALANCE = "public/routing-solver-balance";
	var SOLVER_DIR_INPUT = "/input/";
	var SOLVER_DIR_OUTPUT = "/output/";
	var SOLVER_FILENAME = "vroute_solver.jar";
	var BREAK_LINE = "\n";
	var user_id = foundUser._id;
    var input_forder = SOLVER_DIR_BALANCE;
        
	filename = input_forder + SOLVER_DIR_OUTPUT + "/" + filename;
	fs.readFile(filename, function(error, data) {
		if(error) {
			return callback(error);
		}
	    parser.parseString(data, function (error, result) {
	    	if(error) {
	    		return callback(error);
	    	}
	    	var stores = {};
	    	var locationList = result.VrpTimeWindowedVehicleRoutingSolution.locationList[0].VrpRouteLocation;
	    	_.each(locationList, function(l, i, list) {
	    		stores[l['$'].id] = l.id[0];
	    	});
	    	var vehicleList = result.VrpTimeWindowedVehicleRoutingSolution.vehicleList[0].VrpVehicle;
	    	var numberOfNeedVehicle = result.VrpTimeWindowedVehicleRoutingSolution.numberOfNeedVehicle[0];
	    	var totalOrderServe = [];
	    	var totalWorkingTime = result.VrpTimeWindowedVehicleRoutingSolution.totalWorkingTime[0];
	    	var totalDistance = result.VrpTimeWindowedVehicleRoutingSolution.totalDistance[0];
	    	var routing_ids = [];
	    	if(vehicleList.length > 0) {
	    			async.eachSeries(vehicleList, function(v, next) {
	    				var routes = [];
			        	var vehicle_id = v.id[0];
			        	var driver = _.find(foundDrivers, function(d) {
			        		return d._id.toString() == vehicle_id;
			        	});
			        	console.log(driver.warehouse_id);
			        	var start_location = {
				    		name : driver.warehouse_id.name,
				    		address : driver.warehouse_id.address.title,
				    		location : {
				    			lat : driver.warehouse_id.address.lat,
				    			lng : driver.warehouse_id.address.lng
				    		},
				    		time : datetime.secondToHoursMinutes(parseInt(v.departDeportTime[0]))	
				    	};
				    	
				    	var end_location = {
				    		name : driver.warehouse_id.name,
				    		address : driver.warehouse_id.address.title,
				    		location : {
				    			lat : driver.warehouse_id.address.lat,
				    			lng : driver.warehouse_id.address.lng
				    		},
				    		time : datetime.secondToHoursMinutes(parseInt(v.returnDeportTime[0]))
				    	};
				    	var current_location = {
				    		name : driver.warehouse_id.name,
				    		address : driver.warehouse_id.address,
				    		location : {
				    			lat : driver.warehouse_id.location.lat,
				    			lng : driver.warehouse_id.location.lng
				    		}
				    	};
			        	var expected_working_time = Math.round(parseInt(v.workingTime[0]/(1000*60)));
			        	var start = {
			        		store : null,
			        		order : null,
			        		other_location : start_location
			        	};
			        	routes.push(start);
			        	if(v.nextCustomer) {
			        		_module.readNextCustomer(routes, v.nextCustomer[0], stores, foundWarehouses, totalOrderServe, function() {
			        			if(routes.length > 0) {
			        				var end = {
			        					store : null,
						        		order : null,
						        		other_location : end_location
			        				};
			        				routes.push(end);
			        				if(vehicle_id.indexOf("ADD_VEHICLE_") > -1) {
			        					routes.splice(0,1);
			        					vehicle_id = vehicle_id.substring("ADD_VEHICLE_".length, vehicle_id.length);
			        					__models.Route.findOneAndUpdate({
			        						user_id : user_id,
			        						driver_id : vehicle_id,
			        						routing_date : routing_date,
			        						is_removed : false
			        					}, {
			        						$pushAll : {stores : routes},
			        						$inc : {expected_working_time : expected_working_time},
			        						end : end_location
			        					}, function(error, updatedRoute) {
			        						console.log('284');
			        						console.log(error);
			        						next(error);
			        					});
			        				} else {
			        					console.log(start_location);
			        					var route = new __models.Route({
				        					user_id : user_id,
						        			driver_id : vehicle_id,
						        			stores : routes,
						        			routing_date : routing_date,
						        			start : start_location,
						        			end : end_location,
						        			current_location : current_location,
						        			expected_working_time : expected_working_time
				        				});
				        				route.save(function(error) {
				        					routing_ids.push(route._id);
				        					console.log('301');
				        					console.log(error);
				        					next(error);
				        				});
			        				}
					        	} else {
					        		next();
					        	}
			        		});
			        	} else {
			        		next();
			        	}
			        }, function(error) {
			        	if(error) {
			        		console.log('312');
			        		console.log(error);
			        		return callback(error);
			        	}
			        	var newShopRouting = new __models.ShopRouting({
			        		user_id : user_id,
			        		routings : routing_ids,
			        		routing_date : routing_date,
			        		need_vehicles : numberOfNeedVehicle,
			        		served_orders : totalOrderServe,
			        		total_orders : foundOrders,
			        		total_working_time : parseFloat(totalWorkingTime)/60000,
			        		total_distance : parseFloat(totalDistance)/1000000
			        	});
			        	newShopRouting.save(function(error) {
			        		__models.Route.update({
			        			_id : {$in : routing_ids}
			        		}, {
			        			shop_routing_id : newShopRouting._id,
			        			updated_date : Date.now()
			        		}, {
			        			multi : true
			        		}, function(error) {
			        			console.log('335'); 
			        			console.log(error);
			        			callback(error, newShopRouting);
			        		});
			        	});
			        });
	    	} else {
	    		callback("error");
	    	}
	    });
	});
}

_module.readNextCustomer = function(routes, nextCustomer, stores, foundWarehouses, totalOrderServe, callback) {
	var store_id = stores[nextCustomer.location[0]['$'].reference];
	var deliver_time = datetime.secondToHoursMinutes(parseInt(nextCustomer.arrivalTime[0]));
	var depart_time = datetime.secondToHoursMinutes(parseInt(nextCustomer.departTime[0]));
	var order_id = nextCustomer.id[0];
	
	if(order_id.indexOf("DEPOT_CUSTOMER") != -1) {
		var warehouse = _.find(foundWarehouses, function(w) {
			return w._id.toString() == store_id;
		});
		var location = {
			store : null,
    		order : null,
    		other_location : {
    			name : warehouse.name,
	    		address : warehouse.address,
	    		time : deliver_time,
	    		depart_time : depart_time,
	    		location : {
	    			lat : warehouse.location.lat,
	    			lng : warehouse.location.lng
	    		}
    		}
    		
		};
		routes.push(location);
		if(nextCustomer.nextCustomer) {
			_module.readNextCustomer(routes, nextCustomer.nextCustomer[0], stores, foundWarehouses, totalOrderServe, callback);
		} else {
			callback();
		}
	} else {
		__models.Order.findByIdAndUpdate(order_id, {
			deliver_time : depart_time,
			updated_date : Date.now()
		}, function(error, updatedOrder) {
			routes.push({store : store_id, order : order_id, deliver_time: deliver_time, other_location : {}});
			totalOrderServe.push(updatedOrder._id);
			if(nextCustomer.nextCustomer) {
				_module.readNextCustomer(routes, nextCustomer.nextCustomer[0], stores, foundWarehouses, totalOrderServe, callback);
			} else {
				callback(error);
			}
		});
	}
}


_module.optimize = function(req, res) {
	generateInputData(req, function(error, result, foundUser, foundDrivers, foundWarehouses, foundOrders, output_filename) {
		if(error || result !== "!Route Optimization Finish!") {
					//res.status(500);
			res.json({
				"code" : 0,
				"message" :'Optimze success',
				"details" : error
			});
			return;
		}
		console.log("pass input");
		_module.readOutputData(output_filename, foundUser, req.body.routing_date, foundDrivers, foundWarehouses, foundOrders, function(error, result) {

			if(error) {
				res.json({
					"code" : 0,
					"message" : '',
					"details" : error
				});
				return;
			}
			res.json({
				"code" : 0,
				"data" : result
			});
		});
	});
}

module.exports = _module;
