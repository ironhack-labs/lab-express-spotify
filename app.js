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
  clientSecret: process.env.CLIENT_SECRET,
});

// Retrieve an access token
spotifyApi
  .clientCredentialsGrant()
  .then((data) => spotifyApi.setAccessToken(data.body['access_token']))
  .catch((error) =>
    console.log('Something went wrong when retrieving an access token', error)
  );

//Middleware for parsing JSON and form-data requests
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Our routes go here:
//Homepage
app.get('/', (req, res) => {
  res.render('index');
});

// GET /search?...
app.get('/artist-search', (req, res) => {
  console.log(`req.query`, req.query); //URL query values
  const searchedArtist = req.query.artistName; //Grab the value from the query
  console.log(searchedArtist);

  //Find the artists with searched name
  spotifyApi
    .searchArtists(searchedArtist)
    .then((data) => {
      console.log('The received data from the API: ', data.body.artists.items);
      //console.log(data.body.artists.items[0].images);
      // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
      res.render('artist-search-results', { artists: data.body.artists.items });
    })
    .catch((err) =>
      console.log('The error while searching artists occurred: ', err)
    );
});

// GET   /albums/:artistId
app.get('/albums/:artistId', (req, res, next) => {
  const artistId = req.params.artistId;

  // console.log(req.params)

  spotifyApi
    .getArtistAlbums(artistId)
    .then((data) => {
      const albums = data.body.items;
      console.log('The received data from the API: ', { albums });
      res.render('albums', { albums });
    })
    .catch((err) =>
      console.log('The error while searching albums occurred: ', err)
    );
});

//GET /albums/tracks

app.get('/tracks/:albumId', (req, res) => {
  const albumId = req.params.albumId;

  spotifyApi
    .getAlbumTracks(albumId)
    .then((data) => {
      const tracks = data.body.items;
      // console.log('The received data from the API: ', data.body.items);
      res.render('tracks', { tracks });
    })
    .catch((err) =>
      console.log('The error while searching tracks occurred: ', err)
    );
});

app.listen(3000, () =>
  console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊')
);
