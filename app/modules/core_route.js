"use strict";

let redisClient = require('redis').createClient(__config.redis.auth),
    acl = require('acl'),
    passport = require('passport'),
    loginModule = new __viewRender('frontend', 'login');

module.exports = function (app) {

    acl = new acl(new acl.redisBackend(redisClient, __config.redis.acl_prefix));


    app.route(`/login`).get(function (req, res) {
        if (!req.isAuthenticated() || !req.user) {
           loginModule.render(req, res, 'login')
       } else {
            return res.redirect(`/`);
       }
    }).post(passport.authenticate('adminLogin', {
        failureRedirect: `/login`,
        failureFlash: 'Tài khoản hoặc mật khẩu không đúng!',
        successRedirect: `/`
    }));

    app.get('*', function (req, res, next) {
        res.locals.user = req.user || null;

        __redis.get(__config.redis.prefix_config.name + __config.redis.prefix_config.systemProtected, function (err, re) {
            if (err) __.logger.error(err);
            res.locals.protected = re;
        });

        res.locals.currentURI = res.locals.url;
        next();
    });

    app.use(`/(*)`, function (req, res, next) {
    	if(req.originalUrl.indexOf('/api/') != -1) {
            return next();
        }
        
        if (!req.isAuthenticated() || !req.user) {
    	   if(req.originalUrl == '/get-dispatching') {
    		   
    	   } else {
               return res.redirect(`/login`);
    	   }
        }
        next();
    });

    app.route('/signout').get(function(req, res) {
        req.logout();
        req.session.destroy();
        res.redirect(`/login`);
    });
};
