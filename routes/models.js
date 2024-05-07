const express = require('express');
const router = express.Router({ mergeParams: true });
const {getModels,createModel} = require('../controllers/models');

router.get('/', getModels);
router.post('/new', createModel);

module.exports = router;
