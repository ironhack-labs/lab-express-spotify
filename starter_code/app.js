const SpotifyWebApi = require('spotify-web-api-node');
const express = require('express');
const app = express();
const hbs = require('hbs');
const path = require("path");
const bodyParser = require('body-parser');

// Remember to paste here your credentials
let clientId = 'ce549e0d8a9d46e8811cd3bec1052952',
    clientSecret = 'c5dd50c699884c5b852854c90ec119c9';

let spotifyApi = new SpotifyWebApi({
  clientId : clientId,
  clientSecret : clientSecret
});

// Retrieve an access token.
spotifyApi.clientCredentialsGrant()
  .then(function(data) {
    spotifyApi.setAccessToken(data.body['access_token']);
    console.log("Olé")
  }, function(err) {
    console.log('Something went wrong when retrieving an access token', err);
});


app.use(express.static(path.join(__dirname, '/public')));

app.set('views', path.join(__dirname, '/public/views'))
app.set('view engine', 'hbs');

app.get("/", (req, res) => {
    res.render("index");
})

app.get("/search", (req, res) => {
    res.send(req.query);
})

app.get("/artists", (req, res, next) => {
    spotifyApi.searchArtists(req.query.artist).then(info => {
        console.log(info.body);
        console.log(info.body.artists);
        console.log(info.body.artists.items);
        let artists = info.body.artists.items;
        console.log(artists);
        res.render("artists", { artists });
      })
      .catch(err => {
        console.log(err);
      })
  });


app.listen(3000)

//   // Get Elvis' albums
// spotifyApi.getArtistAlbums('43ZHCT0cAZBISjO8DG9PnE').then(
//     function(data) {
//       console.log('Artist albums', data.body);
//     },
//     function(err) {
//       console.error(err);
//     }
//   );