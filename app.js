require('dotenv').config();

const express = require('express');
const hbs = require('hbs');
const SpotifyWebApi = require('spotify-web-api-node');

// require spotify-web-api-node package here:
const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET
  });

spotifyApi
.clientCredentialsGrant()
.then(data => spotifyApi.setAccessToken(data.body['access_token']))
.catch(error => console.log('Something went wrong when retrieving an access token', error));

const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

// setting the spotify-api goes here:

// Our routes go here:
app.get('/', (req, res) => {
    res.render('landing.hbs')
})
app.get('/albums/:artistId', (req,res) => {
    const id = req.params.artistId
    spotifyApi.getArtistAlbums(id)
        .then( ({body: {items}}) => {
            let albums = items.map( elem => {
                elem.image = elem.images[0] || null
                return elem
            })
            res.render('albums.hbs', {albums})
        })
        .catch( err => console.error(err))
})
app.get('/artist-search', (req, res) => {
    let q = req.query.q
    spotifyApi
        .searchArtists(q)
        .then( (data) => {
            const {body: {artists: {items}}} = data;
            let artists = items.map( elem => {
                elem.image = elem.images[0] || null
                return elem
            })
            res.render('artist-search-results.hbs', {artists})
        })
        .catch( err => console.error(err) )
})
app.get('/tracks/:trackId', (req, res) => {
    spotifyApi.getAlbumTracks(req.params.trackId)
        .then( ({body: {items}}) =>
            res.render('tracks.hbs', {items})
        )
        .catch( err => console.error(err))
})
app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
