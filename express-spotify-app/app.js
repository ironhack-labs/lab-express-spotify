const express = require('express');
const app     = express()
const hbs     = require('hbs') 
const path    = require ('path')

hbs.registerPartials(__dirname + '/views/partials');

var SpotifyWebApi = require('spotify-web-api-node');

// Remember to paste your credentials here
var clientId = 'b16a50d349ea4181a0c6c635b6dd41ec',
    clientSecret = '911a0c474fbf426fa258e3cfa4bf0ddd';

var spotifyApi = new SpotifyWebApi({
  clientId : clientId,
  clientSecret : clientSecret
});

app.get('/', function (req, res) {
    res.render('index')
  })

app.set('views', path.join(__dirname,'views'));
app.set('view engine','hbs');

// Retrieve an access token.
spotifyApi.clientCredentialsGrant()
  .then(function(data) {
    spotifyApi.setAccessToken(data.body['access_token']);
  }, function(err) {
    console.log('Something went wrong when retrieving an access token', err);
});

app.get('/artists',  (req, res, next)=> {
  spotifyApi.searchArtists(req.query.artists)
  .then(data => {
      res.locals.artistsResults = data.body.artists.items;
      res.render('artists');
      console.log('ok', searchlist )
    // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
  })
  .catch(err => {
    console.log('pas bon', err)
  })
})

app.get('/albums/:artistId', (req, res, next) => {
  console.log(req.params.artistId)
  spotifyApi.getArtistAlbums(req.params.artistId)
    .then(data => {
      var albums = data.body.items
    console.log('albums', albums)
    res.render('albums', { artistAlbums: albums })
})
.catch(err => {
  console.log("No", err);
  next();
});
})

app.get('/tracks/:albumId', (req, res, next) => {
  console.log(req.params.albumId)
  spotifyApi.getAlbumTracks(req.params.albumId)
    .then(data => {
    let tracksList = data.body.items
    console.log('tracks', tracksList)
    res.render("tracks", {track : tracksList })
})
.catch(err => {
  console.log("No", err);
  next();
});
})

app.listen(3000, () => console.log('Example app listening on port 3000!'))
