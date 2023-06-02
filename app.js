require('dotenv').config();

const express = require('express');
const hbs = require('hbs');

// require spotify-web-api-node package here:
const SpotifyWebApi = require('spotify-web-api-node');
const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));


app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

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

    
app.get('/', (req, res) => {
  res.render('index')
})

app.get('/artist-search', (req, res) => {
 const artist = req.query.artist;
 spotifyApi
 .searchArtists(artist)
 .then(data => {
   const artists = data.body.artists.items.map(artist => ({
     id: artist.id,
     name: artist.name,
     image: artist.images.length > 0 ? artist.images[0].url : 'image.png',
   }));
   res.render('artist-search-results', { artists });
 })
 .catch(err => {
  console.log('The error while searching artists occurred: ', err);
});
});

app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
