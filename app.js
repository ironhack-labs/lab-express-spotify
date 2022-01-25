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



// Our routes :
app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));


app.get('/', (req, res) => {
    res.render('index');
  });


app.get('/artist-search', (req, res,next) => {
  const xxx = req.query.artistName 
  spotifyApi
  .searchArtists(xxx)
  .then(data => {
    // use console log to check what's inside the array of objects
    console.log('The received data from the API: ', data.body.artists.items[0]);

    // on the page artists display the search results
    res.render("artistPage",{artistsData : data.body.artists.items});
  })
  .catch(err => console.log('The error while searching artists occurred: ', err));
});  
  

app.get('/albums/:pepeId', (req, res, next) => {
  spotifyApi
  .getArtistAlbums(req.params.pepeId)
  .then(data => {
    // use console log to check what's inside the array of objects
    console.log('The received data from the API: ', data.body.items[0]);

    // on the page albums display the  results
    res.render("albumsPage", {albumData : data.body.items});
  })
  .catch(err => console.log('The error while searching artists occurred: ', err));
});


app.get('/canciones/:pacoId', (req, res, next) => {
  spotifyApi
  .getAlbumTracks(req.params.pacoId)
  .then(data => {
    // use console log to check what's inside the array of objects
    console.log('The received data from the API: ', data.body.items);

    // on the page canciones display the  results
    res.render("cancionesPage", {cancionesData : data.body.items});
  })
  .catch(err => console.log('The error while searching artists occurred: ', err));
});

