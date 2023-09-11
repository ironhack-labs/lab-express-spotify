require('dotenv').config();

const express = require('express');
const hbs = require('hbs');
const SpotifyWebApi = require('spotify-web-api-node');

// require spotify-web-api-node package here:

const app = express();
app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));

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

app.get("/", (req, res) => 
{
    res.render("index")
})

app.get("/artist-search", (req, res) => 
{
    const artistName = req.query.artistName;

    spotifyApi
    .searchArtists(artistName)
    .then(data => 
    {
        const artistData = data.body.artists.items;

        console.log('The received data from the API: ', data.body);

        res.render("artist-search-results", {artistData})
    })
    .catch(err => console.log('The error while searching artists occurred: ', err));
})

app.get('/albums/:artistId', (req, res, next) => 
{
    const {artistId} = req.params;

    spotifyApi
    .getArtistAlbums(artistId)
    .then((data) => 
    {
        const albumData = data.body.items

        res.render("albums", {albumData})
    })
    .catch(err => console.log('The error while searching album occurred: ', err));
});

app.get('/tracks/:albumId', (req, res, next) => 
{
    const {albumId} = req.params;

    spotifyApi
    .getAlbumTracks(albumId)
    .then((data) => 
    {
        const tracksData = data.body.items;

        res.render("tracks", {tracksData})
    })
    .catch(err => console.log('The error while searching album occurred: ', err));
});