require('dotenv').config();

const express = require('express');
const hbs = require('hbs');
const SpotifyWebApi = require('spotify-web-api-node');

// require spotify-web-api-node package here:


const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET
  });
  
  // Retrieve an access token
  spotifyApi
    .clientCredentialsGrant()
    .then(data => {
        spotifyApi.setAccessToken(data.body['access_token'])
        console.log('Worked', data.body['access_token'])
})
    .catch(error => console.log('Something went wrong when retrieving an access token', error));

const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

// setting the spotify-api goes here:

// Our routes go here:
app.get("/", (req, res, next) => {
    console.log("We have a user in the Home Page! :) ")
    res.render("home-page");
})

app.get("/artist-search-result", (req, res, next) => {
    const artist = req.query.artistName

    spotifyApi
    .searchArtists(artist)
        .then((data) => {
            //const artistArr = data.body.artists.items[0]
            res.render("artist-search-result", data.body)
            //console.log("we are hereeee", data.body)
        })
        .catch((err) => console.log("ops, error", err))
}) 

app.get('/albums/:artistId',(req, res, next) => {
    
    spotifyApi
        .getArtistAlbums(req.params.artistId)
        .then((data) => {
            const albums = data.body.items
            res.render("albums", { albums })
            //console.log("artistAlbum", data.body)
        })
        .catch((err) => {console.log("ops error", err)})
})

app.get('/track-info/:albumId', (req, res, next) => {

    console.log(req.params)
    spotifyApi
    .getAlbumTracks(req.params.albumId)
    .then((data)=> {
        const tracks = data.body.items
        res.render('track-info', { tracks })
    })
    .catch((err) => {console.log("ops, error", err)
    })
})


app.listen(3001, () => console.log('My Spotify project running on port 3001 🎧 🥁 🎸 🔊'));
