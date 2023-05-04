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
app.get('/', (req, res) => {
    res.render("index-page")
})
app.get('/artist-search', (req, res) => {
    const { artist } = req.query
    console.log("Estas buscando a", req.query)

    spotifyApi
        .searchArtists(artist)
        .then(data => {
            // console.log('The received data from the API: ', data.body.artists.items);
            // ----> 'HERE'S WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
            // res.send(data.body.artists.items)
            res.render("artists-page", { artistsFromSpotify: data.body.artists.items })
        })
        .catch(err => console.log('The error while searching artists occurred: ', err));

})
app.get('/albums/:artistId', (req, res) => {
    const { artistId } = req.params
    console.log("Este es el id al que le has hecho click", artistId)


    spotifyApi
        .getArtistAlbums(artistId)
        .then(data => {
            //console.log("-----------ARTIST BY ID", data.body)
            res.render("albums", { albumsById: data.body })
        })
        .catch(err => console.log('The error while searching artists occurred: ', err));

})

app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
