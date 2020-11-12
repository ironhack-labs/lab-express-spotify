require('dotenv').config();

const express = require('express');
const hbs = require('hbs');

// require spotify-web-api-node package here:
const SpotifyWebApi = require ('spotify-web-api-node')

const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

// setting the spotify-api goes here:
const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET
})
// Retrieve an access token
spotifyApi
    .clientCredentialsGrant()
    .then(data => {
         spotifyApi.setAccessToken(data.body['access_token'])
    })
    .catch(err => console.error('Something went wrong when retrieving an access token', err))

// Our routes go here:



app.get('/', (req, res, next) => {
    res.render('home')
})
app.get('/artist-search', (req, res, next) => {
    spotifyApi
        .searchArtists(req.query.searchArtist)
        .then(artists => {
            console.log('The received artists from the API: ', artists.body)
            res.render('artist-search-results', artists.body.artists)
        })
        .catch(err => {
            res.render('home')
            console.error('The error while searching artists occurred: ', err)
        })
})


app.get('/albums/:artistId', (req, res, next) => {
    spotifyApi
        .getArtistAlbums(req.params.artistId)
        .then(albums => {
            res.render('albums', albums.body)
        })
        .catch(err => console.error('The error while getting albums occurred: ', err))
})
app.get('/albums/tracks/:albumId', (req, res, next) => {
    spotifyApi
        .getAlbumTracks(req.params.albumId)
        .then(tracks => {
            res.render('tracks', tracks.body)
        })
        .catch(err => console.error('The error while getting tracks ocurred: ', err))
})




app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
