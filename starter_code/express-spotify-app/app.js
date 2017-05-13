const SpotifyWebApi   = require('spotify-web-api-node');
const spotify         = new SpotifyWebApi();
const express         = require('express');
const app             = express();
const bodyParser      = require('body-parser');

app.use(bodyParser.urlencoded({ extended: true }));
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.get('/', (req, res, next) => {
  res.render('index');
});

app.get('/hola', (req, res, next) => {
  res.send("Hola!");
});

app.post('/artists', (req, res, next) => {

  let input = req.body.artist;
  console.log(input);

  spotify.searchArtists(input, {}, (err, data) => {
    if (err) throw err;

    let artists = data.body.artists.items;
    res.render('artists', {artists: artists})
  });
})


// spotify.searchArtists("The Beatles", {}, (err, data) => {
//   if (err) throw err;
//
//   let artists = data.body.artists.items;
//   console.log(artists)
// });

app.listen(3000);
