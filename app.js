require('dotenv').config();

const express = require('express');
const hbs = require('hbs');
const app = express();

// require spotify-web-api-node package here:
const SpotifyWebApi = require('spotify-web-api-node');
//=======================================================

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

// setting the spotify-api goes here:
console.log(process.env.CLIENT_ID, process.env.CLIENT_SECRET)
const spotifyApi = new SpotifyWebApi({
    clientId: 'a8f777b386fa4f66a4abc18fbb346670',
    clientSecret: '01573a19d62b4623a6e38fe2d40849ac'
});

// -------------------------------------------------
spotifyApi
  .clientCredentialsGrant()
  .then(data => spotifyApi.setAccessToken(data.body['access_token']))
  .catch(error => console.log('Something went wrong when retrieving an access token', error));

// Retrieve an access token ************
// Our routes go here:

app.get("/", (req, res) => {
    res.render("index");
  }); 

  app.get("/artist-search", (req, res) => {
    //console.log({ searchQuery: req.query.search })
    spotifyApi
  .searchArtists(req.query.search)
  .then(data => {
    console.log('The received data from the API: ', data.body);
    res.render("artist-search-results", {data: data.body.artists})
  })
  .catch(err => console.log('The error while searching artists occurred: ', err));
  })

// iteration 4
  app.get('/albums/:artistId', (req, res) => {
    //console.log('esto es lo que estamos buscando', req.params.artistId);
    spotifyApi
    .getArtistAlbums(req.params.artistId)
    .then(data => {
      res.render('albums', data.body.items);
    })
    .catch(err => console.log('The error while searching album occurred: ', err));
  });

 // iteration 5
 app.get('/albums/:albumId/tracks', (req, res) => {
  //console.log('esto es lo que estamos buscando', data.body);
 spotifyApi
 .getAlbumTracks(req.params.albumId)
  .then(data => {
    const tracks = data.body.items;
    console.log('Tracks', tracks);
    res.render('tracks', {tracks})
  })
  .catch(err => console.log('The error while searching tracks occurred: ', err));
  
});


app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
