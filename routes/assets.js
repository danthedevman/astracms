const express = require('express');
const router = express.Router({ mergeParams: true });
const {getAssets,uploadAsset} = require('../controllers/assets');
const {multerFunction} = require('../middleware/asset');

router.get('/', getAssets);
router.post('/upload',multerFunction(), uploadAsset);
router.put('/update', uploadAsset);
router.delete('/delete', uploadAsset);

module.exports = router;
