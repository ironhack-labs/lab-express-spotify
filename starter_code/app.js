//========= Global Variables =============
const express = require('express');
const hbs = require('hbs');
const SpotifyWebApi = require('spotify-web-api-node');
const app = express();
require("dotenv").config();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));


//========= Spotify Credentials ==========
const spotifyApi = new SpotifyWebApi({
  clientId : process.env.clientId,
  clientSecret : process.env.clientSecret
});

// Retrieve an access token
spotifyApi.clientCredentialsGrant()
  .then( data => {
    spotifyApi.setAccessToken(data.body['access_token']);
  })
  .catch(error => {
    console.log('Something went wrong when retrieving an access token', error);
  })


//=========== Home Page ===============
  app.get('/', (req, res, next) => {
    res.render('index');
  });


//=========== Artists Page =============
  app.get('/artists', (req, res, next) => {
    spotifyApi.searchArtists(req.query.artist)
    .then(
      data => {
        let artists = data.body.artists.items
        // res.json(artists);
        res.render('artists', {artists})
      }
    )
    .catch(
      err => {
        console.log("The error while searching artists accurred: ", err);
      }
    )
  })
  

//============ Albums Page ===============
  app.get('/albums/:artistId', (req,res) => {
    let artistId = req.params.artistId;
    spotifyApi.getArtistAlbums(artistId).then(
      function(data) {
        console.log('Artist albums', data.body);
        let albums = data.body.items;
        res.render('albums', {albums})

      },
      function(err) {
        console.error(err);
      }
    );
    // res.json(artistId);
  })


//============= Tracks Page ==============  
app.get('/tracks/:albumID', (req,res) => {
  let albumID = req.params.albumID;
  spotifyApi.getAlbumTracks(albumID, { limit : 20, offset : 0 })
  .then(function(data) {
    let tracks = data.body.items;

    // console.log(data.body);
        // res.json(tracks);
    res.render('tracks', {tracks})
  }, function(err) {
    console.log('Something went wrong!', err);
  });
})

app.listen(3000, () => console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊"));
