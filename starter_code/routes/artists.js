var express = require('express');
var router = express.Router();
var bodyParser = require("body-parser")

router.get('/', (req, res) => {
  res.render("artists")
});

var urlEncoder = bodyParser.urlencoded({extended: true})
var spotifyApi = require(__dirname + '/../models/spotifyAPI')

router.post('/', urlEncoder, function(req,res){
  spotifyApi.searchArtists(req.body.searchArtist)
  .then(data => {
    res.render("artists", {search: data.body.artists.items});
    })
  .catch(err => {
    err ? console.log("Error"): console.log("Error")
  })
})


module.exports = router;

