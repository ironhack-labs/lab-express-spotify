var SpotifyWebApi = require('spotify-web-api-node');

// Remember to paste here your credentials
var clientId = '1c30624cba6742dcb792991caecae571',
    clientSecret = '746977b1e77240faa9d0d2411c3e0efe';

var spotifyApi = new SpotifyWebApi({
  clientId : clientId,
  clientSecret : clientSecret
});

// Retrieve an access token.
spotifyApi.clientCredentialsGrant()
  .then(function(data) {
    spotifyApi.setAccessToken(data.body['access_token']);
  }, function(err) {
    console.log('Something went wrong when retrieving an access token', err);
});

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(morgan('dev'));

app.get("/", (req, res, next) => {
  console.log('CIAO');
  res.render('index');
});

app.get("/artist", (req, res, next) => {
  let artist = req.query.artist;
  spotifyApi.searchArtists(artist)
  .then((response) => {
    let data = {name: artist, main: response}
    res.render('artist', data);
  })
  .catch((err) => {
    console.log(err);
  });     
});