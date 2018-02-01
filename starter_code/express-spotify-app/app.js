'use strict';

const SpotifyWebApi = require('spotify-web-api-node');
const express = require('express');
const app = express();
const expressLayouts = require('express-ejs-layouts');
const bodyParser = require('body-parser');


//configure app
app.set('views', __dirname + '/views');
app.set('layout', 'layouts/layout');
app.set('view engine', 'ejs');

app.locals.title = 'Spotify Clone';

app.use(expressLayouts); // why does the stylesheet not load?
app.use(bodyParser.urlencoded({ extended: true }));


// Remember to paste here your credentials
const clientId = '372e38d3d08e4678a9b4dd15c14b89e7',
    clientSecret = '3c2c3fc24ceb4aa3ad8e4f4c74c6d446';

const spotifyApi = new SpotifyWebApi({
  clientId : clientId,
  clientSecret : clientSecret
});

// Retrieve an access token.
spotifyApi.clientCredentialsGrant()
  .then(function(data) {
    spotifyApi.setAccessToken(data.body['access_token']);
  }, function(err) {
    console.log('Something went wrong when retrieving an access token', err);
});


// routes

// first route

app.get('/', (req, res, next) => {
    res.render('home');
  });

// artists route
app.get('/artists', (req,res,next) => {
    let reqArtist = req.query.artist;
    spotifyApi.searchArtists(reqArtist).then(function(result) {  
     //   console.log('Search artists: ',reqArtist);
     //   console.log('data', result.body.artists.items[0].images[0].url);
        let matches = {
            data: result.body.artists.items
        };

       res.render('artists',matches);
      }, function(err) {
        console.log('Something went wrong with this search', err);
    });

});

// album route
app.get('/albums/:artistId', (req, res) => {

  //  console.log( req.params.artistId);
    let artistId = req.params.artistId;
 
    spotifyApi.getArtistAlbums(artistId)
        .then((data) => {
      //      console.log(data.body.items);
            let artistData = {
                data: data.body.items
            };
        res.render('albums',artistData);
        }, function (err) {
            
            console.log('Something went wrong with this artist', err);
        });
 });

// Get tracks in an album
app.get('/tracks/:albumId', (req, res) => {

    console.log( req.params.albumId);
    let albumId = req.params.albumId;
 
    spotifyApi.getAlbumTracks(albumId)
    .then(function(data) {
        let tracks = {
            data: data.body.items
        }
      console.log(data.body.items);
      res.render('tracks',tracks);

    }, function(err) {
      console.log('Something went wrong with this album', err);
    });
 });





//start app
app.listen(3000, () => {
    console.log('Easy web dev. 3000!')
  });

  //<!-- <div><img src= <%= data[i].images[0].url %> ></div> -->
