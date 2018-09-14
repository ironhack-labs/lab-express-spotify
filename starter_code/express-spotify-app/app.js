const SpotifyWebApi = require('spotify-web-api-node');
const express = require('express');
const app = express();
const hbs = require('hbs'); 
const path =require('path'); //path 


const clientId = 'e6d310615f214d7cb9fc1e3e04707756',
    clientSecret = '19d873073d49469e965ae241b1b7f3e3';

const spotifyApi = new SpotifyWebApi({
  clientId : clientId,
  clientSecret : clientSecret
});

app.set('view engine', 'hbs'); //to set up hbs
app.set('views', __dirname + '/views'); //para render
app.use(express.static(path.join(__dirname, 'public'))); //static folder containing img, js, css
hbs.registerPartials(__dirname + '/views/partials'); //parstial

const bodyParser = require('body-parser'); //http path
app.use(bodyParser.urlencoded({ extended: true }));

// Retrieve an access token.
spotifyApi.clientCredentialsGrant()
  .then(function(data) {
    spotifyApi.setAccessToken(data.body['access_token']);
  }, function(err) {
    console.log('Something went wrong when retrieving an access token', err);
});


app.get("/", (req,res) => {
  res.render('index');
})

app.get("/artists", (req,res,) => {
  let artistQuery = req.query.artist //query to jedna z methods z query
  spotifyApi.searchArtists(artistQuery)
    .then(data => { //ta promise oddaje data z API
      res.render('artists', {artists: data.body.artists.items});  // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
    })
    .catch(err => {
      console.log("Something went wrong", err)
    })  
})

app.get('/albums/:artistId', (req, res) => {
  spotifyApi.getArtistAlbums(req.params.artistId)
  .then(data => {
    //console.log(data.body)
    res.render('albums', {albums: data.body.items})
  })
});

app.listen(3000, () => {
  console.log("Port 3000")
})

