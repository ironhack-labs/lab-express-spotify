/* jshint esversion: 6 */
const SpotifyWebApi   = require('spotify-web-api-node');
const spotify         = new SpotifyWebApi();

const express         = require('express');
const app             = express();

const expressLayouts  = require('express-ejs-layouts');

var bodyParser = require('body-parser');


app.use(express.static('public'));
app.use(expressLayouts);
app.use(bodyParser.urlencoded({ extended: true }));

app.set('layout', 'layouts/main-layout');
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');


app.get('/', (req, res, next) => {
  res.render('index');
});


app.post('/artists', (req, res, next) => {

  let input  = req.body.artist;


  spotify.searchArtists(input, {}, (err, data) => {
    if (err) throw err;
    let artists = data.body.artists.items;
    res.render('artists',{artists:artists});
  });

});


app.listen(3000, () => {
  console.log('ALL OK!!');
});
