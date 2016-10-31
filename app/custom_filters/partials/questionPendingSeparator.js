/**
 * Created by hai@100dayproject.org on 2/19/16.
 */

"use strict";

module.exports = function(env) {
    env.addFilter('questionPendingSeparator', function(questions, report) {
        var count = 0;

        if (report) {
            questions.forEach(function(question) {
                if (question.doctors_reported.length > 0) {
                    count +=1;
                }
            });
            return count;
        } else {
            questions.forEach(function(question) {
                if (question.doctors_reported.length == 0) {
                    count +=1;
                }
            });
            return count;
        }
    })
};