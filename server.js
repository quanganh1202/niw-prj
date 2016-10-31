"use strict";

global.__base = __dirname + require('path').sep;
let lifeParser = require("./app/lifeparser");

/**
 * Init application
 */
let app = new lifeParser();

/**
 * Application running on port and options show configure
 */
app.start(1337, {
    showConfigure: true
});

/**
 * Expose app
 */
module.exports = app;