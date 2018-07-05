const SpotifyWebApi = require('spotify-web-api-node');
const express = require('express');
const app = express();
const hbs = require('hbs');
const path = require("path");

const port = 3000;

hbs.registerPartials(__dirname + '/views/partials');

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(path.join(__dirname, 'public')));


// Remember to paste here your credentials
var clientId = '6b00779e209047acbd1fde3d1c6fcddb',
    clientSecret = 'f6b9f215473549968e9f286fb9e40a94';

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


app.get("/", (req, res) => {
  res.render("index");
});

app.get('/artists', function (req, res) {
  spotifyApi.searchArtists(req.query.name)
    .then(data => {
      // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
      let sendData = {
        title: "Artists",
        search: req.query.name,
        items: data.body.artists.items
      }
      res.render("artists", sendData)
    })
    .catch(err => {
      // ----> 'HERE WE CAPTURE THE ERROR'
    });
});

app.get('/albums/:artistID', (req, res) => {
  spotifyApi.getArtistAlbums(req.params.artistID)
    .then(data => {
      console.log(data.body.items);
      let sendData = {
        title: "Albums",
        items: data.body.items
      }
      res.render("albums", sendData);
    })
    .catch(err => {

    });
});


app.listen(port, () => {console.log(`Ready at http://localhost:${port}`)});