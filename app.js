require('dotenv').config()

const path = require('path')

const express = require('express')
const hbs = require('hbs')
const SpotifyWebApi = require('spotify-web-api-node')

const app = express()

app.set('view engine', 'hbs')
app.set('views', path.join(__dirname, 'views'))
app.use(express.static(__dirname + '/public'))

// setting the spotify-api goes here:

const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET
})

// Retrieve an access token
spotifyApi
    .clientCredentialsGrant()
    .then(data => spotifyApi.setAccessToken(data.body['access_token']))
    .catch(error => console.log('Something went wrong when retrieving an access token', error))


// Our routes go here:
app.get('/', (req, res) => {
    res.render('home-page')
})

app.get('/artist-search', (req, res) => {

    const { search } = req.query

    spotifyApi
        .searchArtists(search)
        .then(data => {
            console.log('The received data from the API: ', data.body.artists.items);
            // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
            const info = data.body.artists.items
            res.render('artist-search-results', { info })
        })
        .catch(err => console.log('The error while searching artists occurred: ', err)) 
})

app.get('/albums/:id', (req, res) => {
    
    spotifyApi
        .getArtistAlbums(req.params.id)
        .then(data => {
            console.log('The received data from the albumsssss: ', data.body.items[0].artists);
            // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
            const info = data.body.items
            console.log("eyyyy esto es info" + info)
            res.render('albums', { info})
        })
        .catch(err => console.log('The error while searching artists occurred: ', err)) 
    

})

app.get('/tracks/:id', (req, res) => {

    spotifyApi
        .getAlbumTracks(req.params.id)
        .then(data => {
            console.log('The received data from the TRACKSSSS: ', data.body.items);
            // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
            const info = data.body.items
            res.render('tracks', { info })
        })
        .catch(err => console.log('The error while searching artists occurred: ', err))


})





app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'))
