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


spotify.searchArtists("The Beatles", {}, (err, data) => {
  
  if (err) throw err;

  let artists = data.body.artists.items;
  console.log(artists)
});



app.listen(3000, () => {
  console.log('SPOTIFY APP listening on port 3000!!!!!')
});
