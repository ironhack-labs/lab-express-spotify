var SpotifyWebApi = require(' spotify-web-api-node ');

// Recuerde pegar aquí sus credenciales 
var clientId = ' 6cd4727deb1c4a2bbf131d66b788e57a ',
    clientSecret = ' d9fab53acfba4ba3ad39a49da8dac208 ';

var spotifyApi = new SpotifyWebApi({
    ID de cliente: ID de cliente,
    clientSecret: clientSecret
});

// Retrieve an access token.
spotifyApi.clientCredentialsGrant()
  .then(function(data) {
    spotifyApi.setAccessToken(data.body['access_token']);
  }, function(err) {
    console.log('Something went wrong when retrieving an access token', err);
});
app.get('/', (req, res) => {
    res.render('search-form', {})
   });
   app.get('/artists', (req, res) => {
    spotifyApi.searchArtists(req.query.artist)
    .then(function(data) {
      res.render('artist-info', {
        artist: data.body.artists.items[0]
      });
    }, function(err) {
      console.error(err);
    });
   });
   app.listen(3000, () => {
    console.log('Listening on port 3000!');
   });