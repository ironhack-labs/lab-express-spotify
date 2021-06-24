require('dotenv').config();

const express = require('express');
const hbs = require('hbs');

// require spotify-web-api-node package here:
const SpotifyWebApi = require('spotify-web-api-node')

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
    .then(data => {
        spotifyApi.setAccessToken(data.body['access_token'])
        console.log(data)
    })
    .catch(error => console.log('Something went wrong when retrieving an access token', error));

// Our routes go here:
app.get("/", (req, res, next) => {
    res.render("index");
});
app.get("/artist-search", (req, res) => {
    //res.send('holaaaa')
    const { artist } = req.query
    spotifyApi
        .searchArtists(artist)
        .then(data => {
            // console.log('The received data from the API: ', data.body);
            // console.log('The received data from the API: ', data.body.artists.items[0]);
            // console.log('The received data from the API: ', data.body);
            // console.log('The received data from the API: ', data.body);
            // // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
            // res.send(data.body.artists.items[0].id)
            const firstSix = data.body.artists.items
            res.render('artist-search-results', { firstSix })
        })
        .catch(err => console.log('The error while searching artists occurred: ', err));
    // res.send(artist)
})
app.get('/albums/:id', (req, res) => {
    const { id } = req.params
    console.log('El id es ', id)
    spotifyApi.getArtistAlbums(id)
        .then(data => {
            // console.log('Artist albums', data.body.items)
            const discos = data.body.items
            // console.log('hola', discos[0])
            res.render('albums', { discos })
        })
    //tenemos que renderisar la pagina con discos
    //con el id y el Api tenemos que sacar la lista de discos
})
app.get('/view-tracks/:id', (req, res) => {
    const { id } = req.params
    spotifyApi.getAlbumTracks(id, { limit: 5, offset: 1 })
        .then(data => {
            const tracks = data.body.items
            console.log('loco', tracks)
            res.render('view-tracks', { tracks })
        }, function (err) {
            console.log('Something went wrong!', err);
        });
})
app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
