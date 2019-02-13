const express = require('express');
const hbs = require('hbs');

// require spotify-web-api-node package here:
const SpotifyWebApi = require('spotify-web-api-node');


const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));


// setting the spotify-api goes here:
// Remember to insert your credentials here
const clientId = '0354173528464fa0a696ba04e24f1cda',
    clientSecret = 'f1a8b05914964bc4b3e11ff545b2a039';

const spotifyApi = new SpotifyWebApi({
  clientId : clientId,
  clientSecret : clientSecret
});

// Retrieve an access token
spotifyApi.clientCredentialsGrant()
  .then( data => {
    spotifyApi.setAccessToken(data.body['access_token']);
  })
  .catch(error => {
    console.log('Something went wrong when retrieving an access token', error);
  })





// the routes go here:
app.get('/', (req, res, next) => {
  res.render('home');
});


app.get('/artists', (req, res, next) => {
  spotifyApi.searchArtists(req.query.artist)
    
  .then(data =>{
      console.log("The received data from the API: ", data.body.artists.items);
      // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
       //res.send(data.body);
       
        res.render('artists', {myArtists: data.body.artists.items});
    
 
    })
    .catch(err => {
      console.log("The error while searching artists occurred: ", err);
    })
});

app.get('/albums/:artistId', (req, res, next) => {
  spotifyApi.getArtistAlbums(req.params.artistId)
  .then(function(data) {
    console.log('Artist albums', data);
   //res.send(data.body);
   res.render('albums', {artistAlbums: data.body.items});
  },
  
  function(err) {
    console.error(err);
  });
});

app.get('/tracks/:albumId', (req, res, next) => {
  spotifyApi.getAlbumTracks(req.params.albumId)
  .then(function(data) {
    console.log('Album tracks', data);
   //res.send(data.body);
   res.render('tracks', {albumTracks: data.body.items});
  },
  
  function(err) {
    console.error(err);
  });
});



app.listen(3000, () => console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊"));
