const express = require('express');
const router = express.Router();
const {getAssets} = require('../controllers/assets');

router.get('/', getAssets);

module.exports = router;
