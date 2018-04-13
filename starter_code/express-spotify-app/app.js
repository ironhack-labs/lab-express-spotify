const express = require('express');
const app = express();
const hbs = require('hbs');

//Definicion de public
const publicDir = __dirname + "/public";
console.log(`Public dir is: ${publicDir}`);
app.use(express.static(publicDir));

//Definicion de hbs
app.set("views", __dirname + "/views");
app.set("view engine", "hbs");
hbs.registerPartials(__dirname + "/views/partials");


var SpotifyWebApi = require('spotify-web-api-node');

// Remember to paste here your credentials
var clientId = '9f85add961824b4fac6bc34c0d66b388',
  clientSecret = 'c115417db86748dea5fe97f0f1935df8';

var spotifyApi = new SpotifyWebApi({
  clientId: clientId,
  clientSecret: clientSecret
});

// Retrieve an access token.
spotifyApi.clientCredentialsGrant()
  .then(function (data) {
    spotifyApi.setAccessToken(data.body['access_token']);
  }, function (err) {
    console.log('Something went wrong when retrieving an access token', err);
  });

app.get('/', (req, res) => {
  console.log(1)
  res.render("index")
});

app.get('/artists', (req, res) => {
  console.log(2)
  let search = req.query.artist;
  spotifyApi.searchArtists(search)
    .then(data => {
      //console.log(data)
      console.log(data.body.artists.items)
      // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
      res.render("artists",{data})
    })
    .catch(err => {
      // ----> 'HERE WE CAPTURE THE ERROR'
    })
});


app.get('/albums/:artistId', (req, res) => {
  
  let album = req.params.artistId;

  spotifyApi.getArtistAlbums(album)
  .then(function(data) {
    console.log('Artist albums', data.body);
    res.render("albums", {data})
  }, function(err) {
    console.error(err);
  });
});

app.listen(3000, () => {
  console.log('Listening on p0rt 3000!')
});