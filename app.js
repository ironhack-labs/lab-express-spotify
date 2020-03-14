require('dotenv').config();

const express = require('express');
const hbs = require('hbs');

// require spotify-web-api-node package here:
const SpotifyWebApi = require('spotify-web-api-node');

const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

// setting the spotify-api goes here:
const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET
});

// Retrieve an access token
spotifyApi
    .clientCredentialsGrant()
    .then(data => spotifyApi.setAccessToken(data.body['access_token']))
    .catch(error => console.log('Something went wrong when retrieving an access token', error));
// Our routes go here:

app.get("/", (req, res, next) =>
    res.render("index")
)

app.get("/artist-search", (req, res, next) => {
    const theArtist = req.query.artist;
    spotifyApi
        .searchArtists(theArtist)
        .then(data => {
            /*console.log('The received data from the API: ', {
                data: data.body.artists.items.images
            });*/
            res.render("artist-search-results", {
                theArtists: data.body.artists.items
            })
        })
        .catch(err => console.log('The error while searching artists occurred: ', err));

})

app.get("/albums/:id", (req, res, next) => {
    const idArtist = req.params.id;
    spotifyApi
        .getArtistAlbums(idArtist, { limit: 5 })
        .then(data => 
            res.render("albums", {data : data.body.items}))
            .catch(err => console.log('The error while searching albums occurred: ', err));
})

app.get("/tracks/:id", (req, res, next) => {
    const idTracks = req.params.id;
    spotifyApi
    .getAlbumTracks(idTracks, { limit : 6 })
    .then(data => 
        res.render("album-tracks", {tracks : data.body.items}))
        .catch(err => console.log("The error while searching tracks occurred: ", err));
}

)

app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));