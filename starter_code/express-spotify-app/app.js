var SpotifyWebApi = require('spotify-web-api-node');
const express = require('express');
const app = express();
const hbs = require('hbs');
const bodyParser = require('body-parser')

// SPOTIFY CREDENTIALS
var clientId = '0c97bd46f8c346e99ee7b7cb6cf3b64f',
  clientSecret = 'e12d80e8b6504904ad02cfb154972642';

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


/* EXPRESS CONFIG */

const publicDir = __dirname + "/public";
app.use(express.static(publicDir));


// Starts bodyParser
app.use(bodyParser.urlencoded({
  extended: true
}));


hbs.registerPartials(__dirname + "/views/partials");
// Sets up Handlebars View Engine
app.set("views", __dirname + "/views");
app.set("view engine", "hbs");

app.get('/',(req,res) => {
  res.render("home")
});


app.get('/artists',(req,res)  => {
  let mySearch = req.query.artistName;
  console.log(`Searching for: ${mySearch}`);
  
  spotifyApi.searchArtists(mySearch)
     .then(data => {
       let myData = data.body.artists.items;
       //console.log({myData});
         res.render("artists",{myData});
     })
    .catch(err => {
      "Errorrrrr!"
   })

})

app.get('/albums/:artistId', (req, res) => {

  let artistID = req.params.artistId;
  spotifyApi.getArtistAlbums(artistID)
  .then(function(data) {
    let myAlbums = data.body;
    //console.log('Artist albums', myAlbums);
    res.render("albums",{myAlbums});

  }, function(err) {
    console.error(err);
  });

})

app.get('/tracks/:albumId', (req, res) => {

  let albumID = req.params.albumId;
  spotifyApi.getAlbumTracks(albumID)
  .then(function(data) {
    let myTracks = data.body;
    //console.log('Album tracks', myTracks);
    res.render("tracks",{myTracks});

  }, function(err) {
    console.error(err);
  });

})





/* SERVER LISTENER */
const port = 3000;
app.listen(port, () => console.log(`Listening on port ${port}`));