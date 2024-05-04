const express = require('express');
const router = express.Router();
const {getDashboard} = require('../controllers/dashboard');

/* GET home page. */
router.get('/', getDashboard);

module.exports = router;
