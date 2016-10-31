"use strict";

module.exports = {
    db: {
        //host: '107.155.95.215:27017',
		//host: 'localhost:27017',
		host: '125.212.207.183:27017',
        database: 'rourou',
        dialect: 'mongodb',
        options: {
            logging: false,
            replset: false,
            auth: false
        }
        
    },
    redis: {
        auth: {
            host: 'localhost',
            port: '6379'
        },
        prefix_acl: 'acl_',
        prefix_menu: 'menu_',
        prefix_session: '100dayproject:',
        prefix_config: {
            name: 'config:',
            systemProtected: '_Protected'
        }
    },
    facebookAuth: {
        clientID: process.env.FACEBOOK_ID || '429763933888491',
        clientSecret: process.env.FACEBOOK_SECRET || 'c567934b2f135384a9f3f74e06a40048',
        callbackURL: process.env.FACEBOOK_URL || 'http://localhost:1337/auth/facebook/callback'
    },
    googleAuth: {
        clientID: process.env.GOOGLE_ID || '',
        clientSecret: process.env.GOOGLE_SECRET || '',
        callbackURL: process.env.GOOGLE_URL || ''
    }
};