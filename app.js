require('dotenv').config();

const express = require('express');
const hbs = require('hbs');
const SpotifyWebApi = require('spotify-web-api-node');

const app = express();

app.use(express.static('public'))

app.set('views', `${__dirname}/views`)
app.set('view engine', 'hbs')
hbs.registerPartials(`${__dirname}/views/partials`)

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
    // console.log(`I got the token ${data.body['access_token']}`)
})
.catch(error => console.log('Something went wrong when retrieving an access token', error));

// Our routes go here:

app.get('/', (req, res) => {
    res.render('index')
})

app.get('/artist-search', (req, res) => {
    const {artist} = req.query

    spotifyApi
        .searchArtists(artist)
        .then(data => {
            const artistsList = data.body
            return artistsList
        })
        .then(artistsList => {
            const list = artistsList.artists.items
            // res.send(list)
            res.render('artists',{list})
        })
        .catch(err => console.log('The error while searching artists occurred: ', err));    
})

app.get('/albums/:artistId', (req, res, next) => {
    const {artistId} = req.params
    spotifyApi
        .getArtistAlbums(artistId)
        .then(data => {
            return data.body.items
        })
        .then(albums => {
            const list = albums
            res.render('albums',{list})
        })
        .catch(err => console.log('The error while searching artists occurred: ', err));   
    
})

app.get('/tracks/:albumId', (req, res) => {
    const {albumId} = req.params
    spotifyApi
        .getAlbumTracks(albumId)
        .then(data => {
            console.log('Album tracks', data.body);
            res.render('tracks', data.body)
        })
        .catch(err => console.log('The error while searching artists occurred: ', err));  
})

app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));