const express = require('express');
const app = express();
const hbs = require('hbs');
const path = require('path')


const SpotifyWebApi = require('spotify-web-api-node');

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(path.join()))

// Remember to paste here your credentials
const clientId = '61a05616a9f04d838003a6e543a5ef04',
    clientSecret = '1a20216700eb42e99dcf85f30f3dd881';

const spotifyApi = new SpotifyWebApi({
  clientId : clientId,
  clientSecret : clientSecret
});

app.get('/', (req, res, next) => {
  res.render('home');
})


app.get('/artists', (req,res, next) => {
  res.render('artist')
})



// Retrieve an access token.
spotifyApi.clientCredentialsGrant()
  .then(function(data) {
    spotifyApi.setAccessToken(data.body['access_token']);
  }, function(err) {
    console.log('Something went wrong when retrieving an access token', err);
});


app.listen(3000, () => {
  console.log('My first app listening on port 3000!')
});