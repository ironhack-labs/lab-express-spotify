var SpotifyWebApi = require('spotify-web-api-node');
const express = require('express');

const app = express();

const hbs = require('hbs');
const bodyParser = require('body-parser')
const morgan = require('morgan')
const prettyjson = require('prettyjson')

// make files in "public" available through localhosst:30000
app.use(express.static(__dirname + "/public"));
app.set('views', __dirname + '/views');
// use the "hbs npm package four our templates"
app.set("view engine", "hbs");


// Remember to paste here your credentials
var clientId = 'b5919223da5e4c6d9bf52d6fdf1e1f1d',
    clientSecret = '6ef903595756420fbaf53263ac691f8e';

var spotifyApi = new SpotifyWebApi({
  clientId : clientId,
  clientSecret : clientSecret
});

// Retrieve an access token.
spotifyApi.clientCredentialsGrant()
  .then(function(data) {
    spotifyApi.setAccessToken(data.body['access_token']);
    console.log("OK !!!!!!")
  }, function(err) {
    console.log('Something went wrong when retrieving an access token', err);
});

//routes
// ---------------------------------------------------------
app.get("/", (req, res, next) => {
  res.render('index');
});

app.get('/artists', (req, res, next) => {
  //res.send(req.query);
  // res.locals.
  

  
console.log(req.query.artist);

  spotifyApi.searchArtists(req.query.artist)

    .then((data) => {
      //res.send(data)
      //console.log(data.body.artists);
      
      var artistResult = data.body.artists.items;
      //res.send(artistResult)
      res.render('artistPage', {artistResult});
    })
    .catch(err => {
     res.send('Sorry could not find requested artist in our library');
    })
});



//******************************************************** */
app.listen(3000, () => {
  console.log("spotify app online" )
});

