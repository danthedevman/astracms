const express = require('express');
const router = express.Router({ mergeParams: true });
const {getUsers} = require('../controllers/users');

router.get('/', getUsers);

module.exports = router;
