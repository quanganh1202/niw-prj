"use strict";

require("../config/init")();
global.__ = require("../libs/global_function");
global.__config = require("../config");
global.__models = require("../libs/models_manager");
global.__viewRender = require("../libs/render_manager");
global.__redis = require('redis').createClient(__config.redis.auth);
global.__code = require("../libs/code");
global.__message = require("../libs/message");

//let dateNow = new Date(Date.now());
//
//console.log(String('00' + dateNow.getDate().toString()).slice(-2));
//console.log(String('00' + (parseInt(dateNow.getMonth()) + 1).toString()).slice(-2));
//console.log(dateNow.getFullYear().toString());
//
//// So cau tra loi trong ngay hom nay
//let queryToday = [
//    {
//        $project: {
//            year: {$substr: ['$created_date', 0, 4]},
//            month: {$substr: ['$created_date', 5, 2]},
//            day: {$substr: ['$created_date', 8, 2]}
//        }
//    }, {
//        $match: {
//            year: dateNow.getFullYear().toString(),
//            month: String('00' + (parseInt(dateNow.getMonth()) + 1).toString()).slice(-2),
//            day: String('00' + dateNow.getDate().toString()).slice(-2)
//        }
//    }
//];
//
//__models.Answer.aggregate(queryToday, function (e, answers) {
//    console.log('tra loi', answers.length);
//});
//
//__models.Question.aggregate(queryToday, function(e, questions) {
//    console.log(questions.length);
//});

// So cau hoi trong ngay hom nay



// Thong ke so luong bac sy theo chuyen khoa va danh sach cac bac sy tuong ung voi khoa do.
//__models.Doctor.aggregate([
//    {
//        $group: {
//            _id: "$faculty_id",
//            doctors: {$addToSet: {info: ['$_id', '$last_name', '$first_name']}},
//            count: {$sum: 1} // for no. of documents count
//        }
//    }, {
//        $sort: {
//            count: -1
//        }
//    }
//]).exec(function (e, faculty) {
//    __models.Faculty.populate(faculty, {
//        path: '_id',
//        select: 'name'
//    }, function (err, result) {
//        console.log(result);
//    })
//});


function parseSelect2(data) {
    var results = [];
    data.forEach(function (item) {
        var obj = {};
        obj.id = '';
        if (item._id) {
            if (item._id.name) {
                obj.text = item._id.name;
            } else {
                obj.text = '';
            }
            obj.children = [];
            item.doctors.forEach(function (doctor) {
                obj.children.push({id: doctor.info[0], text: doctor.info[1] + doctor.info[2]});
            });

            results.push(obj);
        }
    });
    return results;
}
/**
 * lifeparser main application
 */
class lifeparser {

    /**
     * Running application.
     * @param port [Int] - Port express listen
     * @param opt [Boolean] - Application show configuration
     */
    start(port, opt) {
        let app = require("../config/express")();
        let PORT = process.env.PORT || port || __config.site.port;
        app.listen(PORT);
        if (opt && opt.showConfigure) {
            __.logger.info(`Application config information:
            => Template engine: ${__config.site.templateEngine}
            => Model database: ${__config.db.dialect}
            => Theme current: ${__config.site.theme.name}\n`);

            __.logger.info(`=> Listening on port ${PORT}. Process ID: ${process.pid}`);
        }
    }
}

module.exports = lifeparser;