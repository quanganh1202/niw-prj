"use strict";

let _ = require('lodash');
let chalk = require('chalk');
let pathJoin = require('path').join;
let nunjucks = require('nunjucks');
let viewEngine = require('../config/express/viewEngine/' + __config.site.templateEngine);
let app = require("../config/express");

class Render {
    constructor(layer, moduleName) {
        this.appLayer = Object.keys(__config.appLayer);
        this.ext = '.' + __config.viewEngine.nunjucks.settings.ext;
        if (layer) this.layer = layer.toString().toLowerCase();
        if (moduleName) this.moduleName = moduleName.toString().toLowerCase();
    }

    /**
     * Item within Array map new value
     * @param array [Array] - Base array
     * @param val [String] - Value extend into item in base array
     * @returns {*} String
     */
    static mapArray(array, val) {
        return array.map(function (i) {
            return val + i;
        })
    }

    /**
     * Using FileSystemLoader for load path view engine
     * @param views [Array] - Array path loader
     * @returns {*}
     */
    static systemLoader(views) {
        this.env = new nunjucks.Environment(new nunjucks.FileSystemLoader(views));
        return this.env;
    }

    /**
     * Using WebLoader for load path view engine
     * @param views [Array] - Array path loader
     * @returns {*}
     */
    static webLoader(views) {
        this.env = new nunjucks.Environment(new nunjucks.WebLoader(views));
        return this.env;
    }

    /**
     * Function support for render error page
     * @param req - Express `request`
     * @param res - Express `response`
     * @param view [Array] - Array path loader
     */
    render_error(req, res, view) {
        if (view.indexOf(this.ext) == -1) {
            view += this.ext;
        }

        for (let i in this.appLayer) {
            if (this.appLayer.hasOwnProperty(i)) {
                if (this.layer == this.appLayer[i]) {
                    this.env = Render.systemLoader([__base + __config.appLayer[this.appLayer[i]].loader[0]]);
                }
            }
        }

        viewEngine.require(this.env, __base + __config.viewEngine.nunjucks.customFilter);
        viewEngine.require(this.env, __base + __config.viewEngine.nunjucks.addGlobal);

        var obj = {};
        this.env.render(view, _.assign(obj, res.locals, {}), function (err, re) {
            if (err) {
                res.send(err.stack)
            } else {
                res.send(re);
            }
        })
    }

    /**
     * Main render function for modules
     * @param req - Express `request`
     * @param res - Express `response`
     * @param view - Name view render
     * @param options - [Object] Data showing view
     * @param fn
     */
    render(req, res, view, options, fn) {
        try {
            if (view.indexOf(this.ext) == -1) {
                view += this.ext;
            }
            for (let i in this.appLayer) {
                if (this.appLayer.hasOwnProperty(i)) {
                    if (this.layer == this.appLayer[i]) {
                        this.pathView = pathJoin(this.appLayer[i], __config.appLayer[this.appLayer[i]].pathView);
                        this.multiplePath = Render.mapArray(__config.appLayer[this.appLayer[i]].loader, __base);
                        this.env = Render.systemLoader(this.multiplePath);
                    }
                }
            }

            viewEngine.require(this.env, __base + __config.viewEngine.nunjucks.customFilter);
            viewEngine.require(this.env, __base + __config.viewEngine.nunjucks.addGlobal);

            if (this.moduleName) {
                if (this.moduleName.indexOf('/') == 0) {
                    view = pathJoin(this.moduleName.substring(1), this.pathView, view);
                } else if (this.moduleName.indexOf('./') == 0) {
                    view = pathJoin(this.moduleName.slice(2), this.pathView, view);
                } else {
                    view = pathJoin(this.moduleName, this.pathView, view);
                }
            }

            var obj = {};
            if (fn) {
                this.env.render(view, _.assign(obj, res.locals, options), fn);
            } else {
                this.env.render(view, _.assign(obj, res.locals, options), function (err, re) {
                    if (err) {
                        __.logger.error({
                            "File": 'Error: render_manager.js ',
                            "Messages": err.stack
                        });

                        req.flash('danger', `Error code: 401 - Phiên làm việc của bạn đã được ghi nhận để kiểm tra.<br>
                         Hệ thống đã ghi nhận và phản hồi tới bạn khi đã khắc phục.`);
                        res.redirect(`/${__config.admin_prefix}/dashboard`);
                        //res.send(err.stack);
                    } else {
                        res.send(re);
                    }
                })
            }
        } catch (e) {
            __.logger.error(e);
            req.flash('warning', 'Có lỗi xảy ra');
            res.redirect(`/${__config.admin_prefix}/dashboard`);
        }
    }
}

module.exports = Render;