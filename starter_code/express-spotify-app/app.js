const express = require('express');
const hbs     = require('hbs');
const app     = express();
const path    = require('path');
const SpotifyWebApi = require('spotify-web-api-node');


app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(path.join(__dirname, 'public')));

hbs.registerPartials(__dirname + '/views/partials');

// Remember to paste here your credentials
const clientId = 'eb287830550245e5987ef0604580344c',
    clientSecret = '1054be579ea64a04be8ef445fb609935';

const spotifyApi = new SpotifyWebApi({
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

//paginas
app.get('/', (req, res, next) => {
  res.render('home');
});

app.get('/artistas', (req, res, next) => {
  spotifyApi.searchArtist(req.query)
  .then(data =>{
    res.render('artistas',data);
  })
  .catch(err =>{
    console.log(err)
  })
});

app.listen(3000, () => console.log('Servidor listo!!!'));