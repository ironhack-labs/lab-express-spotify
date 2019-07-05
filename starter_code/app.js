const express = require('express');
const hbs = require('hbs');
const path = require('path');

// require spotify-web-api-node package here:
const SpotifyWebApi = require('spotify-web-api-node');


const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));
hbs.registerPartials(__dirname + '/views/partials');

// setting the spotify-api goes here:
// Remember to insert your credentials here
const clientId = '51c80b2fd39446a7857707f48efe4c60',
  clientSecret = '1fd16d1d58dc40bfa24a9d7c9847bac6';

const spotifyApi = new SpotifyWebApi({
  clientId: clientId,
  clientSecret: clientSecret
});

// Retrieve an access token
spotifyApi.clientCredentialsGrant()
  .then(data => {
    spotifyApi.setAccessToken(data.body['access_token']);
  })
  .catch(error => {
    console.log('Something went wrong when retrieving an access token', error);
  })

// the routes go here:
app.get('/', (req, res, next) => {
  res.render('index');
});

app.get('/artists', (req, res, next) => {
  const { artist } = req.query; // use destructuring to access the information 
  spotifyApi.searchArtists(artist) // the "artist" we are using in the dot notation is the same thing as the the form we used in index
    .then((data) => {
      console.log(data.body.artists.items);
      res.render('artists', { artist: data.body.artists.items });// use the data.body and access the information, pass it as an argument and use this
    })
    .catch((err) => {
      console.log('The error while searching artists occurred: ', err);
    });
});

app.get('/albums/:artistId', (req, res, next) => {
  const { artistId } = req.params;
  spotifyApi.getArtistAlbums(artistId)
    .then((data) => {
      console.log(data.body.items);
      res.render('albums', { artistId: data.body.items });
    })
    .catch((err) => {
      console.log('The error while searching artists occurred: ', err);
    });
});

app.get('/albums/:artistId/:track', (req, res, next) => {
  const { track } = req.params;
  spotifyApi.getAlbumTracks(track)
    .then((data) => {
      res.render('tracks', { track: data.body.items });
    })
    .catch((err) => {
      console.log('The error while searching artists occurred: ', err);
    });
});

app.listen(4000, () => console.log("Charging lasers!"));
