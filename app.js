const express         = require('express');
const bodyParser      = require('body-parser');
const SpotifyWebApi   = require('spotify-web-api-node');
const spotify         = new SpotifyWebApi();
const expressLayouts  = require('express-ejs-layouts');
const morgan          = require('morgan');

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(expressLayouts);

app.set('layout', 'layouts/main-layout');
app.set('views', __dirname + "/views");
app.set('view engine', 'ejs');


app.get('/', (req, res) => {
  res.render('index');
});

app.get('/artists', (req, res) => {
  res.render('artists');
});

app.post('/artists', (req, res) => {
  let search = req.body.keyboard;

  spotify.searchArtists(search, {}, (err, data) => {

    if (err) throw err;

    let allArtists = {
      artists: data.body.artists.items,
    };

    res.render('artists', allArtists);
    // console.log(allArtists);
  });

});

app.get('/artists/:artist', (req, res) => {
  res.render('artist');
});

app.get('/artists/:artist', (req, res) => {

  var artistId = req.params.artist


  console.log(artistId)
  console.log('working?')

  spotify.getArtistAlbums(artistId, {}, (err, artistId) => {

    console.log("whuttt");

    if (err) throw err;

    res.send(artistId);
    });
});



app.listen(3000, () => {
  console.log('SPOTIFY APP listening on port 3000!!!!!');
});
