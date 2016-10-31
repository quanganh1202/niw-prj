"use strict";

module.exports = function (env) {
    env.addGlobal('siteConfig', __config.app);
    env.addGlobal('themeName', __config.site.theme.name);
    env.addGlobal('admin_prefix', __config.admin_prefix);
    return env;
};