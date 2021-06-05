const express = require('express');

const common = require('../controllers/common.controller')



const router = express.Router();

router.get('/', common.home)
router.get('/artist-search', common.search)




module.exports = router;