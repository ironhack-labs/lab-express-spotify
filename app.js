require('dotenv').config();

const express = require('express');
const hbs = require('hbs');

// require spotify-web-api-node package here:
const SpotifyWebApi = require('spotify-web-api-node');

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
app.get('/', (req, res) => {
    res.render('index')
})

app.get('/artist-search', (req, res) => {
    spotifyApi.searchArtists(req.query.popino)
        .then(data => {
            console.log('Resultado de: .getArtist', data.body.artists.items[0])
            res.render('artist-search-result', { artistList: data.body.artists.items })
        })
        .catch(err => console.log('Un error con .getArtist', err))
})

app.get('/albums/:artistId', (req, res, next) => {
    spotifyApi.getArtistAlbums(req.params.artistId)
    
        .then(data => {
            console.log('Resultado de: .getArtistAlbums', data.body.items[0])
            res.render('albums', { albumList: data.body.items })
        })
        .catch(err => console.log('Un error con .getArtistAlbums', err))
})

app.get('/tracks/:albumId', (req, res, next) => {
    spotifyApi.getAlbumTracks(req.params.albumId, { limit: 5, offset: 1 })
        .then(data => {
          console.log('resultados', data)  
        }) 
        // .then(data => {
        //     console.log('Resultado de: .getAlbumTracks', data.body)
            // res.render('track', { trackList: data.body.items })
        // })
        .catch(err => console.log('Un error con .getArtistAlbums', err))
    
})


app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
