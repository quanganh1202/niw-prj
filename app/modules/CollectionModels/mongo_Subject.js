/**
 * Copyright(c) 2016 Yasu
 * Subject Model
 *
 **/
 
"use strict";
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var SubjectSchema   = new Schema({
	WhizzKidId : {type: String, require : true},
	Name : {type: String, require : true},
	Description: {type: String},
	CreatedDate : {type: Number, default: Date.now},
    UpdatedDate : {type: Number, default: Date.now}
});

module.exports = mongoose.model('Subject', SubjectSchema);