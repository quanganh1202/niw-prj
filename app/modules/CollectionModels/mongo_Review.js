/**
 * Copyright(c) 2016 Yasu
 * Review Model
 *
 **/
 
"use strict";
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ReviewSchema   = new Schema({
    WhizzKidId : {type: String, require : true},
    UserId : {type: Schema.Types.ObjectId, ref: 'User'},
	TeacherId: {type: Schema.Types.ObjectId, ref: 'User'},
    Star : {type: Number},
    Content : {type: String},
    CreatedDate : {type: Number, default: Date.now}
});

module.exports = mongoose.model('Review', ReviewSchema);