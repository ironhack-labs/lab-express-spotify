const SpotifyWebApi   = require('spotify-web-api-node');
const spotify         = new SpotifyWebApi();

const express         = require("express");
const expressLayouts  = require('express-ejs-layouts');
const morgan          = require('morgan');
const bodyParser      = require('body-parser');

let app = express();

app.use(express.static('public'));
app.use(expressLayouts);

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: true }));


app.set('layout', 'layouts/main-layout');
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.get('/', (req, res, next) => {
  res.render('index');
});


app.get('/artists', (req, res, next) => {

  let artist = req.query.artist;
  spotify.searchArtists(artist, {}, (err, data) => {
    if (err) throw err;

    let artists = data.body.artists.items;

    res.render('artist',{search:artist, artists:artists});

  });
 
});

app.get('/albums/:artistId', (req, res) => {

  spotify.getArtist(req.params.artistId)
    .then(function(data) {
    
      let artistName = data.body.name;

      spotify.getArtistAlbums(req.params.artistId)
          .then(function(data) {
          
            res.render('artist-albums',{albums:data.body.items, artistName:artistName})

          }, function(err) {
            console.error(err);
          });

    }, function(err) {
      console.error(err);
    });

  
});


app.get('/tracks/:albumId', (req, res) => {
  console.log(req.params.albumId);
  spotify.getAlbumTracks(req.params.albumId)
    .then(function(data) {
      console.log(data.body);
      res.render('tracks', {tracks:data.body.items});
    }, function(err) {
      console.log('Something went wrong!', err);
    });
});

app.listen(3000, ()=>{
  console.log('My first app listening on 3000');
});
