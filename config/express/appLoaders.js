"use strict";

let sep = require('path').sep;

exports.routeLoader = function (app) {
    let layer = Object.keys(__config.appLayer);
    __.logger.info(`[Router loader] use ${layer.join(' & ')} router.\n`);
    let corePath = __base + ['app', 'modules', 'core_route'].join(sep);

    let moduleIgnore = '' || '*';

    let frontendPath = __base + ['app', 'modules', moduleIgnore, 'frontend', 'route.js'].join(sep);
    let backendPath = __base + ['app', 'modules', moduleIgnore, 'backend', 'route.js'].join(sep);
    let apiPath = __base + ['app', 'modules', moduleIgnore, 'api', 'route.js'].join(sep);

    /**
     * Core routing loader
     */
    require(corePath)(app);

    /**
     * Frontend routing loader
     */
    __.getGlobbedFiles(frontendPath).forEach(function (routePath) {
        require(routePath)(app);
    });

    /**
     * Backend routing loader, route protection name prefix for security
     * between frontend and backend difference
     */
    __.getGlobbedFiles(backendPath).forEach(function (routePath) {
        app.use('/' + __config.admin_prefix, require(routePath));
    });

    /**
     * Api routing loader, route protection name prefix for security
     * between frontend and backend difference
     */
    __.getGlobbedFiles(apiPath).forEach(function (routePath) {
        app.use('/api', require(routePath));
    });
};