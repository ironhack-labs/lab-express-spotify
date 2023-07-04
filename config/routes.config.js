const router = require('express').Router();
const miscController = require('../controllers/misc.controller');

//misc
router.get('/', miscController.getHome);

module.exports = router;