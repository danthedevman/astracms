const express = require('express');
const router = express.Router({ mergeParams: true });
const {getContent,getContentRecord,saveContent} = require('../controllers/content');
const {contentMiddleware} = require('../middleware/content');
const multer  = require('multer');
const upload = multer();

router.get('/',contentMiddleware, getContent);
router.get('/:model',contentMiddleware, getContent);

router.get('/:model/:id', getContentRecord);
router.post('/:model/:id',upload.none(),saveContent);
//router.delete('/:model/:id/delete', getContent);

module.exports = router;
