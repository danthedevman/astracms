const express = require('express');
const router = express.Router({ mergeParams: true });
const {getAssets,uploadAsset,deleteAsset} = require('../controllers/assets');
const {multerFunction} = require('../middleware/asset');

router.get('/', getAssets);
router.post('/upload',multerFunction(), uploadAsset);
router.post('/upload/:asset_id',multerFunction(), uploadAsset);
router.delete('/:id/delete', deleteAsset);

module.exports = router;
