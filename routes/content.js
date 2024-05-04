const express = require('express');
const router = express.Router();
const {getContent} = require('../controllers/content');

router.get('/', getContent);

module.exports = router;
