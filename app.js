require('dotenv').config();

const express = require('express');
const hbs = require('hbs');
var SpotifyWebApi = require('spotify-web-api-node');

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
app.get("/", (req, res) => {
  res.render("index");
});

app.get('/artist-search', (req, res) => {
  // console.log(req.query)
  const { artistName } = req.query;


  spotifyApi
    .searchArtists(req.query.artistName)
    .then(data => {
      const { items } = data.body.artists;
      res.render('artist-search-results', { artists: items });
    })
    .catch(err => console.log('The error while searching artists occurred: ', err));
});
app.get('/albums/:id', (req, res) => {
  console.log("PARAMS:", req.params);
  const { id } = req.params;

  spotifyApi.getArtistAlbums(id)
    .then(data => {
      //   console.log(data.body.items); //point of reference to see what body contains
      const { items } = data.body;
      //   console.log(items[0].images) // point of reference to see how images looks

      res.render("albums", { albums: items })
    })
    .catch(err => console.log('The error while searching albums occurred: ', err));
})

app.get("/tracks/:albumId", (req, res) => { //const has to match
  const { albumId } = req.params;

  spotifyApi.getAlbumTracks(albumId)
    .then(data => {
      const { items } = data.body;

      res.render("tracks", { tracks: items });
    })
    .catch(err => console.log('The error while searching tracks occurred: ', err));

})

app.listen(3010, () => console.log('My Spotify project running on port 3010 🎧 🥁 🎸 🔊'));
