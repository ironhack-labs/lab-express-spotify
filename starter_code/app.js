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
  .then(data => {
    spotifyApi.setAccessToken(data.body['access_token']);
  })
  .catch(error => {
    console.log('Something went wrong when retrieving an access token', error);
  });

// the routes go here:

app.get('/', (req, res, next) => {
  res.render('index');
});

app.get('/artists', (req, res, next) => {
  spotifyApi
  .searchArtists(req.query.search)
  .then(data => {
    console.log('The received data from the API: ', data.body);
    // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
    let artists = data.body.artists.items;
    // render the page with all the info related to that artist
    // res.send(artists);
    res.render('artists', { artists })
  })
  .catch(err => {
    console.log('The error while searching artists occurred: ', err);
  });
});

app.get('/albums/:artistId', (req, res, next) => {
  spotifyApi
  .getArtistAlbums(req.params.artistId)
  .then(data => {
    console.log('The received data from the API: ', data.body);
    // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
    let albums = data.body.items;
    // render the page with all the info related to that artist
    // res.send(albums);
    res.render('albums', { albums })
  })
  .catch(err => {
    console.log('The error while searching artists occurred: ', err);
  });
});

app.get('/tracks/:albumId', (req, res, next) => {
  spotifyApi
  .getAlbumTracks(req.params.albumId)
  .then(data => {
    console.log('The received data from the API: ', data.body);
    // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
    let tracks = data.body.items;
    // render the page with all the info related to that artist
    // res.send(data.body.items);
    res.render('tracks', { tracks })
  })
  .catch(err => {
    console.log('The error while searching artists occurred: ', err);
  });
});


app.listen(3000, () =>
  console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊')
);