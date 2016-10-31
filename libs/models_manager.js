"use strict";

let sep = require('path').sep;

__.logger.info(`Application running used ${__config.db.dialect} database!`);

let db = undefined;
if (__config.db.dialect === 'mongodb') {
    db = require(__base + ['libs', 'db_dialect' + sep].join(sep) + __config.db.dialect);
} else {
    console.log(__base + ['libs', 'db_dialect', 'sequelize'].join(sep));
    db = require(__base + ['libs', 'db_dialect', 'sequelize'].join(sep));
}

module.exports = db;