require('dotenv').config();

const express = require('express');
const hbs = require('hbs');
const SpotifyWebApi = require('spotify-web-api-node')

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

const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

// Our routes go here:
app.get("/", (req, res) => {
    res.render('index')
})
console.log()
//FORM REDERING
app.get("/artist-search", (req, res) => {
    const { artist } = req.query

    spotifyApi
        .searchArtists(artist)
        .then(data => {
            const resume = data.body.artists.items
            console.log('The received data from the API: ', resume);
            // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
            // res.send(resume)
            res.render('artist-search-results', {resume})
        })
        .catch(err => console.log('The error while searching artists occurred: ', err));
})

app.get("/albums/:artistId", (req, res) => {

    const { artistId } = req.params

    spotifyApi
        .getArtistAlbums(artistId)
        .then(data => {
            console.log(req.params)
            //console.log('Artist albums', data.bo);
        })
        .catch(err => console.log('The error while searching artists occurred: ', err))
})


app.listen(5005, () => console.log('My Spotify project running on port 5005 🎧 🥁 🎸 🔊'));
