require('dotenv').config();

const express = require('express');
const hbs = require('hbs');

const SpotifyWebApi = require('spotify-web-api-node')

const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

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
    res.render('index')
})

app.get('/artist-search', (req, res) => {



    const { artist } = req.query

    spotifyApi
        .searchArtists(artist)
        .then(data => {
            console.log('The received data from the API: ', data.body);
            res.render('artist-search-results', { artists: data.body.artists.items })
            // console.log(' -----', data.body.artists.items)
            // ----> 'HERE'S WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
            //res.send(data.body)
        })
        .catch(err => console.log('The error while searching artists occurred: ', err));



})

app.get('/albums/:artistId', (req, res, next) => {

    const { artistId } = req.params
    console.log(artistId)

    spotifyApi
        .getArtistAlbums(artistId)
        .then(data => {
            // console.log('The received data from the API: ', data.body);
            res.render('albums', { albums: data.items })
            // console.log(' -----', data.body.artists.items)
            // ----> 'HERE'S WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
            //res.send(data.body)
        })
        .catch(err => console.log('The error while searching artists occurred: ', err));

})


app.listen(5005, () => console.log('My Spotify project running on port 5005 🎧 🥁 🎸 🔊'));
