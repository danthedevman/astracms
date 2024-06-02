const express = require('express');
const router = express.Router({ mergeParams: true });
const {getContent,getContentRecord,saveContentRecord,deleteContentRecord} = require('../controllers/content');
const {contentMiddleware} = require('../middleware/content');
const multer  = require('multer');
const upload = multer();

router.get('/',contentMiddleware, getContent);
router.get('/:model',contentMiddleware, getContent);

router.get('/:model/:id', getContentRecord);
router.post('/:model/:id',upload.none(),saveContentRecord);
router.delete('/:model/:id', deleteContentRecord);

module.exports = router;
