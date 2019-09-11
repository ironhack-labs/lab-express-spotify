require('dotenv').config()

const express = require('express');
const hbs = require('hbs');
const bodyParser = require('body-parser');

// require spotify-web-api-node package here:
const SpotifyWebApi = require("spotify-web-api-node");


const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({
    extended: true
}));

hbs.registerPartials(__dirname + '/views/partials')

// setting the spotify-api goes here:
const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET
});

// Retrieve an access token
spotifyApi
    .clientCredentialsGrant()
    .then(data => {
        spotifyApi.setAccessToken(data.body["access_token"]);
    })
    .catch(error => {
        console.log("Something went wrong when retrieving an access token", error);
    });


// the routes go here:
app.get('/', (req, res) => {
    res.render('index')
});

app.post('/artists', (req, res) => {
    let artist = req.body.artistName
    console.log(`Artist Search: ${artist}`)

    spotifyApi
        .searchArtists(artist)

        .then(data => {
            //  console.log("The received data from the API: ", data.body);
            // console.log(data.body.artists.items[0])
            let dataArtists = data.body.artists.items
            // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
            res.render('artists', {
                dataArtists
            })
        })

        .catch(err => {
            console.log("The error while searching artists occurred: ", err)
        });
})

app.get("/albums/:artistId", (req, res, next) => {
    spotifyApi
        .getArtistAlbums(req.params.artistId)
        .then(data => {
            //console.log('Artist albums =========>>> ', data.body)
            let artistAlbums = data.body.items
            res.render('artist-albums', {
                artistAlbums
            })
        })
        .catch(err => {
            console.log("The error while searching artists occurred: ", err)
        });
});

app.get("/album/tracks/:albumId", (req, res, next) => {
    // Get tracks in an album
    spotifyApi.getAlbumTracks(req.param.albumId)
        .then(function (data) {
            console.log(data.body);
            let albumTracks = data.body.items
            res.render('album-tracks', {
                albumTracks
            })
        }, function (err) {
            console.log('Something went wrong!', err);
        });
})


app.listen(3000, () => console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊"));