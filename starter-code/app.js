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
// spotifyApi.setAccessToken('<your_access_token>');

spotifyApi
    .clientCredentialsGrant()
    .then(data => spotifyApi.setAccessToken(data.body['access_token']))
    .catch(error => console.log('Something went wrong when retrieving an access token', error));


// Our routes go here:

app.get("/", (request, response) => {
    response.render("home")
})

app.get("/artist-search", (request, response) => {
    console.log('artist')
    const userInput = request.query.artist
    spotifyApi
        .searchArtists(userInput)
        .then(data => { //placeholder 
            console.log('The received data from the API: ', data.body.artists.items);
            // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
            response.render('artist-search-results.hbs', { results: data.body })
        })
        .catch(err => console.log('The error while searching artists occurred: ', err));
});


app.get("/album/:id", (request, response) => {
    console.log('albumsList')
    const artistId = request.params.id
    spotifyApi
        .getArtistAlbums(artistId)
        .then(data => { //placeholder 
            console.log('The received data from the API: ', data.body)
            response.render("album.hbs", { albums: data.body.items })
        })
        .catch(err => console.log('The error while searching artists occurred: ', err));
});

app.get("/tracks/:id", (request, response) => {
    console.log('trackList')
    const albumTracks = request.params.id
    spotifyApi
        .getAlbumTracks(albumTracks)
        .then(data => { //placeholder 
            console.log('The received data from the API: ', data.body)
            response.render("tracks.hbs", { tracks: data.body.items })
        })
        .catch(err => console.log('The error while searching artists occurred: ', err));
});


app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
