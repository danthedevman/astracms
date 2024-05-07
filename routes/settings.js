const express = require('express');
const router = express.Router({ mergeParams: true });
const {getSettings} = require('../controllers/settings');

router.get('/', getSettings);

module.exports = router;
