require('dotenv').config();

const express = require('express');
const hbs = require('hbs');


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
    // .then(() => spotifyApi.searchArtists('/artist-search', req.query))
    // .then(data => console.log('Search artists by "Love"', data.artists)) 
    .catch(error => console.log('Something went wrong when retrieving an access token', error))






// Our routes go here:

app.get('/', (req, res) => res.render('index'))
app.get('/artist-search', (req, res) => {

    spotifyApi
    .searchArtists(req.query.artist)
        .then(data => {
        // console.log(data.body.artists.items[0])
        res.render('artists-search-results', { data: data.body.artists.items } )
    })
    .catch(err => console.log('The error while searching artists occurred: ', err))

})

app.get('/albums/:artistId', (req, res) => {

    spotifyApi
        .getArtistAlbums('3WrFJ7ztbogyGnTHbHJFl2')
        .then(data => {
            console.log(data.body.items)
            res.render('albums', { data: data.body.items })
        })
        .catch(err => console.error(err))

})





app.listen(4000, () => console.log('My Spotify project running on port 4000 🎧 🥁 🎸 🔊'));
