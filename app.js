require('dotenv').config();

const express = require('express');
const hbs = require('hbs');
const SpotifyWebApi = require('spotify-web-api-node');
const spotifyWebApi = require('spotify-web-api-node');
// require spotify-web-api-node package here:
const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

// setting the spotify-api goes here:

const spotifyApi = new SpotifyWebApi({

    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET
})

spotifyApi
    .clientCredentialsGrant()
    .then(data => spotifyApi.setAccessToken(data.body['access_token']))
    .catch(error => console.log('Something wrong with token', error))

// Our routes go here:

app.get('/', (req, res) => {

    console.log('at the route')
    res.render('home')
})

app.get('/artist-search', (req, res) => {

    const query = req.query.artistname
    console.log(query)
    spotifyApi.searchArtists(query)
        // .then(data => { console.log(data.body.artists) })
        .then(filteredArtists => {
            console.log(filteredArtists.body.artists.items)
            res.render('artist-search', { artistList: filteredArtists.body.artists.items })
        })
        .catch(err => console.log('could not retrieve artists', err))

})


app.get('/albums/:id', (req, res, next) => {

    const clickedArtist = req.params.id
    console.log(clickedArtist)
    spotifyApi.getArtistAlbums(clickedArtist)
        .then(albumList => {
            console.log(albumList.body.items)
            res.render('albums', { albumList: albumList.body.items })
        })
})

app.get('/songs/:id', (req, res) => {

    const clickedArtist = req.params.id
    spotifyApi.getAlbumTracks(clickedArtist)
        .then(songsList => {
            console.log(songsList.body.items)
            res.render('songs', { songsList: songsList.body.items })
        })
})




app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
