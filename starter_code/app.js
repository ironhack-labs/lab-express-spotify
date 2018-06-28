const PORT = 3000;
const express = require('express');
const app = express();
const path = require('path');
const SpotifyWebApi = require('spotify-web-api-node');
const hbs = require('hbs');

app.set('views', path.join(__dirname, '/views'));
app.set('view engine', 'hbs');

hbs.registerPartials(__dirname + '/views/partials');

require('./configs/db.config');

const clientId = '2b134e304e014da0ba5e0f00ef53a755';
const clientSecret = 'ebc97cb8e18845c88c9474199b25d7ef';

var spotifyApi = new SpotifyWebApi({
  clientId : clientId,
  clientSecret : clientSecret
});

// Retrieve an access token.
spotifyApi.clientCredentialsGrant()
  .then(function(data) {
    spotifyApi.setAccessToken(data.body['access_token']);
  }, function(err) {
    console.log('Something went wrong when retrieving an access token', err);
});

// Routing
app.get('/', (req, res, next) => {
  res.render('home');
});

app.get('/artists', (req, res, next) => {  
  spotifyApi.searchArtists(req.query.name)
    .then(data => {                  
      res.render('artists', { artists: data.body.artists.items });
    })
    .catch(err => {
      res.send(err);
    });
});

app.get('/albums/:artistId', (req, res, next) => {
  spotifyApi.getArtistAlbums(req.params.artistId)
    .then(data => {           
      res.render('albums', { albums: data.body.items });
    })
    .catch(err => {
      res.send(err);
    });
});

app.get('/albums/tracks/:albumId', (req, res, next) => {
  spotifyApi.getAlbumTracks(req.params.albumId)
  .then(data => {           
    console.log("Tracks", data.body.items);
    res.render('tracks', { tracks: data.body.items });
    })
    .catch(err => {
      res.send(err);
    });
});

app.listen(PORT, () => console.log(`Listening on ${PORT}`));


// { 
//   body: { 
//     href:
//      'https://api.spotify.com/v1/artists/0lk9ZWji6LAxpqlfcXMspP/albums?offset=0&limit=20&include_groups=album,single,compilation,appears_on',
//     items: [ [Object] ],
//     limit: 20,
//     next: null,
//     offset: 0,
//     previous: null,
//     total: 1 
//   },
//   headers: {
//     'content-type': 'application/json; charset=utf-8',
//     'cache-control': 'public, max-age=7200',
//     'access-control-allow-origin': '*',
//     'access-control-allow-headers': 'Accept, Authorization, Origin, Content-Type, Retry-After',
//     'access-control-allow-methods': 'GET, POST, OPTIONS, PUT, DELETE, PATCH',
//     'access-control-allow-credentials': 'true',
//     'access-control-max-age': '604800',
//     'content-encoding': 'gzip',
//     date: 'Thu, 28 Jun 2018 09:29:54 GMT',
//     via: '1.1 google',
//     'alt-svc': 'clear',
//     connection: 'close',
//     'transfer-encoding': 'chunked' 
//   },
//   statusCode: 200 
// }