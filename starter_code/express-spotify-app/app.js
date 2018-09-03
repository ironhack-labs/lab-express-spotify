const express = require('express');
const app = express();
const hbs = require('hbs');

app.use(express.static(__dirname + "/public"));

app.set("views engine", "hbs");
app.set("views", __dirname + "/views");

var SpotifyWebApi = require('spotify-web-api-node');

// Remember to paste here your credentials
var clientId = 'bc89116aa73a4d11a922c1fcb0ac12de',
    clientSecret = '6a8933a2dcb040178d597f34e5840ae9';

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

// Routes

app.get("/", (request, response, next) => {
    response.render("home-page.hbs");
});

app.get("/artists", (request, response, next) => {
    const { artist } = request.query;
    response.locals.artist = artist;

    spotifyApi.searchArtists( artist )
    .then(data => {
        // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
        console.log("Connection SUCCESS", data);
        response.locals.artistList = data.body.artists.items;
        // response.json( data )
        response.render("search-results.hbs");
    })
    .catch(err => {
      // ----> 'HERE WE CAPTURE THE ERROR'
      console.log("ERROR!!!!", err);
    })
});

app.get('/albums/:artistId', (req, res) => {
    res.locals.artistId = data.body.items.artists[0].id;
    
    spotifyApi.getArtistAlbums( artistId )
    .then(data => {
        // res.json( data )
        console.log("success ALBUM")
        response.locals.albumList = data.body.items;
        res.render("album-page.hbs");
    })
    .catch(err => {
        console.log("FAIIIIIL ALBUM")
    })

  });







// Listen

app.listen(3000, () => {
    console.log("SPOTIFY API Ready 👨🏼‍🎤")
})