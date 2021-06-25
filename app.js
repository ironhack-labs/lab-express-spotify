require('dotenv').config();

const express = require('express');
const hbs = require('hbs');
const SpotifyWebApi = require('spotify-web-api-node')

// require spotify-web-api-node package here:

const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET
  });
  
  // Retrieve an access token
  spotifyApi
    .clientCredentialsGrant()
    .then(data => spotifyApi.setAccessToken(data.body['access_token']))
    .catch(error => console.log('Something went wrong when retrieving an access token', error));

const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

// setting the spotify-api goes here:

// Our routes go here:


app.get('/', (req, res) => {
    res.render('index');
  });

/* app.get('/artist-search', (req, res) => {
    const artist = req.query["artistName"]
    res.render('artist-name', {artist});
  }); */


app.get('/artist-search', (req, res) => {
    spotifyApi.searchArtists(req.query['artistName'])
    .then(data => {
      console.log('The received data from the API: ', data.body.artists.items);
      res.render('artist-search-results', {artistList: data.body.artists.items});
    })
    .catch(err => console.log('The error while searching artists occurred: ', err));
  

  });



app.get('/albums/:artistId', (req, res, next) => {
    spotifyApi.getArtistAlbums(req.params.id)
    .then(oneArtist => res.render('albums', {artistList: oneArtist.body.artists.items}))
    .catch(error => console.log(error))
  });




app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));




















/* Client ID 11b1e3b360b2451190e46665002ce25a
Client Secret 098514a92d6147c18ec2c5c1d9d7e60d */