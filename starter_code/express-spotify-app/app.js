var SpotifyWebApi = require('spotify-web-api-node');

// Remember to paste here your credentials
var clientId = '168af06596434bd18934a863d9a55b94',
  clientSecret = 'e68908d314dc427ebba70bdf5a0bc409';

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

//Iteration 3 app.js
const express = require('express');
const app = express();
const expressLayouts = require('express-ejs-layouts');

app.use(express.static('public'));
app.use(expressLayouts);

app.set('layout', 'layouts/main-layout');
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');


app.get('/', (req, res, next) => {
  res.render('index');
  });

app.get('/artist', (req, res, next) => {
  let artistName = req.query.artist;
  //Find artist
  spotifyApi.searchArtists(artistName)
    .then(function(data) {
    let artInfo = data.body.artists.items;
    artInfo = artInfo.filter(artI => artI.name===artistName);
    //console.log(artInfo);
    let names = artInfo.map(artist => artist.name);
    //console.log(names);
    let id = artInfo.map(artist => artist.id);
    console.log(id);
    let images = artInfo.map(artist => artist.images);
    images = images[0];
    //console.log(images);
    res.render('artist', {
      names: names,
      images: images,
      id: id[0],
    });
    }, function(err) {
    console.error(err);
    });
  });

app.get('/albums/:artistId', (req, res, next) => {
  let id = req.params.artistId;
  //console.log(id);

  // Get albums by a certain artist
  spotifyApi.getArtistAlbums(id)
    .then(function(data) {
      let albInfo = data.body.items;
      //albInfo = [...new Set(albInfo)];
      //console.log('Artist albums', albInfo);
      let names = albInfo.map(album => album.name);
      names = [...new Set(names)];
      let images = albInfo.map(album => album.images);
      //console.log(images);
      let id = albInfo.map(album => album.id);
      console.log(id);

      res.render('albums', {
      names: names,
      images: images[0],
      id: id
    });
    }, function(err) {
      console.error(err);
    });

});


app.get('/track/:albumId', (req, res, next) => {

  let id = req.params.albumId;
  console.log(id);
 
  // Get tracks in an album
  spotifyApi.getAlbumTracks('41MnTivkwTO3UUJ8DrqEJJ', { limit : 5, offset : 1 })
    .then(function(data) {
      console.log(data.body);
       res.render('track');
    }, function(err) {
      console.log('Something went wrong!', err);
    });


  });



app.listen(3000);