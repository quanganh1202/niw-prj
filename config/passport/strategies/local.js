"use strict";

let LocalStrategy = require('passport-local').Strategy,
    randtoken = require('rand-token');

module.exports = function (passport) {

    passport.use('adminLogin', new LocalStrategy({
            usernameField: 'username',
            passwordField: 'password',
            passReqToCallback: true
        },
        function (req, username, password, done) {

            process.nextTick(function () {
                __models.User.findOne({'username': username}, function (err, user) {
                    if (err) {
                        return done(err);
                    }
                    console.log(user);
                    if (!user || !user.validPassword(password)) {
                        return done(null, false);
                    }
                    else {
                        let token = __.md5Hash(Date.now().toString());
                        let hashToken = require('password-hash').generate(token);
                        __models.User.findByIdAndUpdate(user.id, {
                            $set: {
                                hash_token: hashToken,
                                last_login_date: Date.now()
                            }
                        }).exec(function (err, re) {
                            if (err) __.logger(err, 'backend');
                        });

                        return done(null, user);
                    }
                });
            });
        })
    );

    passport.use('doctorLogin', new LocalStrategy({
            usernameField: 'email',
            passwordField: 'password',
            passReqToCallback: true
        },
        function (req, email, password, done) {
            process.nextTick(function () {
                __models.Doctor.findOne({'email': email}, function (err, user) {
                    if (err) {
                        return done(err);
                    }

                    if (!user || !user.validPassword(__.md5Hash(password))) {
                        return done(null, false);
                    }
                    else {
                        let token = __.md5Hash(Date.now().toString());
                        let hashToken = require('password-hash').generate(token);
                        __models.Doctor.findByIdAndUpdate(user.id, {
                            $set: {
                                token: hashToken,
                                last_login_date: Date.now()
                            }
                        }).exec(function (err, re) {
                            if (err) __.logger(err, 'frontend');
                        });

                        return done(null, user);
                    }
                });
            });
        })
    );
    /*
     htvu0917
     */

    passport.use('userLogin', new LocalStrategy({
            usernameField: 'email',
            passwordField: 'password',
            passReqToCallback: true
        },
        function (req, email, password, done) {
            process.nextTick(function () {
                __models.User.findOne({'email': email}, function (err, user) {
                    if (err) {
                        return done(err);
                    }

                    if (!user || !user.validPassword(__.md5Hash(password))) {
                        return done(null, false);
                    }
                    else {
                        let token = __.md5Hash(Date.now().toString());
                        let hashToken = require('password-hash').generate(token);
                        __models.User.findByIdAndUpdate(user.id, {
                            $set: {
                                token: hashToken,
                                last_login_date: Date.now()
                            }
                        }).exec(function (err, re) {
                            if (err) __.logger(err, 'frontend');
                        });

                        return done(null, user);
                    }
                });
            });
        })
    );


    passport.use('userSignUp', new LocalStrategy({
            usernameField: 'email',
            passwordField: 'password',
            passReqToCallback: true
        },
        function (req, email, password, done) {

            process.nextTick(function () {

                __models.User.findOne({'email': email}, function (err, exists) {
                    if (err) return done(err);

                    if (exists) return done(null, false);

                    else {
                        var newUser = new __models.User;
                        newUser.displayName = req.body.displayName;
                        newUser.email = email;
                        newUser.password = newUser.generateHash(password);
                        newUser.avatar = 'images/default.png';
                        newUser.role = 'user';
                        newUser.activeToken = randtoken.generate(60);
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