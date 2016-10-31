"use strict";

let helmet = require('helmet');

// Use helmet to security web application, xss vulnerability,..
exports.secure = function (app) {
    app.use(helmet.xframe());
    app.use(helmet.xssFilter());
    app.use(helmet.noSniff());
    app.use(helmet.ieNoOpen());
    app.enable("trust proxy");
    app.set("trust proxy", true);
    app.use(helmet.hidePoweredBy({setTo: "PHP 4.2.0"}));
    //app.disable("x-powered-by");
};