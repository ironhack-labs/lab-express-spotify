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
    clientId:process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET
});

// Retrieve an access token
spotifyApi
.clientCredentialsGrant()
.then( data => spotifyApi.setAccessToken(data.body['access_token']))
.catch( error => console.log('Something went wron when retrieving an acess token', error));

// Our routes go here:

// step 1 | create a homepage . You'll need a basic index route
// that renders a home page
app.get('/', (request, response, next) => {
    response.render('home')
});
 // step 2 | display results for artist search
app.get('/artist-search', (request, response , next) =>{
    // response.send( request.query);
    const artist = request.query.artistName;
    // destructured:
    // const {artistName} =request.query;
    spotifyApi
    .searchArtists(artist)
    .then( (data) => {
        console.log('data received from API:', data.body.artists.items[0]);
        response.render('artist-search-results', {artists: data.body.artists.items});
    })
    .catch( (error) => {
        console.log('Error ocurred while searching artists.', error);
    });
});
   // view albums 

   app.get('/albums/:theId', (request, response) => {
    // response.send(request.params)
     const {theId} = request.params
   
      spotifyApi
      .getArtistAlbums(theId)
      .then( (data) => {
        console.log('Artist albums', data.body.items);
        response.render('albums', {albums: data.body.items});
      })
      .catch( error => console.log('Something went wrong getting the artist album', error));
   });
   
   // view tracks

   app.get('/tracks/:theId', (request, response) => {
     
       const {theId} = request.params;
       spotifyApi
       .getAlbumTracks(theId)
       .then( (data) => {
        console.log('Data received from API:', data.body.items);
        response.render('tracks', {tracks: data.body.items});
       })
   })


app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
