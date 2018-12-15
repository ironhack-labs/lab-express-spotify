const express = require('express');
const app = express();
const hbs = require('hbs');
const path = require('path');

var SpotifyWebApi = require('spotify-web-api-node');

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(express.static(__dirname + '/public'));

var clientId = '853773b1afba403b8379328166b0644f',
    clientSecret = '3d8fd1ddd59942c98fda5c94fdaca952';

var spotifyApi = new SpotifyWebApi({
  clientId : clientId,
  clientSecret : clientSecret
});

spotifyApi.clientCredentialsGrant()
  .then(function(data) {
    spotifyApi.setAccessToken(data.body['access_token']);
  }, function(err) {
    console.log('Something went wrong when retrieving an access token', err);
});

const port = process.env.PORT || 3000;

app.get('/', function (req, res) {
    res.render('index');

  });
app.get('/artists', function (req, res) {
    spotifyApi.searchArtists(req.query.artist)
    .then(data => {
      // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
      let items = data.body.artists.items;
      res.render('artists', {items});
    })
    .catch(err => {
      // ----> 'HERE WE CAPTURE THE ERROR'
    });
  });

  app.get('/albums/:artistId', (req, res) => {
    let id = req.params.artistId;

    spotifyApi.getArtistAlbums(id)
    .then(data =>{
        let items = data.body.items;
        res.render('albums', {items});
    })
    .catch();
})

app.get('/tracks/:albumId', (req, res) => {
    let id = req.params.albumId;

    spotifyApi.getAlbumTracks(id)
    .then(data =>{
        let items = data.body.items;
        console.log(items);
        res.render('tracks', {items});
    })
    .catch();
    
  });

  

    app.listen(port,() => console.log(`Listening on PORT ${port} `));