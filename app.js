require('dotenv').config();

const express = require('express');
const hbs = require('hbs');
const SpotifyWebApi = require('spotify-web-api-node');

// require spotify-web-api-node package here:

const app = express();

app.set('views', __dirname + '/views');
app.set('view engine', 'hbs');
app.use(express.static(__dirname + '/public'));
hbs.registerPartials(__dirname + '/views/partials');

// setting the spotify-api goes here:

const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET
});

// Retrieve an access token
spotifyApi
    .clientCredentialsGrant()
    .then(data => {
        spotifyApi.setAccessToken(data.body['access_token'])
        console.log("entra credentials");
    }
    )

    .catch(error => console.log('Something went wrong when retrieving an access token', error));

// Our routes go here:



app.get('/', (req, res) => {
    console.log("estamos dentro del get")
    res.render('index')

})

app.get('/artist-search', (req, res) => {
    const { artist } = req.query
    console.log(artist)

    spotifyApi
        .searchArtists(artist)
        .then(data => {
            console.log('The received data from the API: ', data.body);
            const { items } = data.body.artists
            res.render("artist-search-results", { items });
        })
        .catch(err => console.log('The error while searching artists occurred: ', err));


})

app.get('/albums/:artistId', (req, res, next) => {
    spotifyApi
        .getArtistAlbums()
        .then(data => {
            console.log('dentro')
            const { items } = data.body.artists
            res.render("albums", { items });
        })
        .catch(err => console.log('The error while searching artists occurred: ', err));

});

app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
