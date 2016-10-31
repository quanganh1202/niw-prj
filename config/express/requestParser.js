"use strict";

let bodyParser = require('body-parser'),
    methodOverride = require('method-override'),
    cookieParser = require('cookie-parser');
let session = require('express-session'),
    RedisStore = require('connect-redis')(session);

// Request body parsing middleware should be above methodOverride
exports.configure = function (app) {
    app.use(bodyParser.urlencoded({
        extended: true,
        limit: '5mb'
    }));

    app.use(bodyParser.json({limit: "5mb"}));
    app.use(methodOverride());

    // CookieParser should be above session
    app.use(cookieParser());

    app.use(session({
        store: new RedisStore({
            host: __config.redis.host,
            port: __config.redis.port,
            prefix: __config.redis.prefix_session
        }),
        saveUninitialized: true,
        resave: true, // don't save session if unmodified
        secret: '100dayproject.org',
        key: '100dayproject'
    }));
};