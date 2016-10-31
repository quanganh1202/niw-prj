"use strict";

module.exports = function (env) {
    env.addFilter('check_avatar', function (imgPath) {
        if (imgPath) {
            if (imgPath.split('facebook').length > 1) return imgPath;
            return __config.site.image_server + imgPath;
        } else {
            return '/partial/images/noAvatar.gif';
        }
    })
};