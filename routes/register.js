const express = require('express');
const router = express.Router({ mergeParams: true });
const { getRegisterPage, registerUser } = require('../controllers/register');

router.get('/', getRegisterPage);
router.post('/', registerUser);

module.exports = router;
