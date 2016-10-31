"use strict";

let _ = require('lodash');

module.exports = _.extend(
    _.merge(
        require('./config'),
        require('./viewEngine')
    )
);