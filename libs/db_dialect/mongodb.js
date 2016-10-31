"use strict";

let mongoose = require('mongoose');
let db = {};

var extendServer = '/';
if (__config.db.options.replset) extendServer = `,${__config.db.secondary}/`;

let mongoUri = `${__config.db.dialect}://${__config.db.host}${extendServer}${__config.db.database}`;

var options = {
    db: {native_parser: true},
    server: {
        socketOptions: {keepAlive: 1},
        poolSize: 5
    },
    auth: {
        authdb: 'admin'
    },
    replset: {
        rs_name: "uDoctor",
        socketOptions: {keepAlive: 1}
    }
};

if (__config.db.options.auth) {
    options.user = __config.db.username;
    options.pass = __config.db.password
}

mongoose.connect(mongoUri, options);
mongoose.connection.on('error', function (err) {
    if (err) throw err;
});

mongoose.set('debug', __config.db.options.logging);

db.collections = [];
__.getGlobbedFiles(__base + 'app/modules/CollectionModels/mongo_*.js').forEach(function (modelPath) {
    let model = require(modelPath);
    db[model.modelName] = model;
    db.collections.push(model.modelName);
});

__.logger.info(`[Success] Load all the models.\n`);

module.exports = db;