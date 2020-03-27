require('dotenv').config();

const express = require('express');
const hbs = require('hbs');
const app = express();

const SpotifyWebApi = require('spotify-web-api-node');

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



app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

// setting the spotify-api goes here:


// Our routes go here:
app.get('/', (req, res) => {
    res.render('index')
});


app.get('/artist-search', (req, res) => {

    spotifyApi
  .searchArtists(req.query.artistName)
  .then(data => {

    const artistName = data.body.artists.items;
    //console.log('The received data from the API: ', data.body.artists.items.images);
    res.render('artist-search', {artistName});
    
    // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
  })
  .catch(err => console.log('The error while searching artists occurred: ', err));
  
})


app.get('/albuns/:artistID', (req, res, next) => {

    spotifyApi
    .getArtistAlbums(req.params.artistID)
    .then(function(data) {
        //console.log(data.body.items);
        const artistAlbum = data.body.items;
        res.render('albuns', {artistAlbum});
          //console.log('Artist albums', data.body);
        },
        function(err) {
          console.error("ALBUNS", err);
        }
      );
});

app.get('/tracks/:artistTracksID', (req, res, next) =>{

    spotifyApi
    .getAlbumTracks(req.params.artistTracksID, { limit : 5, offset : 1 })
    .then(function(data) {
      
        //console.log(data.body);
        const artistTracks = data.body.items;
        res.render('tracks', {artistTracks});

    }, function(err) {
      console.log('Something went wrong!', err);
    });
});



app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
