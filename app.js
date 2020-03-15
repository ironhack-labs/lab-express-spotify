require('dotenv').config();

const express = require('express');
const hbs = require('hbs');

// require spotify-web-api-node package here:
const SpotifyWebApi = require('spotify-web-api-node');

const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));
hbs.registerPartials(__dirname + '/views/partials');

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
app.get('/', function (req, res) {
    res.render('index');
});

app.get("/artist-search", (req, res, next) => {
  spotifyApi
    .searchArtists(req.query.artist)
    .then(data => {
      let artItems = data.body.artists.items;
      res.render("artist-search", {artItems});
    })
    .catch(err =>
      console.log("The error while searching artists occurred: ", err)
    );
});
app.get('/album-search/:id', (req, res) => {
  spotifyApi.getArtistAlbums(req.params.id)
  .then(albums => {
    res.render('album-search',{ albums: albums.body.items })
})
.catch(error => console.log(error));
})

app.get('/tracks/:id', (req, res) => {
  spotifyApi.getAlbumTracks(req.params.id)
  .then(tracks => {
    console.log(tracks.body.items);
    res.render('tracks',{ tracks: tracks.body.items })
})
.catch(error => console.log(error));
})


app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));