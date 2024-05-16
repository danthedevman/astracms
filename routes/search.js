const express = require('express');
const router = express.Router({ mergeParams: true });
const {getSearch} = require('../controllers/search');

router.get('/', getSearch);

module.exports = router;
