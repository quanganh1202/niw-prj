"use strict";

let _module = new __viewRender('frontend', 'home');
_module.warehouse = function(req, res) {
    __models.Warehouse.find()
        .exec(function(err, foundWarehouse) {
            if (err) {
                res.json({
                    code: -1,
                    error: err
                })
            } else if (!foundWarehouse.length) {
                res.json({
                    code: 0,
                    error: "No Data !"
                })
            } else {
                res.json({
                    code: 1,
                    data: foundWarehouse
                })
            }
        });
};

_module.findCustomer = function(req, res) {
    __models.Customer.find({
        phone: req.query.phone
    }).exec(function(err, CustomerData) {
        res.json({
            code: 1,
            data: CustomerData
        })
    })
};

_module.getDriver = function(req, res) {
    __models.Driver.find({
        _id: req.body.driver_id
    }).exec(function(err, driver) {
        res.json({
            code: 1,
            data: driver
        })
    })
};

_module.listOrder = function(req, res) {
    __models.Order.find(req.body).populate('customer_id').populate('warehouse_id').exec(function(err, OrderData) {
        res.json({
            code: 1,
            data: OrderData
        })
    })
};
_module.delOrder = function(req, res) {
    __models.Order.remove(req.body).exec(function(err) {
        if (err) {
            res.json({
                code: -1,
                error: err
            })
        } else {
            res.json({
                code: 1,
                data: req.body
            })
        }
    })
};

_module.listDriver  = function(req, res) {
    __models.Driver.find(req.body).populate('warehouse_id').exec(function(err, drivers) {
        res.json({
            code: 1,
            data: drivers
        })
    })
};



_module.addNewOrder = function(req, res) {
    if(req.body._id == ''){
        delete req.body._id; 
    }
    req.body.delivery_date = new Date(req.body.delivery_date).getTime()
    __models.Customer.findOne({
        phone: req.body.phone
    }).exec(function(err, CustomerData) {
        if (err) {
            res.json({
                code: -1,
                error: err
            })
        } else {
            if (CustomerData != null) {
                //insert order
                req.body.customer_id = CustomerData._id;
                var newOrder = new __models.Order(req.body);
                newOrder.save(function(err, _newOrder) {
                    if (err) {
                        res.json({
                            code: -1,
                            error: err
                        })
                    } else {
                        res.json({
                            code: 1,
                            data: _newOrder
                        })
                    }
                });
            } else {
                //insert new customer
                var newCustomer = new __models.Customer(req.body);
                newCustomer.save(function(err) {
                    if (err) {
                        res.json({
                            code: -1,
                            error: err
                        })
                    } else {
                        req.body.customer_id = newCustomer._id;
                        var newOrder = new __models.Order(req.body);
                        newOrder.save(function(err, _newOrder) {
                            if (err) {
                                res.json({
                                    code: -1,
                                    error: err
                                })
                            } else {
                                res.json({
                                    code: 1,
                                    data: _newOrder
                                })
                            }
                        });
                    }
                });
            }
        }
    });
};
module.exports = _module;
