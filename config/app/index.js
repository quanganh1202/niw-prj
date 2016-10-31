"use strict";

module.exports = {
    app: {
        name: 'Yasu',
        copyright: 'Yahu@2016',
        favicon: "/partial/favicon.ico",
        logo: "AA.png",
        title: "Yahu - Content Management",
        description: "Yasu",
        keywords: "Yasu",
        language: "vi_VN"
    },
    env: {
        development: "development",
        production: "production",
        test: "test"
    },
    admin_prefix: "admin",
    site: {
        port: process.env.PORT || 1337,
        templateEngine: 'nunjucks',
        theme: {
            name: "bootstrap", //* path and theme name common for multiple layer
            path: "themes"
        },
        image_server: 'http://localhost/yasu/',
        password403: '123456'
    },
    appLayer: {
        frontend: {
            pathView: 'views',

            /**
             * Render_manager use array[0] for loader path error 404, 500 and more.
             * You can fix fix it but note the caption up.
             * Ex: backend.loader[0]
             */
            loader: [
                "themes/frontend/",
                "app/modules/"
            ]
        },
        backend: {
            pathView: 'views',
            loader: [
                "themes/backend/",
                "app/modules/"
            ]
        },
        api: {
            loader: [
                "app/modules/"
            ]
        }
    },
    validate: {
        username: /^[a-z0-9_-]+$/ig,
        alias: /[+_.,!@#$%^&*();\/|<>"'\\ ]/g,
        displayName: /[+.,!@#$%^&*();\/|<>"'\\]/g,
        phone: /^\d{9,11}$/ig
    }
};
