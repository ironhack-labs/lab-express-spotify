require('dotenv').config()


const bodyParser = require('body-parser');
const express = require('express');
const hbs = require('hbs');
const path = require('path');

// require spotify-web-api-node package here:
const SpotifyWebApi = require("spotify-web-api-node");


const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

hbs.registerPartials(`${__dirname}/views/partials`)

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));



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

app.get('/artists', (req, res, next) => {
  spotifyApi
  .searchArtists(req.query.artist)
  .then(data => {
    // console.log("The received data from the API: ", data.body.artists);
    let result = data.body.artists.items;
    res.render('artists', {result});
    // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
  })
  .catch(err => {
    console.log("The error while searching artists occurred: ", err);
  });
});

app.get("/albums/:artistId", (req, res, next) => {
  spotifyApi
  .getArtistAlbums(req.params.artistId)
  .then(data => {
    // console.log("The received data from the API: ", data.body.items);
    let result = data.body.items;
    res.render('albums', {result});
    // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
  })
  .catch(err => {
    console.log("The error while searching artists occurred: ", err);
  });
});

app.get("/tracks/:trackId", (req, res, next) => {
  spotifyApi
  .getAlbumTracks(req.params.trackId)
  .then(data => {
    console.log('Album tracks', data.body.items);
    let result = data.body.items;
    res.render('tracks', {result});
})
.catch(err => {
  console.log("The error while searching artists occurred: ", err);
});
;})



app.listen(3000, () => console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊"));
