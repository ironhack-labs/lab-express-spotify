require('dotenv').config();

const express = require('express');
const hbs = require('hbs');

// require spotify-web-api-node package here:
const SpotifyWebApi = require('spotify-web-api-node');
const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

console.log(process.env.CLIENT_ID)
// setting the spotify-api goes here:
const spotifyApi = new SpotifyWebApi({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET
});

// Retrieve an access token
spotifyApi
  .clientCredentialsGrant()
  .then(data => {
    spotifyApi.setAccessToken(data.body['access_token']);
  })
  .catch(error => {
    console.log('Something went wrong when retrieving an access token', error);
  });

// the routes go here:
app.get("/", (req, res, next) => {
  res.render('index')
});


app.get('/artists', (req, res, next) => {
  spotifyApi
    .searchArtists(req.query.artist)
    .then(data => {
      console.log('The received data from the API: ', data.body);
      // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
      let items = data.body.artists.items;
      res.render('artists', {
        items
      });
    })
    .catch(err => {
      console.log('The error while searching artists occurred: ', err);
    });

});



app.get('/albums/:id', (req, res, next) => {
  // .getArtistAlbums() code goes here
  spotifyApi
    .getArtistAlbums('req.params.id')
    .then(data => {
      console.log('Artist albums', data.body);
      let items = data.body.items;
      res.render('albums', {
        items
      });
    })
    .catch(err => {
      console.log('The error while searching artists occurred: ', err);
    });

})


app.get("/album-tracks/:id", (req, res, next) => {
  spotifyApi
    .getAlbumTracks('req.params.id')
    .then(data => {
      console.log(data.body);
      let items = data.body.items;
      res.render('album-tracks', {
        items
      });
    })
    .catch(err => {
      console.log('The error while searching artists occurred: ', err);
    });

})


app.listen(3000, () =>
  console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊')
);