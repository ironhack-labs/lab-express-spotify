const express = require('express');
const SpotifyWebApi = require('spotify-web-api-node');
const hbs = require('hbs');
const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

const spotifyApi = new SpotifyWebApi({
    clientId: '2083e5b9f5204d4fa72674f93eefcbbe',
    clientSecret: '6867aca1d0a145e2a0d7e71a7d284887'
});

// Retrieve an access token.
spotifyApi.clientCredentialsGrant()
    .then(data => {
        spotifyApi.setAccessToken(data.body['access_token']);
    })
    .catch(error => {
        console.log('Something went wrong when retrieving an access token', error);
    })


app.get('/', (req,res,next) => {
    res.render("index")
})

app.get('/artists', (req,res,next) => {
    spotifyApi.searchArtists(req.query.artist)
    .then(data => {
        console.log(data.body)
        res.render("artists", {list: data.body.artists.items})
    })
    .catch(err => {
        console.log("The error while searching artists occurred: ", err);
    })
})

app.get('/albums/:artistId', (req, res, next) => {
    spotifyApi.getArtistAlbums(req.params.artistId)
    .then(data => {
        console.log(data.body)
        res.render("albums", {list: data.body.items})
    })
    .catch(err => {
        console.log("The error while searching albums occurred: ", err);
    })
})

app.get('/tracks/:id', (req, res, next) => {
    spotifyApi.getAlbumTracks(req.params.id)
    .then(data => {
        console.log(data.body)
        res.render("tracks", {list: data.body.items})
    })
    .catch(err => {
        console.log("The error while searching albums occurred: ", err);
    })
})

app.listen(4000, () => console.log("My Spotify project running on port 4000 🎧 🥁 🎸 🔊"));