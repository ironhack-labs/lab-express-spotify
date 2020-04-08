require('dotenv').config();

const express = require('express');
const hbs = require('hbs');
const SpotifyWebApi = require('spotify-web-api-node');

// require spotify-web-api-node package here:

const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

// setting the spotify-api goes here:
const spotifyApi = new SpotifyWebApi({
    // clientId: process.env.CLIENT_ID,
    // clientSecret: process.env.CLIENT_SECRET
    clientId: '4c9842806849423abbe6088037c87b96',
    clientSecret: 'b64377432443404bae8a700f7956d265'
  });
  
  // Retrieve an access token
  spotifyApi
    .clientCredentialsGrant()
    .then(data => spotifyApi.setAccessToken(data.body['access_token']))
    .catch(error => console.log('Something went wrong when retrieving an access token', error));

// Our routes go here:
app.get('/', function (req, res) {
    console.log('test');
    res.render('index')
  })

app.get('/artist-search/', (req, res, next) => {
    
    spotifyApi.searchArtists(`${req.query.artists}`)
    .then(function(data) {
        console.log(`Search artists by "${req.query.artists}"`, data.body);
        //console.log(data.body.artists.items)
        res.render('artist-search-results', {items:data.body.artists.items});
    }, function(err) {
        console.error(err);
    });

    //console.log(req.query)

    //res.send(req.query)
})

app.get('/albums/:artistId', (req, res, next) => {
    // .getArtistAlbums() code goes here

    spotifyApi.getArtistAlbums(req.params.artistId).then(
        function(data) {
          console.log('Artist albums', data.body);
          res.render('albums', {items:data.body.items});
        },
        function(err) {
          console.error(err);
        }
      );

  });

  app.get('/tracks/:trackId', (req, res, next) => {
    // .getArtistAlbums() code goes here

    spotifyApi.getAlbumTracks(req.params.trackId, { limit : 10, offset : 1 })
        .then(function(data) {
            console.log(data.body);
            res.render('tracks', {items:data.body.items});
        }, function(err) {
            console.log('Something went wrong!', err);
        });

  });

app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
