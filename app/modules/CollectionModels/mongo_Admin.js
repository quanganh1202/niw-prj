/**
 * Copyright(c) 2016 Yasu
 * Admin Model
 *
 **/
 
"use strict";
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var AdminSchema   = new Schema({
	WhizzKidId : {type: String, require : true},
    Email: {type: String, require : true},
    Password: {type: String, require : true},
    Fullname: {type: String, require : true},
    CreatedDate : {type: Number, default: Date.now},
    UpdatedDate : {type: Number, default: Date.now}
});

module.exports = mongoose.model('Admin', AdminSchema);