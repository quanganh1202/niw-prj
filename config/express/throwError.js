"use strict";

exports.configure = function (app) {

    /**
     * Error 404 handler function
     */
    app.use(function (req, res, next) {
        let layer = res.locals.route.substr(0, __config.admin_prefix.length + 2) === `/${__config.admin_prefix}/` ? 'backend' : 'frontend';
        let env = new __viewRender(layer);
        env.render_error(req, res, '404', {
            url: req.originalUrl
        });
        next();
    });

    /**
     * Error 500 handler function
     */
    app.use(function (err, req, res, next) {
        let layer = res.locals.route.substr(0, __config.admin_prefix.length + 2) === `/${__config.admin_prefix}/` ? 'backend' : 'frontend';
        // If the error object doesn't exists
        if (!err) return next();

        __.logger.error(err);
        if (process.env.NODE_ENV == __config.env.development) __.logger.error(err.stack);

        let env = new __viewRender(layer);
        env.render_error(req, res, '500');
        next();
    });
};
