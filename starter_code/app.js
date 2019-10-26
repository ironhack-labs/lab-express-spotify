require('dotenv').config()

const express = require('express');
const hbs = require('hbs');

// require spotify-web-api-node package here:
const SpotifyWebApi = require("spotify-web-api-node");


const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));


// setting the spotify-api goes here:
const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET
  });
  
  // Retrieve an access token
  spotifyApi
    .clientCredentialsGrant()
    .then(data => {
      spotifyApi.setAccessToken(data.body["access_token"]);
    })
    .catch(error => {
      console.log("Something went wrong when retrieving an access token", error);
    });





// the routes go here:
app.get('/', (req, res) => {
    res.render('index');
});

app.get('/artists', (req, res) => {

    spotifyApi
    .searchArtists(req.query.artist, { limit: 50, offset: 0 })
      .then(data => {
        let datum = data.body;
        let items = datum.artists.items;
        // let images = datum.artists.items.images;
          console.log("The received data from the API: ", datum.artists.items);
          // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
          // res.send({items});
          res.render('artists', {items});
      })
      .catch(err => {
        console.log("The error while searching artists occurred: ", err);
      });
    
    // console.log(req);
});

app.get("/albums/:artistId", (req, res, next) => {
  // .getArtistAlbums() code goes here
  spotifyApi.getArtistAlbums(req.params.artistId).then(
    function(data) {
      let albums = data.body.items;
      console.log('Artist albums', data.body);
      // res.send({albums});
      res.render('albums', {albums});
    },
    function(err) {
      console.error(err);
    }
  );
});

app.get("/tracks/:albumId", (req, res, next) => {
  // .getArtistAlbums() code goes here
  spotifyApi.getAlbumTracks(req.params.albumId)
  .then(function(data) {
    let tracks = data.body.items;
    // res.send({tracks});
    res.render('tracks', {tracks});
    console.log(data.body);
  }, function(err) {
    console.log('Something went wrong!', err);
  });
});


app.listen(3000, () => console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊"));
