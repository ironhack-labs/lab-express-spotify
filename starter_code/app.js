require('dotenv').config();

const express = require('express');
const hbs = require('hbs');
const SpotifyWebApi = require('spotify-web-api-node');

// require spotify-web-api-node package here:
const bodyParser = require('body-parser');
const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({ extended: true }));


// setting the spotify-api goes here:
const clientId = process.env.API_CLIENT,
    clientSecret = process.env.API_SECRET;

const spotifyApi = new SpotifyWebApi({
    clientId: clientId,
    clientSecret: clientSecret
});

// Retrieve an access token
spotifyApi.clientCredentialsGrant()
    .then(data => {
        spotifyApi.setAccessToken(data.body['access_token']);
    })
    .catch(error => {
        console.log('Something went wrong when retrieving an access token', error);
    })


// the routes go here:
app.get("/", (req, res) => {
    res.render('index')
})

app.get("/artists", (req, res) => {
    spotifyApi.searchArtists(req.query.artist)
        .then(data => {
            // console.log(data)
            //   console.log("The received data from the API: ", );
            // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
            res.render('artists', { artists: data.body.artists.items })
        })
        .catch(err => {
            console.log("The error while searching artists occurred: ", err);
        })

})
app.get("/albums/:artistId", (req, res) => {
    spotifyApi.getArtistAlbums(req.params.artistId)
        .then(data => {
            console.log(data.body.items);
            let albums = data.body.items;
            res.render('albums', { albums })
        })
        .catch(err => {
            console.log(err)
        })

})

app.get("/tracks/:albumId", (req, res) => {
    spotifyApi.getAlbumTracks(req.params.albumId)
        .then(data => {
            console.log(data.body.items);
            let tracks = data.body.items;
            res.render('tracks', { tracks })
        })
        .catch(err => {
            console.log(err)
        })
        
})


module.exports = app

app.listen(3000, () => console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊"));
