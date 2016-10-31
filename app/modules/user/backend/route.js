"use strict";
let express = require('express');
let router = express.Router();
let user = require('./controllers/user');

router.route('/user').get(user.list).delete(user.delete);
router.route('/user/create').get(user.create).post(user.created);
router.route('/user/view/:id').get(user.view).post(user.updated).delete(user.delete);

module.exports = router;