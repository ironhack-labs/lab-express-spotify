const SpotifyWebApi   = require('spotify-web-api-node');
const spotify         = new SpotifyWebApi();

const express = require('express');
const expressLayouts = require('express-ejs-layouts');

const app = express();



app.use(expressLayouts);
app.set('layout', 'layouts/main-layout');


app.set('views', __dirname + "/views");
app.set('view engine', 'ejs');


// spotify.searchArtists("The Beatles", {}, (err, data) => {
//   if (err) throw err;
//
//   let artists = data.body.artists.items;
//   console.log(artists)
// });

app.get('/', (req, res) => {
  res.render('index')
  console.log();
});



app.get('/artists', (req, res) => {

  let nameOfArtist = req.query.artist;

  spotify.searchArtists(nameOfArtist, {}, (err, data) => {
    if (err) throw err;

    let artists = data.body.artists.items;
    console.log(artists)
    res.render('artists',{artistName:artists})

  })


});


app.get('/albums', (req, res) => {

  // spotifyApi.getArtistAlbums('43ZHCT0cAZBISjO8DG9PnE')
  //   .then(function(data) {
  //     console.log('Artist albums', data.body);
  //   }, function(err) {
  //     console.error(err);
  //   });


  res.render('albums')


});




app.listen(3000, () => {
  console.log('Spotify listening on port 3000!')
});
