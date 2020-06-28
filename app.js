require('dotenv').config();

const express = require('express');
const hbs = require('hbs');

// require spotify-web-api-node package here:
const SpotifyWebApi = require('spotify-web-api-node');

const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

// Register the location for handlebars partials here:
hbs.registerPartials(__dirname + '/views/partials');
// ...

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
app.get('/', (req, res) => {
  res.render('index');
});

app.get('/artist-search', (req, res, next) => {
  console.log(req);
  spotifyApi
  .searchArtists(req.query.artist)/*'HERE GOES THE QUERY ARTIST'*/
  .then(data => {
    console.log('The received data from the API: ', data.body);
    // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
    const artistInfo = data.body.artists.items
    console.log(artistInfo);
    res.render('artist-search-results', {artists: artistInfo})
  })
  .catch(err => console.log('The error while searching artists occurred: ', err));  
})

app.get('/albums/:artistId', (req, res, next) => {
  // .getArtistAlbums() code goes here
  spotifyApi
  .getArtistAlbums(req.params.artistId)/*'HERE GOES THE ALBUM'*/
  .then(data => {
    console.log('The received data from the API: ', data.body);
    // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
    const albums = data.body.items
    res.render('albums', {albums: albums})
  })
  .catch(err => console.log('The error while searching albums occurred: ', err)); 
});

app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
