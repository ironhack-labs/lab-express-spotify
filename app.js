const SpotifyWebApi = require('spotify-web-api-node');
require('dotenv').config();
const express = require('express');
const hbs = require('hbs');

// require spotify-web-api-node package here:
const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET
});           
spotifyApi
    .clientCredentialsGrant()
    .then(data => spotifyApi.setAccessToken(data.body['access_token']))
    .catch(error => console.log('Something went wrong when retrieving an access token', error));
const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

// setting the spotify-api goes here:

// Our routes go here:
app.get("/", (req,res) =>{
res.render("index");
})

app.get("/artist-search", (req,res) =>{
    spotifyApi
    .searchArtists(req.query.theArtistName).then((data) =>{
        res.render("artist-search-result",{artists: data.body.artists.items});
    })
    .catch((error) =>console.log("hay un error en la busqueda"))
})

app.get("/albums/:artistId", (req,res,next) =>{
    spotifyApi
    .getArtistAlbums(req.params.artistId)
    .then((data) => {
        res.render('albums', { albums: data.body.items})
    })
    .catch((error) =>console.log("Ya hubo falla", error))
})
app.get("/tracks/:albumId", (req,res,next) =>{
    spotifyApi
    .getAlbumTracks(req.params.albumId).then((data) => {
        console.log(data.body.items);
        res.render('tracks',{tracks:data.body.items})
    })
})

app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
                    