require('dotenv').config();

const express = require('express');
const hbs = require('hbs');
// require spotify-web-api-node package here:
const SpotifyWebApi = require('spotify-web-api-node');
const spotifyApi = new SpotifyWebApi({
    clientId: "d0fc1bbf0ff14c4ea00171b71f2a058f",
    clientSecret: "1cfcf5510d084ad5b550487c2668d79f"
  });

const app = express();


app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

// setting the spotify-api goes here:

  
// Retrieve an access token

spotifyApi
  .clientCredentialsGrant()
  .then(data => spotifyApi.setAccessToken(data.body['access_token']))
  .catch(error => console.log('Something went wrong when retrieving an access token', error));

// Our routes go here:

app.get('/', (req, res) => res.render('index'));
app.get('/layout', (req, res) => res.render('layout'));
app.get('/artist-search', (req, res) => {
    
    spotifyApi
    .searchArtists(req.query.search)
    .then(data => {
      console.log('The received data from the API: ', data.body);
      const artist = data.body.artists.items;
      res.render('artist-search-results', {artist}) 
    })
    .catch(err => console.log('The error while searching artists occurred: ', err));
})

app.get('/albums/:artistId', (req, res, next) => {
    const albums = req.params.artistId
    spotifyApi
        .getArtistAlbums(albums)
        .then(data => {
            res.render('albums', {albums})
        })
        .catch(err => console.log('An error occured while searching albums: ', err));
})
app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
