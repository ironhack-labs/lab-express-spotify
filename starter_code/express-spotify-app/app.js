var SpotifyWebApi = require('spotify-web-api-node');
const express = require('express');
const app = express();
const hbs = require('hbs');

app.use(express.static(__dirname + "/public"))

app.set("views", __dirname + "/views");
app.set("view engine", "hbs");
app.set("view options", { layout: "layouts/layout.hbs" });


// Remember to paste here your credentials
var clientId = '395e730a177241678a2bbc65f1c8739b',
clientSecret = '73b7142c41724033860de1be016bfdd1';

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

app.get("/", (req,res,next) => {
    res.render("home-page")
})



app.get("/search", (req,res,next) =>{
    spotifyApi.searchArtists(req.query.artist)
    .then(data => {
        // console.log(data.body.artists.items[0].id)
        res.locals.artistsArray = data.body.artists.items
        res.render('artists')
        
    })
    .catch(err => {
        console.log("Error with spotify api:")
    })
})

app.get('/albums/:artistId', (req, res) => {
    
    spotifyApi.getArtistAlbums(req.params.artistId)
    .then(data => {
        res.locals.albumsArray = data.body.items
        res.render('albums')
        
    })
    .catch(err => {
        console.error("Error with spotify API: Album Search");
    });
    
    
});

app.get('/tracks/:albumId', (req, res) => {
    
    spotifyApi.getAlbumTracks(req.params.albumId)
    .then(data => {
        res.locals.tracksArray = data.body.items
        res.render('tracks')
        
    })
    .catch(err => {
        console.error("Error with spotify API: Album Search");
    });
    
    
});

app.listen(3000,() =>{
    console.log("App's running")
})