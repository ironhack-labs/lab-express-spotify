var SpotifyWebApi = require('spotify-web-api-node');
const express = require('express');
const app = express();
const hbs = require('hbs');

app.use(express.static(__dirname + "/public"));

app.set("view engine", "hbs");

// Remember to paste here your credentials
var clientId = 'abfaac26917e4cacac4d3ae6625e5e76',
    clientSecret = '8e6181eb2a4e4249b8b3009c41c58465';

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
// -------------------------------------------------
app.get("/", (request, response, next) => {
    response.render("home-page.hbs");
});

app.get("/artists", (request, response, next) => {
    const { artist } = request.query;


    spotifyApi.searchArtists( artist )
    .then(data => {

        response.locals.artistList = data.body.artists.items;
        //response.json(data.body.artists.items);
        response.render("artists.hbs");
    })
    .catch(err => {
        console.log("error", err);
    })
});

app.get('/albums/:artistId', (request, response, next) => {
    const { artistId } = request.params;

    spotifyApi.getArtistAlbums( artistId )
    .then(data => {

        //response.json(data.body.items);
        response.locals.myArtistId = artistId;
        response.locals.albumList = data.body.items;
        response.render("albums.hbs");

    }) 

    .catch(err => {
        console.error("error", err);  
    })

});


app.listen(3000, () => {
    console.log("Ready! 🎧");
});