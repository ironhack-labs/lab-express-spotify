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

app.get("/", (req, res, next) => {
  res.render("home")
});

app.get("/artist-search", (req, res, next) => {
  const artist = req.query.search;
  spotifyApi
  .searchArtists(artist)
  .then(data => res.render("artist-search", {artists:data.body.artists.items}))
  .catch(error => console.log('Something went wrong when retrieving an access token', error));
  console.log(artist);
})

app.get('/album/:id', (req, res) => {
  const id = req.params.id;
  spotifyApi.getArtistAlbums(id).then(data => {
    res.render('album', {
      album: data.body.items
    })
  })
  .catch(err => console.log('The error while searching artists occurred: ', err));
});

app.get('/tracks/:id', (req, res) => {
  const id = req.params.id;
  console.log(id);
  
  spotifyApi.getAlbumTracks(id).then(data => {
    console.log(data.body.items)
    res.render('tracks', {
      track: data.body.items
    })
  })
  .catch(err => console.log('The error while searching artists occurred: ', err));
})

app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
