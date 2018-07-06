const express = require('express');
const hbs = require('hbs');
const bodyparser = require('body-parser')
var SpotifyWebApi = require('spotify-web-api-node');
const path = require ("path");

const app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
hbs.registerPartials(__dirname + "views/partials");

//Middleware
app.use(bodyparser.urlencoded({ extended: true }));
//

// Remember to paste here your credentials
var clientId = '8d0f6cdc039f46f1850305eebda7b948',
    clientSecret = '2254cbe8e2854a3faabc7a9d643f64d4';

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

//Routes

app.get('/',(req,res) => {
  res.render('index',{title: "Index"});
})

app.get('/artist',(req,res, next) => {
  const searchName = req.query.artist;
  spotifyApi.searchArtists(req.query.artist)
  .then(data => {
    data.body.artists.search = searchName;
    res.render("artist", data.body.artists);
  })
  .catch(err => {
    console.log("Error to retrieve data",err);
  })
});


//Server Initialization
const port = 3000;
app.listen(port, () => console.log(`Ready on http://localhost:${port}`));