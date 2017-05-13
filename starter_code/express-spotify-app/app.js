/*jshint esversion: 6*/

const express = require('express');
const morgan     = require('morgan');
const expressLayouts = require('express-ejs-layouts');
const bodyParser = require('body-parser');

const SpotifyWebApi   = require('spotify-web-api-node');
const spotify         = new SpotifyWebApi();

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static('public'));
app.use(expressLayouts);

app.set('layout', 'layouts/main-layouts');
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.use(morgan('dev'));



app.get('/', (request, response) => {
  response.render('index');
});

let controller = (req, res) =>{
  spotify.searchArtists(req.body.artistname, {}, (err, data) => {
    if (err) throw err;

    let artists = data.body.artists.items;
    console.log(artists);
    res.render('artists', {artists});
  });
};

app.post('/artists', controller);

// app.get('/albums/:artistId', (req, res) => {
//   spotify.getArtistAlbums(req.params.artistId, {}, (err, data) => {
//     if (err) throw err;
//
//     let artists = data.body.artists.items;
//     console.log(artists);
//     res.render('artists', {artists});
//   });
//   // res.render('albums');
// });

//Server Started
app.listen(3000, () => {
  console.log('My first app listening on port 3000!');
});
