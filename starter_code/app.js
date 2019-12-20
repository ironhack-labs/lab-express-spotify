require('dotenv').config();

const express = require('express');
const hbs = require('hbs');

// require spotify-web-api-node package here:
const SpotifyWebApi = require('spotify-web-api-node'); 

const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));
//USAR PARTIALS 

// setting the spotify-api goes here:
const spotifyApi = new SpotifyWebApi({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET
});

// Retrieve an access token
spotifyApi
  .clientCredentialsGrant()
  .then(data => {
    spotifyApi.setAccessToken(data.body['access_token']);
  })
  .catch(error => {
    console.log('Something went wrong when retrieving an access token', error);
  });

// the routes go here:
//INDEX
app.get('/', (req, res, next) => {
  res.render('index');
});

//ARTISTS
app.get('/artists', (req, res, next) => {
  spotifyApi
  .searchArtists(req.query.artists)
  .then(data => {
    const {items} = data.body.artists //aqui eu desconstruí 
    //console.log('The received data from the API: ', items);
    // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
    res.render('artists', {items})
  })
  .catch(err => {
    console.log('The error while searching artists occurred: ', err);
  });
})

//ALBUMS 
app.get('/albums/:artistId', (req, res, next) => {
  spotifyApi
  .getArtistAlbums(req.params.artistId)
  .then(data => {
    //res.send(data.body) //USO ISSO PRA VER TODOS MEUS DADOS 
    const {items} = data.body;
    console.log('Artist albums', data.body);
    res.render('albums', {items})
  })
  .catch(err => {
    console.error(err);
  });
});

// app.get('/tracks/:albumID', (req, res, next) => {
//   spotifyApi.getAlbumTracks('41MnTivkwTO3UUJ8DrqEJJ', { limit : 5, offset : 1 })
//   .then(data => {
//     console.log(data.body);
//   }, function(err) {
//     console.log('Something went wrong!', err);
//   });
 
// });

app.listen(3000, () =>
  console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊')
);
