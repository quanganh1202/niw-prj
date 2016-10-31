/**
 * Copyright(c) 2016 Yasu
 * PaymentDetails Model
 *
 **/

"use strict";
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var PaymentDetailsSchema   = new Schema({
	WhizzKidId : {type: String, require : true},
	UserId : {type: Schema.Types.ObjectId, ref: 'User'},
	CreatedDate : {type: Number, default: Date.now},
    UpdatedDate : {type: Number, default: Date.now}
});

module.exports = mongoose.model('PaymentDetails', PaymentDetailsSchema);