/**
 * Copyright(c) 2016 Yasu
 * SystemSettings Model
 *
 **/
 
"use strict";
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var SystemSettingsSchema   = new Schema({
	WhizzKidId : {type: String, require : true},
    Key: {type: String, require : true},
    Value: {type: String, require : true}
});

module.exports = mongoose.model('SystemSettings', SystemSettingsSchema);