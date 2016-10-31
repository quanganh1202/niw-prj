"use strict";

module.exports = {
    system: {
        pagination: 20
    },
    viewEngine: {
        nunjucks: {
            settings: {
                ext: 'html',
                autoescape: true,
                noCache: true
            },
            customFilter: "app/custom_filters/**/*.js",
            addGlobal: "app/addGlobal/*.js",
            async: false
        },
        handlebars: {},
        jade: {}
    }
};