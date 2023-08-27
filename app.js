require('dotenv').config();

const express = require('express');
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

  spotifyApi
  .clientCredentialsGrant()
  .then(data => spotifyApi.setAccessToken(data.body['access_token']))
  .catch(error => console.log('Something went wrong when retrieving an access token', error));

// Our routes go here:
app.get('/', (req, res) => {
    res.render('index');
  });

app.get('/artist-search', (req, res) => {
    const artist = req.query.artist; // Get the artist query parameter from the request URL
  
    spotifyApi
      .searchArtists(artist) // Pass the artist query parameter to the searchArtists method
      .then(data => {
        const artists = data.body.artists.items; // Get the array of artists from the response
        console.log('The received data from the API:', data.body);
        // Render the artist-search-results view and pass the search results to it
        res.render('artist-search-results', { artists });
      })
      .catch(err => {
        console.log('The error while searching artists occurred:', err);
        res.send('Error occurred while searching artists');
      });
});

app.get('/albums/:artistId', (req,res) => {
    const artistId = req.params.artistId;
  
    spotifyApi
      .getArtistAlbums(artistId)
      .then(data => {
        const albums = data.body.items;
        res.render('albums', { albums });
      })
      .catch(err => console.log('The error while retrieving artist albums occurred: ', err));

});

app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
