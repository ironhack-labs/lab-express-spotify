const express = require('express');
const app = express();
const hbs = require('hbs');
var SpotifyWebApi = require('spotify-web-api-node');


// my template files are in the "views/" folder
app.set("views", __dirname + "/views"); 
// I am using the "hbs" package from npm for my view engine
app.set("view engine", "hbs");
// I am using layout.hbs for my layout file
app.set("layout", __dirname + "/views/layout.hbs")


// This is my route to home page
app.get("/", (req, res, next) => { //request, response, next
    res.render("home-page");
});

//direct its query to /artists, and have one input with a name of artist.
app.get('/artists', function (req, res, next) {
    //res.send(req.params); // the container of all our URL parameters
    console.log(req.params.artist);
    
    spotifyApi.searchArtists(req.query.artist) //'HERE GOES THE QUERY ARTIST'
    .then(data => {
        let myArtist = data;
        console.log(myArtist.body.artists.items); //'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
        let listArtists = myArtist.body.artists.items;
        console.log(listArtists[0].images)
        res.render("artists.hbs", {listArtists});
    })
    
    .catch(err => {
        console.log("Hello, Maggie. You have an error", err);
    })
})

// This is my route to albums page
app.get('/albums/:artistId', (req, res, next) => {
    spotifyApi.getArtistAlbums(req.params.artistId) 
    .then(data => {
        res.render("albums.hbs");
    })
    .catch(err => {
        console.log("Hello, Maggie. You have an error", err);
    })
})



// my credentials
var clientId = '168dfc06abed4832802290ef9507eb9f',
    clientSecret = '87dc3b322d004e09ac3315fc73f77436';

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

app.listen(3000, () => console.log('Example app listening on port 3000!'))