"use strict";

let FacebookStrategy = require('passport-facebook').Strategy;


module.exports = function (passport) {
    passport.use(new FacebookStrategy({
            clientID: __config.facebookAuth.clientID,
            clientSecret: __config.facebookAuth.clientSecret,
            callbackURL: __config.facebookAuth.callbackURL,
            passReqToCallback: true,
            profileFields: ['id', 'displayName', 'photos', 'emails', 'first_name', 'last_name']

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
                        // if there is no user, create them
                        var newUser = new User();
                        newUser.displayName = profile.displayName;
                        newUser.email = profile.emails[0].value;
                        newUser.avatar = profile.photos[0].value;
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