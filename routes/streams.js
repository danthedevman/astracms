const express = require('express');
const router = express.Router({ mergeParams: true });
const { getStream } = require('../controllers/streams');

router.get('/:name', getStream);

module.exports = router;
