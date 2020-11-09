require('dotenv').config();

const express = require('express');
const hbs = require('hbs');
hbs.registerPartials(`${__dirname}/views/partials`);


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
    .then(data => spotifyApi.setAccessToken(data.body['access_token']))
    .catch(error => console.log('Something went wrong when retrieving an access token', error));

// Our routes go here:
// const index = require('./routes/index.routes')
// app.use('/', index)
app.get('/', (req, res) => {
    res.render('index')
})
app.get('/artist-search', (req, res) => {
    spotifyApi
        .searchArtists(req.query.artist)
        .then(data => {
            // console.log("------------------------")
            // console.log('The received data from the API: ', data.body.artists.items);
            // console.log("forEach -------------------------")
            data.body.artists.items.forEach(element=>console.log(element))
            res.render('artist-search-results', {data: data.body.artists.items})
        })
        .catch(err => console.log('The error while searching artists occurred: ', err));

})

app.get('/artist/:id', async (req, res) => {
    let albums = await spotifyApi.getArtistAlbums(req.params.id)
    // console.log("Albums--------------")
    // console.log(albums.body.items)
    res.render('albums', {data: albums.body.items})
})
app.get('/album/:id', async (req, res) => {
    console.log("sdasd")
    // console.log(id)
    let tracks = await spotifyApi.getAlbumTracks(req.params.id)
    console.log("Tracks baby!- ---- - -- --- -- - - - - - - - -  ")
    console.log(tracks.body.items)
    res.render('tracks', {data: tracks.body.items})
})
app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));

