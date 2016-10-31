"use strict";
var moment = require('moment-timezone');
var default_timezone = 'Asia/Ho_Chi_Minh';

exports.getFilterId = function (query, field) {
    var index = query.sColumns.split(",").indexOf(field);
    return query["sSearch_" + index];
};

exports.getDateTime = function (time, format) {
    return moment(time).format(format);

};
