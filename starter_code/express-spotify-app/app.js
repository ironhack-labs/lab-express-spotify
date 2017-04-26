/*jshint esversion: 6*/
const SpotifyWebApi   = require('spotify-web-api-node');
const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const bodyParser = require('body-parser');
const morgan     = require('morgan');

const spotify = new SpotifyWebApi();
const app = express();

app.use(express.static('public'));
app.use(expressLayouts);
app.set('layout', 'layouts/main-layout');
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended:true}));
app.use(morgan('dev'));

app.get('/', (req, res, next) => {
  res.render('index');
});

app.post('/artists',(req,res,next)=>{
  let artistSelected = req.body.artist;
  // console.log(req.body.artist);
  spotify.searchArtists(artistSelected, {}, (err, data) => {
    if (err) throw err;

    let artists = data.body.artists.items;
    // console.log(artists);
    res.render('artists',{artistsSearched:artists});
  });
});

app.get('/albums/:artistId',(req,res,next)=>{
  console.log("hi");
  let artistId = req.params.artistId;
  // console.log(artistId);
  spotify.getArtistAlbums(artistId, {}, (err, data) => {
    if (err) throw err;

    let albums = data.body.items;
    // console.log(albums );
    res.render('albums', {albumsSearched:albums});
  });
});

app.get('/tracks/:albumId',(req,res,next)=>{
  console.log("hi");
  let albumId = req.params.albumId;
  console.log(albumId);
  spotify.getAlbumTracks(albumId, {}, (err, data) => {
    if (err) throw err;

    let tracks = data.body.items;
    console.log(tracks );
    res.render('tracks', {tracksSearched:tracks});
  });
});

app.listen(3000, () => {
  console.log('My first app listening on port 3000!');
});
