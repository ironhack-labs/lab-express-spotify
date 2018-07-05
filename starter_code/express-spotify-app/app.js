const express = require('express');
const path = require('path');
const hbs = require('hbs');
const bodyparser = require('body-parser')
var SpotifyWebApi = require('spotify-web-api-node');


const app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(bodyparser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));



// Remember to paste here your credentials
var clientId = '3218d9910e094d9d9a465e02c7487f4e',
    clientSecret = '6436a12537084b1d8f03f10cedc153c6';

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

app.get('/', (req, res) => {
  res.render('index');
});

app.get('/artist', (req, res) => {
  const {art} = req.query; 

  spotifyApi.searchArtists(art)
    .then(data => {
      console.log(data.body.artists.items)

      res.render('artist-list',{data:data.body.artists.items});
      // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
    })
    .catch(err => {
      // ----> 'HERE WE CAPTURE THE ERROR'
    })
  //console.log(req.params);
  //console.log(req.color);
  //const {ta,color} = req.params;

})

// app.post('/getArtist', (req, res) => {
//   console.log(req.query);
//   //console.log(req.params);
//   //console.log(req.body);
//   //const {ta,color} = req.params;
//   const {art} = req.query; 
//   res.render('index',{
//       name: art
//   });
// })

const port = 3000;
app.listen(port, () => console.log(`Ready on http://localhost:${port}`));