const express = require('express');
const router = express.Router({ mergeParams: true });
const {getSettings} = require('../controllers/settings');

router.get('/', getSettings);
router.get('/general', getSettings);
router.get('/developer', getSettings);
router.get('/users', getSettings);
router.get('/users/:id', getSettings);
router.get('/billing', getSettings);

module.exports = router;
