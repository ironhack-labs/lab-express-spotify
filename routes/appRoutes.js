const express = require('express');
const spotifyApi = require('../spotifyApi');
const router = express.Router();

router.get('/', (req, res) => {
    res.render('index');
  });

router.get('/artist-search', (req, res) => {
    const search = req.query;
    spotifyApi
        .searchArtists(search.title)
            .then(data => {
                console.log('The received data from the API: ', data.body.artists.items[0].images);
                // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
                res.render('artist-search-results',{items:data.body.artists.items});
    })
            .catch(err => console.log('The error while searching artists occurred: ', err));
    
});

router.get('/albums/:artistId', (req, res, next) => {
    console.log(req.params.artistId);
    spotifyApi.getArtistAlbums(req.params.artistId)
        .then(function(data) {
            //console.log('Albums information', {items:data.body.items});
            res.render('albums',{items:data.body.items})

        }, function(err) {
            console.error(err);
    });
  });

  router.get('/tracks/:albumId', (req, res, next) => {
    console.log(req.params.albumId);
    spotifyApi.getAlbumTracks(req.params.albumId)
        .then(function(data) {
            console.log('Album Tracks', data.body);
            res.render('tracks',{items:data.body.items})

        }, function(err) {
            console.error(err);
     });
  });


module.exports = router;
