"use strict";

let flash = require('connect-flash');

exports.configure = function(app) {
    app.use(flash());
    app.use(function (req, res, next) {
        res.locals.messages = req.session.flash;
        delete req.session.flash;
        next();
    });
};