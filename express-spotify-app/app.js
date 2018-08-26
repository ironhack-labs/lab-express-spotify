var SpotifyWebApi = require('spotify-web-api-node')
const express = require('express')
const app = express()
const hbs = require('hbs')

//use views
app.set('views', __dirname + '/views')
app.set('view engine', 'hbs')
app.use(express.static('public'))

//use public

app.get('/', (request, response) => {
    response.render('index')
})

app.get('/artists', (request, response) => {
    spotifyApi
        .searchArtists(request.query.artist)
        .then(data => {
            // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
            response.render('artist', { artists: data.body.artists.items })
        })
        .catch(err => {
            // ----> 'HERE WE CAPTURE THE ERROR'
            console.log("There's a problem", err)
        })
})

app.get('/albums/:artistId', (req, res) => {
    // code
    spotifyApi
        .getArtistAlbums(req.params.artistId)
        .then(data => {
            // console.log(data)
            res.render('albums', {
                albums: data.body.items
            })
        })
        .catch(err => {
            console.log('Something went wrong!', err)
        })
})

app.get('/tracks/:albumId', (req, res) => {
    spotifyApi
        .getAlbumTracks(req.params.albumId)
        .then(data => {
            res.render('tracks', {
                tracks: data.body.items
            })
        })
        .catch(err => {
            console.log('Someting went wrong! ${err}')
        })
})

// Remember to paste here your credentials
var clientId = '016a98fedbc648038952e4654933230d',
    clientSecret = 'c35fc16c2d4b4315a7e8a99ad2d6648c'

var spotifyApi = new SpotifyWebApi({
    clientId: clientId,
    clientSecret: clientSecret
})

// Retrieve an access token.
spotifyApi.clientCredentialsGrant().then(
    function(data) {
        spotifyApi.setAccessToken(data.body['access_token'])
    },
    function(err) {
        console.log('Something went wrong when retrieving an access token', err)
    }
)

app.listen(3000)
