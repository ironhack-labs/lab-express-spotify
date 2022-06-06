require('dotenv').config();


const express = require('express');
const res = require('express/lib/response');
const hbs = require('hbs');
const SpotifyWebApi = require('spotify-web-api-node');

const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

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
app.get('/', (req, res, next) => {
  res.render('home')
})

app.get('/artist-search', (req, res, next) => {
  spotifyApi
  .searchArtists(req.query.artist)
  .then(data => {
    res.render('artist-search-results', data.body.artists)
  })
  .catch(err => console.log('The error while searching artists occurred: ', err));
})


app.get('/albums/:id',(req,res,next) =>{
  spotifyApi.getArtistAlbums(req.params.id)
  .then( data => {
      console.log('Artist albums', data.body);
      res.render('albums',data.body)
    })
    .catch(err => console.log('The error while searching artists occurred: ', err));
})


// spotifyApi.getAlbumTracks('41MnTivkwTO3UUJ8DrqEJJ', { limit : 5, offset : 1 })



app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
