const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser'); 


var urlcodeParser = bodyParser.urlencoded({ extended: false});
var spotifyApi = require(__dirname + '/../models/spotify_api');

router.get('/', function(req, res) {
    var searchQuery = req.query.q
    spotifyApi.searchArtists(searchQuery)
    .then(function(data) {
        console.log('Search artists by ' + searchQuery , data.body);
        res.render('artists', {result: data.body.artists.items}) 
    }, function(err) {
        console.error(err);
    });
})

module.exports = router;


