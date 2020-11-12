require('dotenv').config();

const express       = require('express');
const hbs           = require('hbs');

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
app.get('/', (req, res, next)=>{
    res.render('home');
});

app.get('/artist-search', (req, res, next)=>{
    spotifyApi
    .searchArtists(req.query.searchArtists)
    .then(data=>{
        // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
        res.render('artist-search-results', {artists: data.body.artists.items})
        console.log('The received data from the API: ', data.body);
        
    })
    
    .catch(err => console.log('The error while searching artists occurred: ', err));
})


app.get('/albums/:id', (req, res, next)=>{
    spotifyApi
    .getArtistAlbums((req.params.id))
    .then(
      function(data) {
        console.log('Album information', data.body);
      },
      function(err) {
        console.error(err);
      }
    );
})


app.get('/view-tracks/:id', (req, res, next)=>{
    spotifyApi
    .getAlbumTracks((req.params.id))
    .then(
      function(data) {
        res.render('albums', { albums: albums.body.items })

        console.log('Track information', data.body);
      },
      function(err) {
        console.error(err);
      }
    );
})

app.listen(process.env.PORT, () => console.log(`My Spotify project running on port ${process.env.PORT}3000 🎧 🥁 🎸 🔊`));
