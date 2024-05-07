const express = require('express');
const router = express.Router({ mergeParams: true });
const {getContent,getContentByModel} = require('../controllers/content');

router.get('/', getContent);
router.get('/:model', getContentByModel);
router.post('/:model/new', getContent);
router.put('/:model/:id/update', getContent);
router.delete('/:model/:id/delete', getContent);

module.exports = router;
