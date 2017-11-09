const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const app = express();
const SpotifyWebApi = require('spotify-web-api-node');

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
// app.set('layout', __dirname + '/views/layout/main-layout');
// app.use(expressLayouts);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan('dev'));
app.use(express.static('public'));

// Remember to paste here your credentials
var clientId = '0de70aff95f84d73960f7465971675a6',
    clientSecret = '68235785568948cc841ada7a4d1c882d';

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

app.get('/',(req,res)=>{
  res.render('home');
});

app.get('/artists',(req,res,next)=>{
  let artistSearch = req.query.artist;
  spotifyApi.searchArtists(artistSearch)
  .then((data)=>  {
      res.render('artists', {
        artista: data.body.artists.items
      });
    });

});

app.get('/artist/:id',(req,res,next)=>{
  let artistId = req.params.id;
  spotifyApi.getArtistAlbums(artistId)
  .then((data)=> {
    res.render('artist',{albums: data.body.items
    });
  });
});

app.get('/album/:id',(req,res,next)=>{
  let albumId = req.params.id;
  spotifyApi.getAlbumTracks(albumId)
  .then(function(data) {
    res.render('album',{tracks: data.body.items
    });
  });
});





app.listen(3000);
