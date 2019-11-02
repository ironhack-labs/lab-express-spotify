require('dotenv').config()

const express = require('express');
const hbs = require('hbs');
const SpotifyWebApi = require("spotify-web-api-node");
const bodyParser = require('body-parser');

const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({ extended: true }));
hbs.registerPartials(__dirname + '/views/partials');


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

// Home page
app.get('/', (req, res, next) => {
  res.render('index');
});

//artista busqueda
app.post('/artists/', (req, res, next) => {
  spotifyApi
    .searchArtists(req.body.artistName)
    .then(data => {
      res.render('artists', { artists: data.body.artists.items} );

      //console.log("The received data from the API: ", data.body.artists.items);
    })
    .catch(err => {
      console.log("The error while searching artists occurred: ", err);
  });
});




app.listen(3000, () => console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊"));
