require('dotenv').config();


const express = require('express');
const hbs = require('hbs');
const path = require('path')

// require spotify-web-api-node package here:
const SpotifyWebApi = require('spotify-web-api-node')
const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET
});
spotifyApi.clientCredentialsGrant()
    .then(data => spotifyApi.setAccessToken(data.body['access_token']))
    .catch(error => console.log('Something went wrong when retrieving an access token', error));

const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
hbs.registerPartials(path.join(__dirname, 'views', 'partials'))
app.use(express.static(__dirname + '/public'));

// setting the spotify-api goes here:

// Our routes go here:
app.get('/', (req, res) => res.render('index'))


app.get('/artist-search', (req, res) => {
    const artistName = req.query.artista

    spotifyApi.searchArtists(artistName)
        .then(artist => {
            res.render('artist-search', {
                artists: artist.body.artists.items
            })
        })
        .catch(err => console.log(`Ha salido mal ${err}`))
})

app.get('/albums/:artistId', (req, res) => {
    const albumID = req.params.artistId
    console.log(albumID)
    spotifyApi.getArtistAlbums(albumID)
        .then(album => {
            res.render('albums', {
                album: album.body.items
            })
            console.log(album.body.items)
        })
        .catch(err => console.log("Ha salido algo mal con el album", err))
})














app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));