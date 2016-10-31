"use strict";

let Sequelize = require('sequelize');
let chalk = require('chalk');

let sequelize = new Sequelize(__config.db.database, __config.db.username, __config.db.password, __config.db);
let db = {};
let error = false;

console.log(chalk.cyan('Initialization Sequelize loader models.'));

// pattern ignore 'mongo' models
__.getGlobbedFiles(__base + 'app/modules/*/models/!(mongo*.js)').forEach(function (modelPath) {
    try {
        let model = sequelize['import'](modelPath);
        db[model.name] = model;
        console.log(chalk.yellow('[*] ' + modelPath));
    } catch (e) {
        error = true;
        if (e instanceof TypeError) {
            console.log(chalk.red('Error module:', chalk.bgRed.white.bold(modelPath.split('/')[modelPath.split('/').length - 3]), 'not defined or models unvalidated!'));
        }
        else {
            console.log(e.stack);
        }
    }
});
if (error) {
    console.log(chalk.bgRed.bold('\nSequelize ORM cash loader models.'));
    process.exit();
}

Object.keys(db).forEach(function (modelName) {
    if (db[modelName].associate) {
        db[modelName].associate(db);
    }
});
db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;