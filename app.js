require('dotenv').config();

const express = require('express');
const hbs = require('hbs');

// require spotify-web-api-node package here:
const SpotifyWebApi = require('spotify-web-api-node');
const app = express();


app.use(express.json());
app.use(express.urlencoded({
    extended: true
}));





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
    res.render('index')
})



app.get('/artist-search', (req, res) => {
    // res.render('artist-search-results')
    // const artist = req.body
    console.log(req.query.artist)
    spotifyApi
        .searchArtists(req.query.artist)
        .then(data => {
            console.log('The received data from the API: ', data.body.artists.items);
            // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
            res.render('artist-search-results', {
                data
            })
        })
        .catch(err => console.log('The error while searching artists occurred: ', err));

})

app.get('/albums/:id', (req, res) => {
    spotifyApi
        .getArtistAlbums(req.params.id)
        .then(data => {
            console.log('The received data from the API: ', data.body.items[0].artists[0].name);
            // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
            res.render('albums', {
                data
            })
        })
        .catch(err => console.log('The error while searching artists occurred: ', err));
})


app.get('/tracks/:id', (req, res) => {
    spotifyApi
        .getAlbumTracks(req.params.id)
        .then(data => {
            console.log('The received data from the API: ', data.body);
            // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
            res.render('track', {
                data
            })
        })
        .catch(err => console.log('The error while searching artists occurred: ', err));
})


app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));