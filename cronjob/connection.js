"use strict";

// Nặn em đi anh iêu :|
global.__base = `${require('path').resolve(__dirname, '..')}/`;
const mongoose = require('mongoose'),
    db = {},
    mongoUri = 'mongodb://123.30.59.28:27017,123.30.59.49:27017/uDoctor-production',
    __ = require('../libs/global_function');

// Anh muốn làm chìa khóa như thế nào?
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
    },
    user: "root",
    pass: "nova@365"
};
// Nhét chìa khóa của anh vào em đi anh :3
mongoose.connect(mongoUri, options);

// Chìa khóa của anh không khớp roài :((.
mongoose.connection.on('error', function (err) {
    if (err) throw err;
});

// Xem hàng em kỹ vào nhé.
mongoose.set('debug', false);

// Mình quyết tâm sinh con anh nhé.
__.getGlobbedFiles(`${require('path').resolve(__dirname,'..')}/app/modules/CollectionModels/mongo*.js`).forEach(function (modelPath) {

    // Anh muốn nuôi hết bọn nó à?
    // Không lẽ em định đẻ ra đó rồi cho cho người khác nuôi hả! :((
    let model = require(modelPath);
    db[model.modelName] = model;

});

module.exports = db;
