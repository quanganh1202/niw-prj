"use strict";

let glob = require('glob'),
    fs = require('fs'),
    path = require('path'),
    _ = require('lodash'),
    winston = require('winston'),
    moment = require('moment');
let i1n8 = require('./helpers/i1n8');
var ArrayProto = Array.prototype;
var ObjProto = Object.prototype;
let self = this;

/**
 * Add prototype
 * @returns {*}
 */
String.prototype.toObjectId = function () {
    var ObjectId = (require('mongoose').Types.ObjectId);
    return new ObjectId(this.toString());
};

exports.isAllow = function (allow) {
    return function (req, res, next) {
        if (allow) {
            next();
            return;
        } else {
            req.flash('danger', 'Not permission access');
            return res.redirect('/admin/dashboard');
        }
    };
};

exports.filterSelect2 = function (arrayElement) {
    if (arrayElement) {
        var result = [];
        arrayElement.forEach(function (i) {
            result.push(`${i._id}`);
        });
        return result;
    }
};

exports.t = function () {
    let currentLang = __config.app.language;
    var args = Array.prototype.slice.call(arguments);
    args[0] = i1n8[currentLang][args[0]] || 'Undefined';
    return util.format.apply(util, args);
};

exports.dateFormatTimeStamp = function (dd, mm, yyyy) {
    return moment(new Date(yyyy, mm - 1, dd)).format('YYYY-MM-DDTHH:mm:ss.SSS');
};

exports.pagination = function (reqQueryPage, pageSize) {
    let offset = 0;
    if (reqQueryPage !== 1) {
        offset = (reqQueryPage - 1) * pageSize;
    }
    return {
        pageSize: pageSize,
        offset: offset
    }
};

exports.isString = function (obj) {
    return ObjProto.toString.call(obj) === '[object String]';
};

exports.parseQueryCondition = function (arrayData) {
    let structure = arrayData.pop();

    let condition = [];
    if (arrayData) {
        Object.keys(arrayData[0]).forEach(function (key) {
            if (arrayData[0][key].trim().toLocaleLowerCase()) {
                if (arrayData[0][key] !== 'all') {
                    let str = `{'${key}':'${arrayData[0][key]}'}`;

                    let tmp = JSON.parse(str.replace(/'/g, '"'));
                    condition.push(tmp);
                }
            }
        })
    }
    var result = {};

    for (let i = 0; i < condition.length; i++) {
        let key = Object.keys(condition[i]);
        for (let n in structure) {
            if (structure.hasOwnProperty(n)) {
                if (structure[n].column == key[0]) {
                    if (structure[n].condition) {
                        switch (structure[n].condition.type) {
                            case 'equals':
                                if (eval(`${condition[i][key]}` === true) || eval(`${condition[i][key]}` === false)) {
                                    result[key] = eval(`${condition[i][key]}`);
                                } else {
                                    result[key] = condition[i][key];
                                }
                                break;
                            case '/d/':
                                result[key] = eval(`/${condition[i][key]}/i`);
                                break;
                            case '/^d/':
                                result[key] = eval(`/^${condition[i][key]}/i`);
                                break;
                            case '/d^/':
                                result[key] = eval(`/${condition[i][key]}^/i`);
                                break;
                            case 'none':
                            case undefined:
                                break;
                        }
                    }
                }
            }
        }
    }

    return result;
};


winston.emitErrs = true;

exports.logger = new winston.Logger({
    transports: [
        new winston.transports.Console({
            level: process.env.NODE_ENV === 'development' ? 'debug' : 'info',
            handleExceptions: true,
            json: false,
            colorize: true,
            prettyPrint: true,
            silent: false,
            timestamp: false
        }),
        //new winston.transports.File({
        //    level: 'warn',
        //    filename: 'logs/',
        //    name: 'warning.log',
        //    handleExceptions: true,
        //    json: true,
        //    maxsize: 1024 * 1024 * 10,
        //    maxFiles: 5,
        //    colorize: false
        //}),
        new winston.transports.File({
            level: 'error',
            filename: 'logs/error.log',
            handleExceptions: true,
            json: true,
            maxsize: 1024 * 1024 * 10,
            maxFiles: 5,
            colorize: false
        })
    ],
    exceptionHandlers: [
        new winston.transports.File({
            filename: 'logs/exceptions.log'
        }),
        new winston.transports.Console({
            prettyPrint: true,
            colorize: true,
            silent: false,
            timestamp: false
        })
    ],
    exitOnError: true
});

/**
 * Md5 crypt
 * @param str
 * @returns {*}
 */
exports.md5Hash = function (str) {
    return require('crypto').createHash('md5').update(str).digest("hex");
};

/**
 * Get files by glob patterns
 */
exports.getGlobbedFiles = function (globPatterns, removeRoot) {
    // For context switching
    let _this = this;

    // URL paths regex
    let urlRegex = new RegExp('^(?:[a-z]+:)?\/\/', 'i');

    // The output array
    let output = [];

    // If glob pattern is array so we use each pattern in a recursive way, otherwise we use glob
    if (_.isArray(globPatterns)) {
        globPatterns.forEach(function (globPattern) {
            output = _.union(output, _this.getGlobbedFiles(globPattern, removeRoot));
        });
    } else if (_.isString(globPatterns)) {
        if (urlRegex.test(globPatterns)) {
            output.push(globPatterns);
        } else {
            let files = glob.sync(globPatterns);
            if (files.length) {
                if (removeRoot) {
                    files = files.map(function (file) {
                        return file.replace(removeRoot, '');
                    });
                }
                output = _.union(output, files);
            }
        }
    }

    return output;
};

/**
 * Get all directories within directory
 * @param srcPath [String] - path directory
 * @param ignore [Array] - Name directory ignore
 * @returns {*} [Array] - List path directory accept ignore condition
 */
exports.getDirectories = function (srcPath, ignore) {
    let dest = [];
    fs.readdirSync(srcPath).filter(function (file) {
        if (fs.statSync(path.join(srcPath, file)).isDirectory()) {
            let push = true;
            ignore.forEach(function (re) {
                if (file === re) push = false;
            });
            if (push) dest.push([srcPath, file].join(path.sep));
        }
    });
    return _.uniq(dest);
};

exports.Toolbar = require('./helpers/Toolbars');
//exports.isAllow = require('./helpers/isAllow');
exports.createTable = require('./helpers/createTable');
exports.mailer = require('./helpers/mailer');