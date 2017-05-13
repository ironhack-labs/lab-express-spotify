const SpotifyWebApi   = require('spotify-web-api-node');
const spotify         = new SpotifyWebApi();
const express         = require('express');
const expressLayouts  = require('express-ejs-layouts');
const app             = express();
const engine          = require('express-ejs-layouts');
const bodyParser      = require('body-parser');
const morgan          = require('morgan');

app.set('views', __dirname + "/views");
app.set('view engine', 'ejs');


app.get('/', (req, res) => {
  res.render('index');
});

// app.get('/artists', function(req, res, next) {
//   let searchTerm = req.query.name;
//
//   spotify.searchArtists(searchTerm, {}, (err, data) =>
//   {
//     if (err) throw err;
//
//     let artists = artists: data.body.artists.items;
//
//     res.render('artists/index', {
//     artists: artists,
//     searchTerm: searchTerm
//   });
// });
// });

app.use(express.static('public'));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan('dev'));

app.use(expressLayouts);
app.set('layout', 'layouts/main-layout');

app.set('views', __dirname + "/views")
















app.listen(3000, () => {
  console.log('My first app listening on port 3000!');
});
