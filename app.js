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

// Our routes go here:


app.get('/', (req, res) => {
  res.render('home');
});



app.get('/artist-search', (req, res) => {

  spotifyApi
  .searchArtists(req.query.search)
  .then(data => { res.render('artist-search-results', {artists: data.body.artists.items})
    console.log('The received data from the API: ', data.body.artists.items);
  })
  .catch(err => console.log('The error while searching artists occurred: ', err));
});





app.get('/albums/:artistId', (req, res, next) => {

  const id = req.params.artistId // artistId porque é o que vem a seguir as ":" dentro do get

  spotifyApi
  .getArtistAlbums(id)
  .then(data => { res.render ("albums", {albums: data.body.items})
    /* console.log('Album information', data.body); */
  },)

  .catch(err => console.log('The error while searching artists occurred: ', err))
});

app.get('/tracks/:albumId', (req, res, next) => {

  const id = req.params.albumId 

  spotifyApi
  .getArtistAlbums(id)
  .then(data => { res.render ("tracks", {albumTracks: data.body.items})
    console.log('Album information', data.body);
  },)

  .catch(err => console.log('The error while searching artists occurred: ', err))
});


app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
