require('dotenv').config();

const express = require('express');
const hbs = require('hbs');
const path = require('path')

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
    .catch(error => console.log('Something went wrong when retrieving an access token', error))



// Our routes go here:

app.get('/', (req, res) => {
    //res.send('HOLAAAA')
    res.render('home-page')
})

app.get('/artist-search', (req, res) => {

    const { artistSearch } = req.query
    // lo mismo ---> const artistSearch = req.query.artistSearch

    spotifyApi
        .searchArtists(artistSearch)
        .then(data => {
            let response = data.body.artists.items

            res.render('artist-search-results', { response })
        })
        .catch(err => console.log('The error while searching artists occurred: ', err));

})

app.get('/albums/:artistId', (req, res, next) => {

    // res.render('albums')
    spotifyApi
        .getArtistAlbums(req.params.artistId)
        .then(data => {
            let responseAlbum = data.body.items
            console.log(req.params.artistId)
            console.log('Artist albums', { responseAlbum });
            res.render('albums', { responseAlbum })

        })
        .catch(err => console.log('The error while searching artists occurred: ', err));
})

app.get('/tracks', (req, res, next) => {



    res.render('tracks')
    // spotifyApi
    //     .getAlbumTracks(req.params.artistId, { limit: 5, offset: 1 })
    //     .then(data => {
    //         let responseTrack = responseAlbum.items

    //     })
    //     .catch(err => console.log('The error while searching artists occurred: ', err));


})






app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
