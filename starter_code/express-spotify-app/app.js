const express = require("express");
const hbs = require("hbs");
const app = express();
const morgan = require("morgan");
const bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + "/public"));

app.set("views", __dirname + "/views");
app.set("view engine", "hbs");
app.set("layout", __dirname + "/views/layout.hbs");

var SpotifyWebApi = require('spotify-web-api-node');

// Remember to paste here your credentials
var clientId = 'faf5ded6a47e4c81962d816ec9d974ae',
    clientSecret = '76771f0a96c94aa095dfec3f984cd3a2';

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

app.get('/', (request, response, next) => {
    response.render("home-page");
    
});

// app.get('/artists/:artist', (request, response, next) => {
//     // response.render("artists");
//     // .then(data => {

//     // })
//     // .catch(err => {

//     // })
// });
////this code works 
app.get('/artists', (request, response, next) => {
    const search = request.query.artist
    spotifyApi.searchArtists(search).then(responseObject => {
        const artistObject = responseObject.body.artists.items[0]
        const artist = {
            name: artistObject.name,
            imageUrl: artistObject.images[0].url
        }
        response.render('artists', {artist: artist})
    })
});

// app.get('/artists', (request, response, next) => {
//     const search = request.query.artist
//     spotifyApi.searchArtists(search).then(responseObject => {
//         const artistObject = responseObject.body.artists.items
//         // for (let i=0; i<artistObject.length; i++) {
//         // const artist = {
//         //     name: artistObject.name,
//         //     imageUrl: artistObject.images[0].url
//         // }
//     // }
//         response.render('artists', {artist: artist})
//     })
// });

app.listen(3000, () => {
    console.log("Up and running");
});