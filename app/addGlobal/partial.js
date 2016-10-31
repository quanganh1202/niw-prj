"use strict";

module.exports = function (env) {
    env.addGlobal('imageServer', __config.site.image_server);
    return env;
};