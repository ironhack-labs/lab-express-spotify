const express = require('express');
const hbs     = require('hbs');
const app     = express();
const path    = require('path');
var SpotifyWebApi = require('spotify-web-api-node');
const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({extended: true}));

// Remember to paste here your credentials
var clientId = '1fc36c410836453cbb622d4ae5d234e2',
    clientSecret = 'fc01017c802f413c973f20871a1034e4';

var spotifyApi = new SpotifyWebApi({
  clientId : clientId,
  clientSecret : clientSecret
});

// Retrieve an access token.
spotifyApi.clientCredentialsGrant()
  .then(function(data) {
    spotifyApi.setAccessToken(data.body['access_token']);
    console.log('Succes Api...');
  }, function(err) {
    console.log('Something went wrong when retrieving an access token', err);
});

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(path.join(__dirname, 'public')));

hbs.registerPartials(__dirname + '/views/partials');

app.get('/', (req, res, next) =>{
  res.render('index');
});

app.post('/artist', (req, res, next) =>{
  spotifyApi.searchArtists(req.body.artist)
    .then(data => {
      //console.log(data.body.artists);
      var artists = [];
      data.body.artists.items.forEach(artist => {
        //console.log(artist);
        var objArtist = {
          'id'    : artist.id,
          'name'  : artist.name, 
          'image' : (artist.images.length != 0 ? artist.images[0].url : 'http://www.designshock.com/wp-content/uploads/2016/04/man-4-400.jpg')
        }
        artists.push(objArtist);
      });
      console.log(artists);
      res.render('artists',{artists});
    })
    .catch(err => {
      console.log('Error SearchArtists: ' + err);
    });
});

app.get('/albums/:artistId', (req, res) => {
  let bookId = req.params.artistId;
  spotifyApi.getArtistAlbums(bookId)
    .then(data => {
      console.log(data.body.items);

      var albums = [];
      data.body.items.forEach(album => {
        //console.log(artist);
        var objAlbum = {
          'id'    : album.id,
          'name'  : album.name, 
          'image' : (album.images.length != 0 ? album.images[0].url : 'http://www.designshock.com/wp-content/uploads/2016/04/man-4-400.jpg')
        }
        albums.push(objAlbum);
      });
      console.log(albums);
      res.render('albums',{albums});
    })
    .catch(err => {
      console.log('Error SearchAlbums: ' + err);
    });
});

app.get('/tracks/:albumid', (req, res) => {
  let albumid = req.params.albumid;
  spotifyApi.getAlbumTracks(albumid)
    .then(data => {
      //console.log(data.body);

      var tracks = [];
      data.body.items.forEach(track => {
        //console.log(track.name);
        var objTrack = {
          'name'  : track.name, 
          'preview' : track.preview_url
        }
        tracks.push(objTrack);
      });
      console.log(tracks);
      res.render('tracks',{tracks});
    })
    .catch(err => {
      console.log('Error SearchTracks: ' + err);
    });
});

app.listen(3000, () => {
  console.log('Server listening at port 3000!!!');
});