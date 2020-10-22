require('dotenv').config();

const express = require('express');
const hbs = require('hbs');
const SpotifyWebApi = require('spotify-web-api-node');

const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));
hbs.registerPartials(__dirname + '/views/partials');

// Spotify API
const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET
});

// Retrieve an access token
spotifyApi
    .clientCredentialsGrant()
    .then(data => spotifyApi.setAccessToken(data.body['access_token']))
    .catch(error => console.log('Something went wrong when retrieving an access token', error));

// Index route
app.get('/', (req, res, next) => {
    res.render('index');
});

// Artist search route
app.get("/artist-search", (req, res, next) => {
    let { artistName } = req.query;
    spotifyApi.searchArtists(artistName).then(data => {
        console.log('The received data from the API: ', data.body);
        const artists = data.body.artists.items;
        res.render("artist-search-results", { artists });
    }).catch(err => console.log('The error while searching artists occurred: ', err));
});
 
// Albums search route
app.get('/albums/:artistId', (req, res, next) => {
    const { artistId } = req.params;
    spotifyApi.getArtistAlbums(artistId).then(
        function(data) {
          console.log('Artist albums', data.body);
          const albums = data.body.items;
          res.render("albums", { albums });
        },
        function(err) {
          console.error(err);
        }
      );
});

// Tracks route
app.get('/albums/tracks/:albumId', (req, res, next) => {
    const { albumId } = req.params;
    console.log("Album ID is: ", albumId);
    spotifyApi.getAlbumTracks(albumId, { limit : 25, offset : 1 })
    .then(function(data) {
      console.log(data.body);
      const tracks = data.body.items;
      res.render("tracks", { tracks });
    }, function(err) {
      console.log('Something went wrong!', err);
    });
});

app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
