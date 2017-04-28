/*jshint esversion: 6*/

const SpotifyWebApi   = require('spotify-web-api-node');
const spotify         = new SpotifyWebApi();
const expressLayouts = require('express-ejs-layouts');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const morgan = require('morgan');

app.use(express.static('public')); // always between line included in 3 and 7
app.set('layout', 'layouts/main-layout');
app.set('views', __dirname + '/views');
app.set('view engine','ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan(`Request Method: :method, Request URL: :url, Response Time: :response-time(ms)`));
app.use(morgan('dev'));
app.use(expressLayouts);

app.get('/',(req , res, next)=>{
  res.render('index');
});

app.post('/artists',(req, res, next)=>{
  let keyword = req.body.artist;
  console.log(keyword);
  spotify.searchArtists(keyword,{}, (err,data) => {
    if (err) throw err;
    res.render('artists',{albums: data.body.artists.items, keyword: keyword});
  });
});

app.get('/albums/:id', (req, res) => {
  console.log("this is the id: ",req.params.id);
  spotify.getArtistAlbums(req.params.id,{}, (err, data) => {
    console.log("this are the data: " + data.body.items[1].name);
    // res.send(data);
    if (err) { throw err; }
    res.render('albums/view', { albums: data.body.items} );
  });
});

app.get('/tracks/:id', (req, res) => {
  console.log("this is the id: ",req.params.id);
  spotify.getAlbumTracks(req.params.id,{}, (err, data) => {
    // console.log("this are the data: " + data.body.items[1].name);
    // res.send(data);
    if (err) { throw err; }
    console.log(data.body.items[0].url);
    res.render('tracks/view', { tracks: data.body.items} );
  });
});

app.listen(3000);

// module.exports = router;
