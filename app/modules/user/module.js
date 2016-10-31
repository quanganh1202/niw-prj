"use strict";

module.exports = function (module) {
    module.user = {
        title: 'Admin',
        author: 'MinhT',
        version: '0.0.1',
        system: true,
        description: 'Admin',
        group: 2,
        backend_menu: {
            title: 'Admin',
            icon: 'fa fa-dashboard',
            link: `/${__config.admin_prefix}/user`
        }
    };
    return module;
};