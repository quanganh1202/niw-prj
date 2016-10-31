/**
 * Copyright(c) 2016 Yasu
 * Session Model
 *
 **/
 
"use strict";
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var SessionSchema   = new Schema({
    WhizzKidId : {type: String, require : true},
    UserId : {type: Schema.Types.ObjectId, ref: 'User'},
	TeacherId: {type: Schema.Types.ObjectId, ref: 'User'},
    Status : {type: String, enum: ['Completed', 'Scheduled', 'Canceled', 'Request']},
    Subjects : [{type: Schema.Types.ObjectId, ref: 'Subject'}],
    SubjectDetail : {type: String},
    Languages: [{type: String}],
    SessionDetails: {
        From: {type: Number},
        To: {type: Number},
        Start: {type: Number},
        End: {type: Number},
        Video: {type: Schema.Types.ObjectId, ref: 'Resource'},
        Whiteboard:{type: Schema.Types.ObjectId, ref: 'Resource'},
    },
    Cost:{
        PricePerHour: {type: Number},
        Currency: {type: String},
    },
    CreatedDate : {type: Number, default: Date.now},
    UpdatedDate : {type: Number, default: Date.now}
});

module.exports = mongoose.model('Session', SessionSchema);