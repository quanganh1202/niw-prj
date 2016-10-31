'use strict';

module.exports = function () {
    let data = {};

    __.getGlobbedFiles(__base + '/lang/*.js').forEach(function (file) {
        data[require('path').basename(file, '.js')] = require(file);
    });

    return data;
};