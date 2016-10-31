"use strict";

let __models = require('./connection');
let redis = require('redis').createClient();


let dateformat = require('dateformat');

__models.Events.find({status: true}).sort({created_at: -1}).limit(1).exec(function (err, event) {
    let t = new Date(event[0].times.start),
        t2 = new Date(event[0].times.end);

    let startDate = [t.getFullYear(), String('00' + (t.getMonth() + 1)).slice(-2), String('00' + t.getDate()).slice(-2)].join(','),
        endDate = [t2.getFullYear(), String('00' + (t2.getMonth() + 1)).slice(-2), String('00' + t2.getDate()).slice(-2)].join(',');

    __models.Question.find({
            answers: {$ne: []},
            source: 'from_user',
            is_removed: {$ne: true}
        }, {answers: 1})
        .exec(function (err, questions) {
            let listAnswers = questions.map(function (i) {
                return i.answers[0]
            });

            __models.Answer.aggregate([
                {
                    $match: {
                        is_removed: {$ne: true},
                        _id: {$in: listAnswers},
                        created_date: {
                            $gte: dateformat(startDate, "isoDateTime"),
                            $lt: dateformat(endDate, "isoDateTime")
                        },
                        doctor_id: {
                            $nin: [
                                '566a353c21b19b354371ed3f'.toObjectId(), // Udoctor
                                '565a8a5a7ae1870949a5b8ac'.toObjectId(), // Nguyen pham hung
                                '564e20ccf17ee6f6597ae004'.toObjectId(), // Le hung manh
                                //'5697798db11bfd8f347e7e89'.toObjectId(), // Dang van hai
                                '564fc7ea4f7274401e4993e6'.toObjectId(), // Nguyen chi tuan
                                '566a81bc8d29e3996d137dc7'.toObjectId(), // Dinh minh thanh
                                '56a217168e09bcee6972da7a'.toObjectId() // Chu thi hang
                            ]
                        }
                    }
                }, {
                    $group: {
                        _id: '$doctor_id',
                        countAnswer: {$sum: 1},
                        countThanks: {$sum: {$size: '$number_of_thanks'}}
                        //score: '$countAnswer' * 8 + Math.round('$countThanks' / 2)
                    }
                }
                //, {
                //    $project: {
                //        _id: 1,
                //        countAnswer: 1,
                //        countThanks: 1,
                //        scoreAnswer: {$multiply: ['$countAnswer', 8]},
                //        scoreThanks: {$divide: ['$countThanks', 2]}
                //        //score: {$add: [{$multiply: ['$countAnswer', 8]}, {$divide: ['$countThanks', 2]}]},
                //        //score: {$multiply: ['$countAnswer', 8]},
                //        //score2: {$ceil: {$divide: ['$countThanks', 2]}}
                //    }
                //}
                , {
                    $sort: {countAnswer: -1, countThanks: -1}
                }, {
                    $limit: 10
                }
            ]).exec(function (err, populateDoctor) {
                __models.Doctor.populate(populateDoctor, {
                    path: '_id',
                    select: 'first_name last_name'
                }, function (err, populateFaculty) {
                    __models.Faculty.populate(populateFaculty, {
                        path: '_id.faculty_id',
                        select: 'name'
                    }, function (err, results) {
                        redis.del('scoreEvent');
                        redis.set('scoreEvent', JSON.stringify(results, null, 4));
                        console.log('success');
                        process.exit();
                    })
                })
            })
        })
});

//__models.Question.find({
//        answers: {$ne: []},
//        source: 'from_user',
//        is_removed: {$ne: true}
//    }, {answers: 1})
//    .exec(function (err, questions) {
//        let listAnswers = questions.map(function (i) {
//            return i.answers[0]
//        });
//
//        __models.Answer.aggregate([
//            {
//                $match: {
//                    is_removed: {$ne: true},
//                    _id: {$in: listAnswers},
//                    created_date: {
//                        $gte: dateformat(startDate, "isoDateTime"),
//                        $lt: dateformat(endDate, "isoDateTime")
//                    },
//                    doctor_id: {$nin: ['566a353c21b19b354371ed3f'.toObjectId()]}
//                }
//            }, {
//                $group: {
//                    _id: '$doctor_id',
//                    countAnswer: {$sum: 1},
//                    countThanks: {$sum: {$size: '$number_of_thanks'}}
//                }
//            }, {
//                $sort: {countAnswer: -1, countThanks: -1}
//            }
//        ]).exec(function (err, populateDoctor) {
//            if (err) {
//                __.logger.error(err);
//                return _module.render(req, res, '500');
//            }
//            __models.Doctor.populate(populateDoctor, {
//                path: '_id',
//                select: 'first_name last_name comment questions faculty_id active_state'
//            }, function (err, populateFaculty) {
//                if (err) {
//                    __.logger.error(err);
//                    return _module.render(req, res, '500');
//                }
//                __models.Faculty.populate(populateFaculty, {
//                    path: '_id.faculty_id',
//                    select: 'name'
//                }, function (err, results) {
//                    if (err) {
//                        __.logger.error(err);
//                        return _module.render(req, res, '500');
//                    }
//                    _module.render(req, res, 'result', {
//                        title: `Kết quả sự kiện: ${event[0].name}`,
//                        toolbar: toolbar.render(),
//                        event: event[0],
//                        result: results
//                    })
//                })
//            })
//        })
//    })