const express = require('express');
const router = express.Router({ mergeParams: true });
const {getModels,getModel,saveModel,deleteModel} = require('../controllers/models');

router.get('/', getModels);
router.get('/:id', getModel);
router.post('/:id', saveModel);
router.put('/update', saveModel);
router.delete('/:id/delete', deleteModel);

module.exports = router;
