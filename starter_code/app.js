/*jshint esversion:6*/
const SpotifyWebApi = require('spotify-web-api-node');
const spotify = new SpotifyWebApi();

const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const morgan = require('morgan');
const bodyParser = require('body-parser');

const app = express();

app.use(express.static('public'));
app.use(morgan('combined'));
app.use(bodyParser.urlencoded({
  extended: true
}));

app.set('views', `views`);
app.set('view engine', 'ejs');

app.get('/', function(request, response) {
  response.render('index');
});

app.post('/', function(request, response) {
  // const artists = request.body.artist;
  spotify.searchArtists("The Beatles", {
    limit: 3,
    offset: 1
  }).then(function(groups) {
    response.send('artists', {
      groups: groups
    }); // to stuff here
  }).catch(function(err) {
    console.log(err);
  });
});


// app.post('/', function(request, response) {
//   // const artists = request.body.artist;
//   spotify.searchArtists("The Beatles", {}, (err, data) => {
//     if (err) throw err;
//
//     let artists = data.body.artists.items;
//     console.log(artists);
//   });
// });

// app.post('/', function(request, response) {
//   const artists = request.body.artist;
//   spotify.searchArtists(function(artists) {
//     response.send('artists', {
//       artists: artists
//     }, (err, data) => {
//       if (err) throw err;
//     });
//   });
// });

// app.post('/', function(request, response) {
//   const name = request.body.artists.name;
//   response.send('artists');
// });

//app.get('/artists', function(request, response) {
//  response.render('artists');
//});

//spotify.searchArtists("The Beatles", {}, (err, data) => {
//  if (err) throw err;

 // let artists = data.body.artists.items;
 // console.log(artists);
//});




app.listen(3005, () => {
  console.log('Spotify Express!');
});
