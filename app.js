require('dotenv').config();

const express = require('express');
const hbs = require('hbs');

// require spotify-web-api-node package here:
const SpotifyWebApi = require('spotify-web-api-node');

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
    .then(data => spotifyApi.setAccessToken(data.body['access_token']))
    .catch(error => console.log('Something went wrong when retrieving an access token', error));

// Our routes go here:

app.get("/", (req, res, next) => {
    console.log("Estamos en la home page")
    res.render("home-page")
})

app.get("/artist-search", (req, res, next) => {

    const artist = req.query.artist;

  spotifyApi
  .searchArtists(artist)
  .then(data => {
    console.log(`The received data from the API: ${ artist } `, data.body.artists.items[0]);
    res.render("artist-search-results", { artist: data.body.artists.items });

  })
  .catch(err => console.log('The error while searching artists occurred: ', err));
})

app.get('/albums/:id', (req, res, next) => {
  const id = req.params.id;

  spotifyApi
  .getArtistAlbums(id)
  .then(album => {
    console.log(album.body.items[0])
    res.render("albums", { album: album.body.items })
  })
  .catch(err => console.log(err))
});

app.get('/tracks/:id', (req, res, next) => {
  const id = req.params.id;

  spotifyApi
  .getAlbumTracks(id)
  .then(track => {
    console.log(track.body.items[0])
    res.render("album-track", { track: track.body.items })
  })
  .catch(err => console.log(err))
});

/*app.get("/tracks/:id", (req, res, next) => {
  const id = req.params.id;

  spotifyApi
  .getAlbumTracks(id)
  .then(track => {
    console.log(track.body)
    res.render("album-track", { track: track.body })
  })
  .catch(err => console.log(err))
})*/

app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
