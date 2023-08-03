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
    res.render('home-page')

})



app.get('/artist-search', (req, res) => {

    // console.log(req.query)

    spotifyApi
        .searchArtists(req.query.artist)
        .then(data => {

            // console.log('The received data from the API: ', data.body);
            // res.send(data.body)

            res.render('artist-search-results', { elements: data.body.artists.items })

            // elementos es la propiedad del objeto princpila, que tiene
            // en su interior un array  data.body...etc.

        })
        .catch(err => console.log('The error while searching artists occurred: ', err));


})


app.get('/albums/artistId', (req, res, next) => {

    // console.log(req.params)

    spotifyApi
        .getArtistAlbums(req.params.artistId)
        .then(data => {
            res.render('albums')
        })
        .catch(err => console.log('The error while searching artists occurred: ', err));

})







app.listen(5005, () => console.log('My Spotify project running on port 5005 🎧 🥁 🎸 🔊'));
