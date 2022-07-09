require('dotenv').config();

const express = require('express');
const hbs = require('hbs');
const SpotifyWebApi = require('spotify-web-api-node');

const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

// setting the spotify-api goes here:
const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
  //  redirectUri: 'http://www.example.com/callback'
  });

  // Retrieve an access token
spotifyApi
  .clientCredentialsGrant()
  .then(data => spotifyApi.setAccessToken(data.body['access_token']))
  .catch(error => console.log('Something went wrong when retrieving an access token', error));


// Our routes go here:

app.get("/", (req, res) => {
  res.render("home");
});

app.get("/artist-search/", (req, res) => {
  spotifyApi.searchArtists(req.query.artistSearch)
  .then(data => {
//    console.log('The received data from the API: ', data.body.artists.items);

    res.render("artist-search",{"artistArr" : data.body.artists.items});
    // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
  })
  .catch(err => console.log('The error while searching artists occurred: ', err));     
});

app.get('/albums/:artistId', (req, res) => {
  // .getArtistAlbums() code goes here
  spotifyApi.getArtistAlbums('43ZHCT0cAZBISjO8DG9PnE')
  //spotifyApi.getArtistAlbums(req.params.artistId)
  .then((data) => {
    console.log('Artist albums', data.body.items);
    res.render("albums",{"albumArr" : data.body.items});
  })
  .catch((err => console.error('Error while getting artists albums:',err)))
});




app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
