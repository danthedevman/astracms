const express = require('express');
const router = express.Router({ mergeParams: true });
const {getContent,getContentByModel,getContentRecord,saveContent} = require('../controllers/content');
const {contentMiddleware} = require('../middleware/content');
const multer  = require('multer');
const upload = multer();

//consolidate these two routes when done
router.get('/',contentMiddleware, getContent);
router.get('/:model',contentMiddleware, getContentByModel);

router.get('/:model/:id', getContentRecord);
router.post('/:model/:id',upload.none(),saveContent);
//router.delete('/:model/:id/delete', getContent);

module.exports = router;
