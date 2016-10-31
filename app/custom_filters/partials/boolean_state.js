"use strict";

module.exports = function (env) {
    let safe = env.getFilter('safe');

    env.addFilter('boolean_state', function (bool, txtTrue, txtFalse, falseClass, trueClass) {
        if (bool) {
            return safe(`<span class='label label-${trueClass || 'success'}'>${txtTrue}</span>`)
        } else {
            return safe(`<span class='label label-${falseClass || 'danger'}'>${txtFalse}</span>`)
        }
    });

    env.addFilter('gender', function (input) {
        if (input) {
            switch (input.toLocaleLowerCase()) {
                case 'nam':
                case 'male':
                    return safe(`<span class="label label-primary"><i class="fa fa-mars"></i> Nam</span>`);
                    break;
                default:
                    return safe(`<span class="label label-warning"><i class="fa fa-venus"></i> Nữ</span>`);
            }
        }
    });

    env.addFilter('account_type', function (facebookId) {
        if (!facebookId) {
            return safe(`<span class='label label-success'>Người dùng</span>`)
        } else {
            return safe(`<span class='label label-primary'>Facebook</span>`)
        }
    });

    env.addFilter('account_state', function (state) {
        if (state === 'denied') {
            return safe(`<span class='label label-danger'>Hủy bỏ</span>`)
        } else if (state === 'suspended') {
            return safe(`<span class='label label-primary'>Không chấp nhận</span>`)
        } else if (state === 'pending') {
            return safe(`<span class='label label-warning'>Chờ xác minh</span>`)
        } else {
            return safe(`<span class='label label-success'>Đã xác minh</span>`)
        }
    });

    env.addFilter('post_state', function (boolean) {
        if (boolean) {
            return safe("<span class='label label-success'>Publish</span>")
        } else {
            return safe("<span class='label label-warning'>Draft</span>")
        }
    });

    env.addFilter('resource_state', function (resource) {
        if (resource == 'from_backend') {
            return safe(`<span class='label label-warning'>Được nhập</span>`);
        } else {
            return safe(`<span class='label label-success'>Người dùng</span>`);
        }

    })
};