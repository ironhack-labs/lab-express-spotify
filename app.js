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

app.get("/", (req,res)=> {
  res.render("index")  
})

app.get('/track/:artistId', (req, res, next) => {
  // console.log(req.query)
  spotifyApi
  .getAlbumTracks(req.params.artistId)
  .then(data => {
    console.log('The received data from the API: ', data.body);
    // console.log(data.body.artists.items[0])
    res.render("tracks", data.body)
    // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
  })
  .catch(err => console.log('The error while searching artists occurred: ', err));
});

app.get('/albums/:artistId', (req, res, next) => {
  // console.log(req.query)
  spotifyApi
  .getArtistAlbums(req.params.artistId)
  .then(data => {
    console.log('The received data from the API: ', data.body);
    // console.log(data.body.artists.items[0])
    res.render("albums", data.body)
    // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
  })
  .catch(err => console.log('The error while searching artists occurred: ', err));
});

app.get('/artist-search', (req, res, next) => {
  // console.log(req.query)
  spotifyApi
  .searchArtists(req.query.query)
  .then(data => {
    console.log('The received data from the API: ', data.body);
    // console.log(data.body.artists.items[0])
    res.render("search-results", data.body.artists)
    // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
  })
  .catch(err => console.log('The error while searching artists occurred: ', err));
});

app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
