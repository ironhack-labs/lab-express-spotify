const SpotifyWebApi = require('spotify-web-api-node');
const express = require('express');
const app = express();
const hbs = require('hbs');
const path = require('path');

const clientId = '456b82e403914c6f85d795481c50c909',
    clientSecret = 'edfefe26f9a44cd19d13cdf1b7467ba3';

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
});;


app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, '/views'));
app.use(express.static(path.join(__dirname, 'public')));
hbs.registerPartials(path.join(__dirname, '/views/partials'))

app.get('/', (req, res, next) => {
  res.render('index') 
})  

app.get('/artists', (req, res, next) => {
  spotifyApi.searchArtists(function (req, res){
    req.body.artist
  })
    .then(data => {
      res.render('artists', { data })
    })  
    .catch(error => {
      console.log(error); 
    })  
    
  
  res.render('artists')   
})  


// Remember to paste here your credentials



app.listen(3000);