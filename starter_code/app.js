require('dotenv').config()

const express = require('express');
const path = require('path');
const hbs = require('hbs');

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

app.get('/', (req, res, next) => {
      res.render('home');
    });

app.get('/artists', (req, res, next) => {
      const { artists } = req.query;
      spotifyApi
      .searchArtists(artists)
      .then(data => {
        // console.log("The received data from the API: ", data.body.artists);
        const { items } = data.body.artists;
        res.render('artists', { items });
        // console.log(res.send.items.artists)
      })
      .catch(err => {
        throw new Error(err);
      });
});

app.get('/albums/:artistId', (req, res, next) => {
  const nId = req.params.artistId;
  spotifyApi.getArtistAlbums(nId)
  .then((data) => {
    console.log('Artist albums', data.body);
    const { items } = data.body;
      res.render('albums', { items });
    })
  .catch((err) => {
    console.log("The error while searching artists occurred: ", err);
  });
});


app.get('/tracks/:albumId', (req, res, next) => {
  const Id = req.params.albumId
  spotifyApi.getAlbumTracks(Id)
  .then((data) => {
    const { items } = data.body;
    res.render('tracks', { items });
  })
  .catch((err) => {
    console.log("The error while searching tracks occurred: ", err);
  })
})

app.listen(3001, () => console.log("My Spotify project running on port 3001 🎧 🥁 🎸 🔊"));
