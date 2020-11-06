require('dotenv').config();

const express = require('express');
const hbs = require('hbs'); //fazer ficheiro layout.hbs no views SEMPRE


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

app.get('/', (req, res) => {
    res.render('index'); //entry point for express application
})


app.get('/artist-search', (req, res) => { 
   console.log('Searching artists') 
   // console.log(req.query);
    let artistSearch = req.query.artistSearch;
    spotifyApi.searchArtists(artistSearch)
  .then(data => {
    let results = data.body.artists.items;
    console.log('The received data from the API: ', data.body);
    res.render('artist-search-results', {results});
 
})
  .catch(err => console.log('The error while searching artists occurred: ', err))
});

app.get('/albums/:artistId', (req, res) => { 
    console.log('Searching albums') 
     spotifyApi.getArtistAlbums(req.params.artistId)
   .then(data => {
       let albumResults = data.body.items;
       console.log('The received data from the API: ', data.body);
       res.render('albums', {albums: albumResults});
         
 })
   .catch(err => console.log('The error while searching artists occurred: ', err))
 });
 

 app.get('/tracks/:albumId', (req, res) => { 
    console.log('Searching tracks') 
    // console.log(req.query);
    spotifyApi.getAlbumTracks(req.params.albumId)
   .then(data => {
       let trackResults = data.body.items;
       console.log('The received data from the API: ', data.body);
       res.render('tracks', {tracks: trackResults});
         
 })
   .catch(err => console.log('The error while searching artists occurred: ', err))
 });
 
 




app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
