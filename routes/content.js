const express = require('express');
const router = express.Router({ mergeParams: true });
const {getContent,getContentByModel,getContentRecord,saveContent} = require('../controllers/content');
const multer  = require('multer');
const upload = multer();

//consolidate these two routes when done
router.get('/', getContent);
router.get('/:model', getContentByModel);

router.get('/:model/:id', getContentRecord);
router.post('/:model/:id',upload.none(),saveContent);
//router.delete('/:model/:id/delete', getContent);

module.exports = router;
