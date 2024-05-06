const express = require('express');
const router = express.Router();
const {getModels,createModel} = require('../controllers/models');

router.get('/', getModels);
router.post('/sys_model/new', createModel);

module.exports = router;
