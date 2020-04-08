require('dotenv').config();

const express = require('express');
const hbs = require('hbs');
const SpotifyWebApi = require('spotify-web-api-node');

// require spotify-web-api-node package here:

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

//route for home.hbs
app.get('/', function (req, res) {
    res.render('home')
  })

//route for artist-search-results.hbs
  app.get('/artist-search', (req, res, next) => {
    spotifyApi
    .searchArtists(req.query.artist)
    .then(dataFromApi => {
    //console.log('The received data from the API: ', dataFromApi.body.artists);
    res.render('artist-search-results', {data : dataFromApi.body.artists.items})
    })
    .catch(err => console.log('The error while searching artists occurred: ', err));
  })


//dynamic route for albums.hbs

app.get('/albums/:artistId', (req, res, next) => {
  // .getArtistAlbums() code goes here
  spotifyApi
  .getArtistAlbums(req.params.artistId)
  .then((albumsFromApi) => {
    //console.log("I found some albums", albumsFromApi.body.items)
    res.render('albums', { albums : albumsFromApi.body.items })
  })
  .catch((err) => console.log('The error while searching album occured: ', err))
});

//dynamic route for tracks.hbs

app.get('/albums/:artistName/:albumId', (req, res, next) => {
  spotifyApi
  .getAlbumTracks(req.params.albumId)
  .then((tracksFromApi) => {
    //console.log("I found some tracks", tracksFromApi.body)
    res.render('tracks',{ tracks :tracksFromApi.body.items })

  })
  .catch((err) => console.log('The error while searching the tracks occured: ', err))
})




// Server listening

app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
