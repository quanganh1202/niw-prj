"use strict";

let nunjucks = require('nunjucks');


/**
 * Nunjucks template engine settings and function support
 */
class Nunjucks {

    /**
     * Constructor, application extend Express framework
     * @param app - app Express
     */
    constructor(app) {
        this.app = app;
    }
    /**
     * Custom settings nunjucks template engine
     * @param setting [Object] - Nunjucks configure settings
     * @param opts [Object] - Nunjucks options setting for custom filter loader, show configure.
     */
    configure(setting, opts) {
        if (!setting) setting = {};
        let config = __config.viewEngine.nunjucks;
        this.app.set('view engine', config.settings.ext);

        let env = nunjucks.configure(setting.path, {
            express: this.app,
            autoescape: setting.autoescape || true, // default
            trimBlocks: setting.trimBlocks || true,
            lstripBlocks: setting.lstripBlocks || true,
            dev: setting.dev || false,
            noCache: setting.noCache || false, // default
            watch: setting.watch || false // default
        });

        if (opts) {
            if (opts.showConfigure) Nunjucks.showConfigure(env);
            opts.filter ? Nunjucks.require(env, opts.filter) : Nunjucks.require(env, __base + config.customFilter);
            opts.addGlobal ? Nunjucks.require(env, opts.addGlobal) : Nunjucks.require(env, __base + config.addGlobal);
        }

        return env;
    }

    /**
     * Show configuration nunjucks path loader.
     * @param env - Environment nunjucks for apply settings
     */
    static showConfigure(env) {
        if (env.hasOwnProperty('loaders')) {
            let pathDefault = env.loaders[0].searchPaths;
            if (pathDefault == '.') pathDefault = 'None';
            __.logger.info(`[App] Nunjucks setting view loader: ${pathDefault}`);
        }
    }

    /**
     * Require method support for add custom filter and add global variable
     * @param env - Environment nunjucks for apply settings
     * @param pattern - Path custom filter loader, use pattern glob module
     * @returns {*} - Environment after custom filter or add global variable apply.
     */
    static require(env, pattern) {
        __.getGlobbedFiles(pattern).forEach(function (path) {
            require(path)(env);
        });
        return env;
    }
}

module.exports = Nunjucks;