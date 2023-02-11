require('dotenv').config();

const express = require('express');
const hbs = require('hbs');

// require spotify-web-api-node package here:
const SpotifyWebApi = require('spotify-web-api-node');

const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

const spotifyApi = new SpotifyWebApi({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
});

// Retrieve an access token
spotifyApi
  .clientCredentialsGrant()
  .then((data) => spotifyApi.setAccessToken(data.body['access_token']))
  .catch((error) => console.log('Something went wrong when retrieving an access token', error));


// Our routes go here:

// iteration 3 

app.get('/', (req, res) => {
    res.render('home')
})


// Iteration 4


app.get('/artist-search', (req, res) => {
spotifyApi
.searchArtists(req.query.artist)   // you are doing a request to retrieve the artist name (query)
.then(data => {
    console.log('The received data from the API: ', data.body.artists.items); // where do we get this (?)
    // ----> 'HERE'S WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
    const allArtists = data.body.artists.items   // you have to create a variable to display it as an object
    res.render('artist-search-results', {allArtists})   // this is when we are going to display the content on the screen
  })
  .catch(err => console.log('The error while searching artists occurred: ', err));

})

app.get('/albums/:artistId', (req, res, next) => {
    // .getArtistAlbums() code goes here
  });



app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));



