const express = require('express');
const router = express.Router({ mergeParams: true });
const {getModels,getModel,saveModel,deleteModel,saveField,deleteField} = require('../controllers/models');

router.get('/', getModels);
router.get('/:id', getModel);
router.post('/:id', saveModel);
router.post('/:id/fields/:field_id', saveField);
router.delete('/:id/delete', deleteModel);
router.delete('/:id/fields/:field_id', deleteField);

module.exports = router;
