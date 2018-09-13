var SpotifyWebApi = require('spotify-web-api-node');
const  express  =  require ('express');
const  app  =  express ();
const  hbs  =  require ('hbs');
const path  = require ('path');
var clientId = '44e815b3026049c0b693eb90a2b322b2',
 clientSecret = 'a3d4dd0c83534285871f4fd5da450619';

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
hbs.registerPartials(__dirname + '/views/partials');
app.use(express.static(path.join(__dirname, 'public')));


var spotifyApi = new SpotifyWebApi({
    clientId : clientId,
    clientSecret : clientSecret
  });


spotifyApi.clientCredentialsGrant()
  .then(function(data) {
    spotifyApi.setAccessToken(data.body['access_token']);
  }, function(err) {
    console.log('Something went wrong when retrieving an access token', err);
});


app.get('/', (req, res, next) => {
    res.render('index')
  });
   app.get('/artists', (req, res, next) => {
    let artist = req.query.artist
    spotifyApi.searchArtists(artist)
      .then(data => {
        
        res.send(data);
      
      })
      .catch(err => {
        console.log(err);
      })
  });
   app.listen('3000') 



spotifyApi.clientCredentialsGrant()
    .then(function(data) {
        spotifyApi.setAccessToken(data.body['access_token']);
    }, function(err) {
        console.log('Something went wrong when retrieving an access token', err);
    });