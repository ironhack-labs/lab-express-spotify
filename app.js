require('dotenv').config();

const express = require('express');
const hbs = require('hbs');
const axios = require("axios");
const PORT = 3000;
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
    // res.send('hi')
    res.render('homePage', {
        style: 'homeStyle'
    })
})
app.get('/artist-search', (req, res) => {
    const searchParam = req.query.artistName
    console.log(searchParam)
    spotifyApi
        .searchArtists(searchParam)
        .then(data => {
            console.log('The received data from the API: ', data.body);
            // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
            // res.send(data.body.artists.items)
            // res.send(searchParam)
            const filteredArtists = data.body.artists.items.filter(artist => artist.name.toLowerCase().includes(searchParam.toLowerCase())
            )
            // res.send(data.body.artists.items[2].name)
            // console.log(filteredAlbums)
            res.render('artists-search-results', {
                artist: filteredArtists,
                style: 'artistAlbumStyle'
            })
            // res.send(searchParam.toLowerCase())
        })
        .catch(err => console.log('The error while searching artists occurred: ', err));

    // console.log(req.query.q)
})

app.get('/albums/:artistId', (req, res, next) => {
    const artistId = req.params.artistId
    spotifyApi.getArtistAlbums(artistId)
        .then(function (data) {
            console.log('Artist albums', data.body);
            // res.send(data.body)
            // const filteredAlbums = data.body.items.filter(item => item.artists.id === artistId)
            // res.send(filteredAlbums)
            // res.send(data.body.items[0].artists[0].id)
            res.render('albums', {
                albumArr: data.body.items,
                style: 'artistAlbumStyle'
            })
        }, function (err) {
            console.error(err);
        });
});

app.get('/tracks/:albumId', (req, res, next) => {
    const albumId = req.params.albumId
    spotifyApi.getAlbumTracks(albumId, { limit: 5, offset: 1 })
        .then(function (data) {
            console.log(data.body);
            // res.send(data.body)
            res.render('tracks', {
                trackArr: data.body.items,
                style: 'tracks'
            })
        }, function (err) {
            console.log('Something went wrong!', err);
        })
});
app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
