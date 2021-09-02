require('dotenv').config();

const express = require('express');
const hbs = require('hbs');
const SpotifyWebApi = require('spotify-web-api-node')

const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

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
app.get("/", (req, res) => {
    res.render('index')
});

app.get("/artist-search", (req, res) => {
    const artistName = req.query

    spotifyApi
    .searchArtists(artistName.artist)
    .then(data => {
        console.log('The received data from the API: ', data.body.artists);
        // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
        res.render('artists', {items: data.body.artists.items})
    })
    .catch(err => console.log('The error while searching artists occurred: ', err));  
});

app.get("/albums/:album_id", (req, res) => {
    const {album_id} = req.params
    console.log(album_id)

    spotifyApi
        .getArtistAlbums(album_id)
        .then(album => {
            console.log(album.body.items)
            res.render('albums', {items: album.body.items})
        })
        .catch(err => console.log(err))
})

app.get('/tracks/:track_id', (req, res) => {
    const {track_id} = req.params
    console.log(track_id)

    spotifyApi
        .getAlbumTracks(track_id)
        .then(track => {
            console.log(track.body.items)
            res.render('tracks', {items: track.body.items})
        })
        .catch(err => console.log(err))
})



app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
