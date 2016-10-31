"use strict";

let passport = require('passport');


exports.configure = function (app) {
    app.use(passport.initialize());
    app.use(passport.session());

    // Using for create session
    passport.serializeUser(function (user, done) {
        return done(null, user.id);
    });

    // Using for destroy session
    passport.deserializeUser(function (id, done) {

        __models.User.findById(id, function (err, user) {
            if (user)
                return done(err, user);
        });
    });

    require('./strategies/local')(passport);
    require('./strategies/facebook')(passport);
};