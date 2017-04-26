const SpotifyWebApi   = require('spotify-web-api-node');
const spotify         = new SpotifyWebApi();
const express         = require('express');
const app             = express();
const bodyParser      = require('body-parser');


app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true}));

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.get('/', (req, res, next) => {
  res.render('index');
});

app.post('/artists', (req, res, next) => {
  spotify.searchArtists(req.body.artist, {}, (err, data) => {
    if (err) throw err;
    let artists = data.body.artists.items;
    console.log(artists);
    res.render('artists', {artists});
  });
});



// app.get('/css', (req, res, next) => {
//   res.send('index.ejs');
// });
//
// app.get('/', (req, res, next) => {
//   // send views/index.ejs for displaying in the browser
//   res.render('index.ejs');
// });

app.listen(3000, () => {
  console.log('My first app listening on port 3000!')
});
