const express = require('express');
const router = express.Router({ mergeParams: true });
const { getBases, createBase } = require('../controllers/index');

router.get('/', getBases);
router.post('/sys_base/new', createBase);

module.exports = router;
