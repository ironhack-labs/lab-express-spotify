const express = require('express');
const app = express();
const hbs = require('hbs');
const path = require('path')

const SpotifyWebApi = require('spotify-web-api-node');

const clientId = '29ff92fefe2940e9a3c752e231a171a9',
    clientSecret = 'b53bf1f702c74096b7133aa377e3e6d8';

const spotifyApi = new SpotifyWebApi({
  clientId : clientId,
  clientSecret : clientSecret
});

spotifyApi.clientCredentialsGrant()
  .then(function(data) {
    spotifyApi.setAccessToken(data.body['access_token']);
  }, function(err) {
    console.log('Something went wrong when retrieving an access token', err);
});

app.set('view engine', 'hbs')
app.set('views', path.join(__dirname, 'views/layouts'))

app.use(express.static(path.join(__dirname,'public')))

hbs.registerPartials(__dirname + '/views/layouts')

app.get('/',(req,res)=>{
  res.render('index')
})

app.get('/artists',(req,res)=>{
  res.render('artists')
})

app.post('/artists',(req,res)=>{

  const artist = req.query.artist;

  spotifyApi.searchArtists(artist)
    .then(data => {
      console.log(data)
      res.render('artists', { title: 'Connected !' })
    })
    .catch(err => {
      console.log(err)
    })
})

app.listen(3100,()=>{
  console.log('escuchando')
})