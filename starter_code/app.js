const express = require('express');
const app = express();
const hbs = require('hbs');
app.use(express.static('public'));
app.use(express.static('views'));
app.set('views', __dirname + '/views');
app.set('view engine', 'hbs');
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));
const SpotifyWebApi = require('spotify-web-api-node');

// Remember to paste here your credentials
const clientId = '2fd0c46e022f4a7d9ad8a55fdcdd5a49',
clientSecret = '1262fc7df97c4e82b0a574578145997f';


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

app.get('/', (req, res, next) => {
  res.render('index');
});

app.post('/artists',(req, res, next) =>{
  // res.send(req.body.artist);
  spotifyApi.searchArtists(req.body.artist)
    .then(data => {
      res.render('artists', {artists: data.body.artists.items})
      //console.log(data.body.artists.items)// ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
    })
    .catch(err => {
     console.log(err) // ----> 'HERE WE CAPTURE THE ERROR'
    })
})

app.get('/albums/:albumId', ()=>{
  req.param.albumId
})

app.listen(3000, () => {
  console.log('pepe');
});
