const express = require('express');
const router = express.Router();
const spotifyApi= require('../config/spoti.config')
const app = express();
const artist= require ('../controllers/artist.controller')

router.get('/', artist);



module.exports = router;
