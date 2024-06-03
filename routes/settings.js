const express = require('express');
const router = express.Router({ mergeParams: true });
const {getGeneralSettings,getDeveloperSettings,saveBaseDetails,deleteBase} = require('../controllers/settings');
const multer  = require('multer');
const upload = multer();

router.get('/', (req,res,next)=>{
    res.redirect(`/${res.locals.base._id}/settings/general`);
});
router.get('/general', getGeneralSettings);
router.get('/developer', getDeveloperSettings);
router.get('/users', getGeneralSettings);
router.get('/users/:id', getGeneralSettings);
router.get('/billing', getGeneralSettings);

router.post('/general/save_base_details',upload.none(), saveBaseDetails);

router.delete('/general/delete_base', deleteBase);

module.exports = router;
