"use strict";

module.exports = function (env) {
    env.addFilter('calc_scoreEvent', function (countAnswer, countThanks) {
        return countAnswer * 8 + Math.round(countThanks / 2)
    })
};