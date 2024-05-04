const express = require('express');
const router = express.Router();
const {getModels} = require('../controllers/models');

router.get('/', getModels);

module.exports = router;
