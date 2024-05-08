const express = require('express');
const router = express.Router({ mergeParams: true });
const {getModels,getModel,createModel,deleteModel} = require('../controllers/models');

router.get('/', getModels);
router.get('/:id', getModel);
router.post('/new', createModel);
router.put('/update', createModel);
router.delete('/:id/delete', deleteModel);

module.exports = router;
