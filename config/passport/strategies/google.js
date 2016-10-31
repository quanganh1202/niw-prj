"use strict";

let GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

module.exports = function(passport) {
    passport.use(new GoogleStrategy({
            clientID: __config.googleAuth.clientID,
            clientSecret: __config.googleAuth.clientSecret,
            callbackURL: __config.googleAuth.callbackURL,
            passReqToCallback: true
        },
        function (req, token, refreshToken, profile, done) {
            process.nextTick(function () {
                User.findOne({'email': profile.emails[0].value}, function (err, user) {
                    if (err) {
                        return done(err);
                    }

                    if (user) {
                        return done(null, user);
                    }
                    else {
                        var newUser = new User();
                        newUser.displayName = profile.displayName;
                        newUser.email = profile.emails[0].value;
                        newUser.avatar = 'images/default.png';
                        newUser.role = 'user';
                        newUser.status = 1;
                        newUser.save(function (err) {
                            if (err) {
                                throw err;
                            }
                            return done(null, newUser);
                        });
                    }
                });
            });
        })
    );
};