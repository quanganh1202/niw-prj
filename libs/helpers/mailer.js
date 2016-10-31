"use strict";

let nodemailer = require('nodemailer');
let smtpTransport = require('nodemailer-smtp-transport');
let Promise = require('bluebird');

class mailer {
    constructor(auth, bcc, subject, content, options) {
        this.auth = auth;
        this.bcc = bcc;
        this.subject = subject;
        this.content = content;
        this.options = options || {};
    }

    send() {
        if (!this.options) {
            let transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: this.auth
            }, {
                from: this.auth.user,
                headers: {'Udoctor.vn': 'Hỏi bác sĩ miễn phí.'}
            });
            transporter.sendMail({
                from: `Udoctor < ${this.auth.user} >`, // sender address
                bcc: this.bcc, // list of receivers
                subject: this.subject, // Subject line
                html: this.content  // html body
            }, function (error, info) {
                if (error !== null) {
                    return error;
                } else {
                    console.log(info);
                    return info;
                }
            });
        } else if (this.options && this.options.service && this.options.service.name.toLocaleLowerCase() == 'zoho') {
            let mailServer = {
                host: 'smtp.zoho.com',
                port: 465,
                secure: true,
                auth: this.auth
            };
            let transporter = nodemailer.createTransport(smtpTransport(mailServer), {
                // default values for sendMail method
                from: this.auth.user,
                headers: {
                    'Udoctor.vn': 'Hỏi bác sĩ miễn phí.'
                }
            });
            return new Promise(function (fullfill, reject) {
                transporter.sendMail({
                    from: `Udoctor < ${this.auth.user} >`, // sender address
                    bcc: this.bcc, // list of receivers
                    subject: this.subject, // Subject line
                    html: this.content  // html body
                }, function (error, info) {
                    if (error) {
                        reject(error);
                    } else {
                        fullfill(true);
                    }
                });
            });

        } else if (this.options && this.options.service && this.options.service.name) {
            let mailServer = {
                host: this.options.service.host,
                port: this.options.service.port,
                secure: true,
                auth: this.auth
            };
            let transporter = nodemailer.createTransport(smtpTransport(mailServer), {
                // default values for sendMail method
                from: this.auth.user,
                headers: {
                    'Udoctor.vn': 'Hỏi bác sĩ miễn phí.'
                }
            });
            transporter.sendMail({
                from: `Udoctor < ${this.auth.user} >`, // sender address
                bcc: this.bcc, // list of receivers
                subject: this.subject, // Subject line
                html: this.content  // html body
            }, function (error, info) {
                if (error) {
                    return error;
                } else {
                    return info;
                }
            });
        }
    }
}

module.exports = mailer;