require('dotenv').config();

const express = require('express');
const hbs = require('hbs');
// require spotify-web-api-node package here:
const SpotifyWebApi = require('spotify-web-api-node');

const app = express();

app.set("views", __dirname + "/views");
hbs.registerPartials(__dirname + "/views/partials")
app.set("view engine", "hbs");


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

app.get("/", (req, res, next) => res.render('home'));

app.get('/artist-search', (req, res, next) => {
  // console.log(req.query["artist-search"])
  spotifyApi
  .searchArtists(req.query["artist-search"])
  .then(data => {
    let artists = data.body.artists
    // console.log('The received data from the API: ', artists)
    res.render('artist-search-results', artists)
    // console.log(artists.items[0].images[0])
  })
  .catch(err => console.log('The error while searching artists occurred: ', err));
  
})

app.get('/albums/:artistId', (req, res, next) => {
  spotifyApi
  .getArtistAlbums(req.params.artistId)
  .then(data => {
    // console.log('Artist albums', data.body);
    res.render('albums', data.body)
  })
  .catch(err => console.log('The error while getting an album occurred: ', err));
  
})

app.get('/tracks/:albumId', (req, res, next) => {
  spotifyApi
  .getAlbumTracks(req.params.albumId)
  .then(data => {
    // console.log('Album tracks', data.body);
    res.render('tracks', data.body)
  })
  .catch(err => console.log('The error while getting an album occurred: ', err));
  
})

app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
