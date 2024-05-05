const express = require('express');
const router = express.Router();
const {getContent,getContentByModel} = require('../controllers/content');

router.get('/', getContent);
router.get('/:model', getContentByModel);

module.exports = router;
