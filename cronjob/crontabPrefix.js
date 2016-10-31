"use strict";

/*!
 * 100dayproject - lifeparser
 * Node.js programing language
 * MIT Licensed
 */

module.exports = {
    pathProduction: '/var/www/aa-generator/templates/cronjob',
    email: {
        auth: {
            user: 'support@udoctor.vn',
            pass: 'udoctor@VN0910'
        },
        headers: {'Udoctor.vn': 'Hỏi bác sĩ miễn phí.'},
        from: `Udoctor <support@udoctor.vn>`
    },
    nghiTet: 'skip_email_nghiTet',
    chucTet: 'skip_email_chucTet',
    ngayThayThuoc: 'skip_email_ngayThayThuoc'
};