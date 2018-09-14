const SpotifyWebApi = require('spotify-web-api-node');
const express = require('express');
const hbs = require('hbs');
const bodyParser = require('body-parser')
const path = require('path');


const app = express();

const port = 3000

// Remember to paste here your credentials
const clientId = '4d7667c076784b55acf008d0ecea6101',
    clientSecret = 'd965c8d9994c45998070988da4999dd9';

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

app.use (express.static(path.join(__dirname,'public')))

app.set('view engine','hbs')
app.set('views', path.join(__dirname, 'views/layouts'))

app.use (bodyParser.urlencoded({extended:true})) 

app.get('/home', (req, res, next) => {
    res.render('home');
  });
  

  app.get('/artist', (req, res, next) => {
    spotifyApi.searchArtists()
    .then(data => {
        res.render ('artist',{data})
        })
        .catch(err => {
          console.log(err)
        })
  });



app.listen(port, ()=>console.log ('Escuchano al servidor'))