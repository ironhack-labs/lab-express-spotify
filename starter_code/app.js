require('dotenv').config()

const express = require('express');
const hbs = require('hbs');
const SpotifyWebApi = require("spotify-web-api-node");

const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

hbs.registerPartials(__dirname + "/views/partials");

// console.log(process.env);
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


spotifyApi
  .clientCredentialsGrant()
  .then(data => {
    spotifyApi.setAccessToken(data.body["access_token"]);
  })
  .catch(error => {
    console.log("Something went wrong when retrieving an access token", error);
  });



app.get('/', (req, res, next) => {

  res.render('index');
});
app.get('/artists', (req, res, next) => {
  // console.log(req.query.query);

  spotifyApi
    .searchArtists(req.query.query)
    .then(data => {

      const artists = data.body.artists.items
      // console.log(albums);
      res.render('artists', { artists });
      // console.log("The received data from the API: ", data.body.artists.items);
      // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
    })
    .catch(err => {
      console.log("The error while searching artists occurred: ", err);
    });

  // res.render('artists');
});

app.get('/albums', (req, res, next) => {
  spotifyApi.getArtistAlbums(req.query.id).then(
    function (data) {
      const albums = data.body.items;
      res.render('albums', { albums });
    },
    function (err) {
      console.error(err);
    }
  );
});

app.get('/tracks', (req, res, next) => {
  console.log(req.params.id);
  spotifyApi.getAlbumTracks(req.query.id).then(function (data) {
      console.log(data.body);
      const tracks = data.body.items;
      res.render('tracks', { tracks });
    }, function (err) {
      console.log(`Something went wrong!`, err);
    })
  })






// the routes go here:



app.listen(3000, () => console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊"));
