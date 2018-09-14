const SpotifyWebApi = require('spotify-web-api-node');
const express = require('express');
const app = express();
const hbs = require('hbs');
const path = require('path')

const port = 3000

// Remember to paste here your credentials
const clientId = 'cbbb0f20cb744382b839cbe57948f618',
    clientSecret = '618c3cdd5f3f4fbab909c1a15ccbb463';

const spotifyApi = new SpotifyWebApi({
  clientId,
  clientSecret
});

// Retrieve an access token.
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

app.listen(port)