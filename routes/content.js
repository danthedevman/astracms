const express = require('express');
const router = express.Router({ mergeParams: true });
const {getContent,getContentByModel,getContentRecord,saveContent} = require('../controllers/content');
const multer  = require('multer');
const upload = multer();

router.get('/', getContent);
router.get('/:model', getContentByModel);
router.get('/:model/new', getContentRecord);
router.post('/:model/:id',upload.none(),saveContent);
//router.delete('/:model/:id/delete', getContent);

module.exports = router;
