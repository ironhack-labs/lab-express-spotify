require('dotenv').config();

const express = require('express');
// const hbs = require('hbs');

// require spotify-web-api-node package here:
const SpotifyWebApi = require('spotify-web-api-node')

const app = express();

app.set('view engine', 'hbs');
app.set('views', `${__dirname}/views`);
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

    const { artistName } = req.query

    spotifyApi
        .searchArtists(artistName)
        .then(data => {
            const info = data.body.artists.items
            // info.forEach(artist => artist.images.forEach(image => console.log(image)))
            // console.log('The received data from the API: ', info.images);
            // console.log('----------------------------------------------')
            // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
            res.render('artist-search-results', { info })
        })
        .catch(err => console.log('The error while searching artists occurred: ', err))
})

app.get('/albums/:artistId', (req, res, next) => {
    const { artistId } = req.params

    spotifyApi
        .getArtistAlbums(artistId)
        .then(data => {
            const album = data.body.items
            console.log(album)
            // album.forEach(album => album.images.forEach(image => console.log(image)))
            res.render('albums', { album })
        })
        .catch(err => console.log('The error while searching artists albums occurred: ', err))
})


app.get('/:albumId/tracks', (req, res) => {

    const { albumId } = req.params

    spotifyApi
        .getAlbumTracks(albumId)
        .then(data => {
            const tracks = data.body.items
            res.render('tracks', { tracks })
        })
        .catch(err => console.log('The error while searching artists albums occurred: ', err))

})



app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
