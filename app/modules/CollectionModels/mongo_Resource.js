/**
 * Copyright(c) 2016 Yasu
 * Resource Model
 *
 **/
 
"use strict";
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ResourceSchema   = new Schema({
	WhizzKidId : {type: String, require : true},
	UserId : {type: Schema.Types.ObjectId, ref: 'User'},
	Type: {type: String, enum: ['Video', 'Whiteboard']},
	Path : {type: String},
	CreatedDate : {type: Number, default: Date.now},
    UpdatedDate : {type: Number, default: Date.now}
});

module.exports = mongoose.model('Resource', ResourceSchema);