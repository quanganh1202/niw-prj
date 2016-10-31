"use strict";

let _ = require('lodash');
let sortedObject = require('sorted-object');

// Load configurations application and apply ignore pattern name directory
let getConfigInstance = __.getDirectories(__base + 'config', ['env', 'passport', 'express']);

// fucking faster coding happy
module.exports = sortedObject(
    _.extend(
        require(getConfigInstance[0]),
        require(getConfigInstance[1]),
        require(getConfigInstance[2]),
        require('./env/' + process.env.NODE_ENV) || {}
    )
);