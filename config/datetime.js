var moment = require('moment-timezone');
var default_timezone = 'Asia/Ho_Chi_Minh';

exports.getCurrentDateTimeByTimeZone = function (timezone) {
  if (timezone == null || timezone == '') {
    timezone = default_timezone;
  }
  var time = moment(Date.now()).tz(timezone).format("YYYY-MM-DDTHH-mm-ss-SSS");
  return time;
};

exports.getDateTimeByFormat = function (time, format) {
  var time = moment(time).format(format);
  return time;
};

exports.getCurrentDateTimeByFormatAndTimeZone = function (time,timezone) {
  if (timezone == null || timezone == '') {
    timezone = default_timezone;
  }
  var time = moment(time).tz(timezone).format("YYYY-MM-DDTHH:mm:ss.SSS");
  return time;
};

exports.getDateTimeByFormatAndTimeZone = function (time,timezone,format) {
  if (timezone == null || timezone == '') {
    timezone = default_timezone;
  }
  var d = new Date(time);
  return moment(d).tz(timezone).format(format);
};

exports.secondToHoursMinutes = function(second) {
  second = second/1000;
  var hours = parseInt( second / 3600) % 24;
  var minutes = parseInt( second / 60) % 60;
  return (hours < 10 ? "0" + hours : hours) + ":" + (minutes < 10 ? "0" + minutes : minutes);
}

exports.hoursMinutesToSeconds = function(hours) {
  hours = hours.split(':');
  return (parseInt(hours[0]) * 60 + parseInt(hours[1])) * 60;
}