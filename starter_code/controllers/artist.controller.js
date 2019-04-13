const express = require('express');
const router = express.Router();
const spotifyApi= require('../config/spoti.config')
const app = express();


router.get('/', (req, res, next) => {
    spotifyApi.searchArtists(req.query.artist)
      .then(data => {
        console.log(data.body.artists);
        res.render('artist', { artists: data.body.artists })
        //res.json(data.body.artists)
      })
      .catch(next);
  });
  

  module.exports=router;