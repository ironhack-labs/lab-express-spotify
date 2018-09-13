const express = require('express');
const app = express();
const hbs = require('hbs');
const path    = require('path');
const SpotifyWebApi = require('spotify-web-api-node');
const clientId = '4d0b285637214693a59ba1eb8ae06b26';
const clientSecret = '9545b980b0544ef99bc0def2338fd8c4';
const spotifyApi = new SpotifyWebApi({clientId : clientId, clientSecret : clientSecret});

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
hbs.registerPartials(__dirname + '/views/partials');
app.use(express.static(path.join(__dirname, 'public')));

spotifyApi.clientCredentialsGrant()
  .then((data) => {
    spotifyApi.setAccessToken(data.body['access_token']);
  }, (err) => {
    console.log('Something went wrong when retrieving an access token', err);
});

app.get('/', (req, res, next) => {
  res.render('index')
});

app.get('/artists', (req, res, next) => {
  let search = req.query.artist
  spotifyApi.searchArtists(search)
    .then(data => {
      let allArtists = new Array;
      data.body.artists.items.forEach(element => {
        allArtists.push(element);
      });
      res.render('artists', {search, allArtists} )
    })
    .catch(err => {
      console.log(err);
    })
});

app.get('/albums/:artistId', (req, res, next) => {
  let artistId = req.params.artistId
  spotifyApi.getArtistAlbums(artistId)
  .then(data => {
    let allAlbums = new Array;
    data.body.items.forEach(element => {
        allAlbums.push(element);
      });
      // res.send(allAlbums);
      res.render('albums', {allAlbums} )
    })
    .catch(err => {
      console.log(err);
    })
});

app.get('/tracks/:albumId', (req, res, next) => {
  let albumId = req.params.albumId
  spotifyApi.getAlbumTracks(albumId)
  .then(data => {
    // res.send(data);
    let allTracks = new Array;
    data.body.items.forEach(element => {
      allTracks.push(element);
    });
    res.render('tracks', {allTracks} )
    })
    .catch(err => {
      console.log(err);
    })
});



app.listen('3000')