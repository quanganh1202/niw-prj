/**
 * Copyright(c) 2016 Yasu
 * User Model
 *
 **/
 
"use strict";
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema   = new Schema({
    WhizzKidId : {type: String, require : true},
	FirstName: {type: String},
    MiddleName: {type: String},
    LastName: {type: String},
    Avatar: {type: String},
    DateOfBirth: {type: String},
    UserName: {type: String},
    UserType: {
        Payer : {type: Boolean},
        Student : {type: Boolean},
        Teacher : {type: Boolean}
    },
    Password: {type: String, require : true},
    ContactDetails: {
        Address: {
            Lines: [{type: String}],
            TownCity: {type: String},
            RegionState: {type: String},
            PostCode: {type: String},
            Country: {type: String}
        },
        Phone: {
            CountryCode: {type: String},
            AreaCityCode: {type: String},
            LandLineNumber: {type: String},
            MobileNumber: {type: String}
        },
        Email: {type: String}
    },
    Languages: [{type: String}],
    Payment: { type: Schema.Types.ObjectId, ref: 'PaymentDetails'},
    CreatedDate : {type: Number, default: Date.now},
    UpdatedDate : {type: Number, default: Date.now}
});

module.exports = mongoose.model('User', UserSchema);