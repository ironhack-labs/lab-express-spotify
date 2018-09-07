// app.js
const express = require('express')
const app     = express()
const hbs     = require('hbs') 
const path    = require('path')

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.use(express.static(path.join(__dirname, 'public')));

hbs.registerPartials(__dirname + '/views/partials')

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));

var SpotifyWebApi = require('spotify-web-api-node');

// Remember to paste here your credentials
var clientId = '50fcf8f4ac054876b4e7729d06e291a7',
    clientSecret = 'e0b7619a553d49e4aa71cb66cd45392f';

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

app.get('/', (req, res, next)=>{
    res.render('home')
    console.log(req.body)
})


app.post('/artist', (req, res, next) => {
  console.log('post successful ___ !!!!!!__________')
  console.log(req.body.theArtist)
  spotifyApi.searchArtists(req.body.theArtist)
  .then(data => {
    console.log('-----sucess-----')
    let imgLink = data.body.artists.items[0].images[0].url;
    let artist7=data.body.artists.items[0];
        res.render('artist', {thisArtist:artist7, thisImage:imgLink});

    })
    .catch(error => {
      console.log(error)
      console.log('no artist')
  });
});

app.get('/albums/:artistId', (req, res) => {
  spotifyApi.getArtistAlbums(req.params.artistId)
  .then(data => {
    // console.log('-----sucess-----')
    // console.log(data.body.items[0].images[0].url)
      res.render('albums', {theAlbums: data.body.items})
    })
    .catch(error => {
      console.log(error)
      console.log('no album')
  });
});

app.get('/tracks/:albumId', (req, res) => {
  spotifyApi.getAlbumTracks(req.params.albumId)
  .then(data => {
    console.log('-----sucess TRACKS -----')
    console.log(data.body.items)
      res.render('tracks', {theTracks: data.body.items})
    })
    .catch(error => {
      console.log(error)
      console.log('no tracks')
  });
});

app.listen(3000);