"use strict";

/*!
 * 100dayproject - lifeparser
 * Node.js programing language
 * MIT Licensed
 */

module.exports = function (env) {
    env.addFilter('checkInArray', function (array, item) {
        for (let i in array) {
            if (array.hasOwnProperty(i)) {
                return array[i]._id.toString() == item.toString();
            }
        }
    })
};