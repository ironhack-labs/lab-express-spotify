const express = require('express');
const hbs = require('hbs');
const SpotifyWebApi = require('spotify-web-api-node');
// require spotify-web-api-node package here:



const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));


// setting the spotify-api goes here:

const clientId = 'b006a6b42aaf4a5794d969f474676551',
    clientSecret = '64a34a5d6de3409cbb61463ddc3a1cc3';

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



app.get("/", (req, res, next) => {
    res.render("index")
});


// the routes go here:
app.get('/artists', (req, res, next) => {
    let artist = req.query.search;
    spotifyApi.searchArtists(artist)
        .then(data => {
            let artistsList = data.body.artists.items;
            console.log(data.body);
            res.render("artists", {
                artistsList
            })
        })
        .catch(err => {
            console.log("The error while searching artists occurred: ", err);
        })
})


app.get('/albums/:artistId', (req, res, next) => {
    const artistId = req.params.artistId;
    spotifyApi.getArtistAlbums(artistId)
        .then(data => {
            let albumList = data.body.items;
            res.render("albums", {
                albumList
            })
        })
        .catch(err => {
            console.log("The error while searching albums occurred: ", err);
        })
})

app.get('/tracks/:albumId', (req, res, next) => {
    const albumId = req.params.albumId;
    spotifyApi.getAlbumTracks(albumId)
        .then(data => {
            console.log(req.params.albumId)
            let trackList = data.body.items;
            res.render("tracks", {
                trackList
            })
        })
        .catch(err => {
            console.log("The error while searching albums occurred: ", err);
        })
})

app.listen(3500, () => console.log("My Spotify project running on port 3004 🎧 "));