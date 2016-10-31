"use strict";

let _module = new __viewRender('backend', 'user'),
    Promise = require('bluebird'),
    moduleName = 'user',
    layer = 'backend',
    passwordHash = require('password-hash');

_module.list = function (req, res) {

    //** Make a controllers here */

    let structure = [
        {
            column: '_id',
            width: '5%',
            header: ''
        }, {
            column: 'username',
            width: '25%',
            header: 'username',
            type: 'text',
            condition: {
                type: '/d/'
            }
        }, {
            column: 'last_login_date',
            width: '15%',
            header: 'Last login date',
            type: 'date-range',
            buttonClass: 'fa fa-calendar',
            condition: {
                type: 'none'
            }
        }
    ];

    /**
     * Toolbar call and render element
     * Access authentication call isAllow for check permission
     */
    let toolbar = new __.Toolbar();
    toolbar.custom({
        refreshButton: {link: `/${__config.admin_prefix}/${moduleName}`},
        createButton: {access: true, link: `/${__config.admin_prefix}/${moduleName}/create`, text: ' Tạo tài khoản'},
        searchButton: {},
        deleteButton: {access: true, link: `/${__config.admin_prefix}/${moduleName}/delete`, text: ' Xóa tài khoản'} // isAllow
    });
    res.locals.tableColumns = structure;
    let pageSize = 15;
    let currentPage = req.query.page || 1;

    try {
        var table = new __.createTable(__models.User, structure, __.parseQueryCondition([req.query, structure]), __.pagination(currentPage, pageSize));
        table.render(function (err, results) {
            _module.render(req, res, 'index', {
                title: 'User list',
                users: results[1],
                totalPage: Math.ceil(results[0] / pageSize),
                currentPage: currentPage,
                toolbar: toolbar.render()
            });
        });
    } catch (e) {
        __.logger.error(e);
        _module.render_error(req, res, '500');
    }

};

_module.create = function (req, res) {
    let toolbar = new __.Toolbar();
    toolbar.custom({
        backButton: {link: `/${__config.admin_prefix}/${moduleName}`},
        saveButton: {access: true}
    });

    Promise.all([
		__models.Role.find({}).exec(function (err, foundRole) {
		    if (!err) return foundRole;
		})
    ]).then(function (result) {
    	
    console.log(result[0]);
        _module.render(req, res, 'view', {
            title: 'New user',
            toolbar: toolbar.render(),
            role: result[0]
        })
    }).catch(function (error) {
        __.logger.error(error);
        _module.render_error(req, res, '500');
    });
};

_module.created = function (req, res) {
    let status = false;
    var newUser = new __models.User({
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        username: req.body.username,
        password: passwordHash.generate(req.body.password),
        roles: req.body.roles,
        email: req.body.email,
        address: req.body.address,
        position_in_company : req.body.position_in_company,
    });

    newUser.save(function (err) {
        if (err) {
            req.flash('danger', 'Create user failed!');
        } else {
            req.flash('success', 'Create user success');
            res.redirect(`/${__config.admin_prefix}/${moduleName}`);
        }
    });
};

_module.updated = function (req, res) {
    let id = req.params.id;
    var condition = {};
    condition.first_name = req.body.first_name;
    condition.last_name = req.body.last_name;
    condition.roles = req.body.roles;
    condition.email = req.body.email;
    condition.address = req.body.address;
    condition.position_in_company = req.body.position_in_company;
    if(req.body.password != '') {
    	condition.password = passwordHash.generate(req.body.password)
    }
    
    __models.User.update({_id: id}, condition).exec(function (err, re) {
        if (err) {
            __.logger.error(err);
            _module.render_error(req, res, '500');
        } else {
            req.flash('success', 'Update user success!');
            res.redirect(`/${__config.admin_prefix}/${moduleName}`);
        }
    })
};

_module.delete = function (req, res) {
	console.log(req.body.ids);
    __models.User.remove({_id: {$in: req.body.ids}})
        .exec(function (err) {
            if (err) {
                __.logger.error(err);
                req.flash('danger', 'delete failed!');
                res.sendStatus(200);
            } else {
                req.flash('success', 'delete success!');
                res.sendStatus(200);
            }
        })
};

_module.view = function (req, res) {
    let toolbar = new __.Toolbar();
    toolbar.custom({
        backButton: {link: `/${__config.admin_prefix}/${moduleName}`},
        saveButton: {access: true}
    });
    let id = req.params.id;
    __models.User.find({_id: id})
        .exec(function (err, foundUser) {
            if (err) {
                // Wrong parameter req query
                __.logger.error(err);
                _module.render_error(req, res, '500');
            } else if (!foundUser.length) {
                // Parameter accept but not found
                __.logger.warn(`${layer} > Wrong parameter url: ${res.locals.route}`);
                _module.render_error(req, res, '404');
            } else {
            	__models.Role.find({})
            	.exec(function(err, foundRole) {
            		if(err) {
            			__.logger.error(err);
                        _module.render_error(req, res, '500');
            			}
            		console.log(foundUser);
            		 _module.render(req, res, 'view', {
                         title: 'view User',
                         toolbar: toolbar.render(),
                         usr: foundUser[0],
                         role : foundRole
                     });
            	});
            }
        });
};



module.exports = _module;