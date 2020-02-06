const express = require('express')
const router = express.Router()
const SpotifyWebApi = require('spotify-web-api-node')



const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET
})

spotifyApi.clientCredentialsGrant()
    .then(data => {
        spotifyApi.setAccessToken(data.body['access_token'])
    })
    .catch(error => console.log('Something went wrong when retrieving an access token', error));




router.get('/', (req, res, next) => {
    console.log('tu busqueda es', req.query)
    res.render('index')
})

router.get('/artist-search', (req, res, next) => {

    console.log('tu busqueda es', `${req.query.artist}`)

    spotifyApi.searchArtists(req.query.artist)
        .then(data => {
            // console.log('The received data from the API: ', data.body.artists.items)
            // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
            // console.log("id: " +data.body.artists.items[0].id)
            res.render('artist-search',data.body.artists.items)
        })
        .catch(err => console.log('The error while searching artists occurred: ', err))
})

router.get('/albums/:id', (req, res) => {
    // console.log(req.params)
    spotifyApi.getArtistAlbums(req.params.id)
        .then(data => {
            // console.log(data.body.items)
            res.render('albums', data.body.items)

        })
})

router.get('/tracks/:id', (req, res) => {
    console.log(req.params)
    spotifyApi.getAlbumTracks(req.params.id)
        .then(data => {
            console.log(data.body.items)
            res.render('tracks', data.body.items)

        })
})

// router.get('/nosotros', (req, res, next) => res.render('about-us'))

// Formulario de login
// router.get('/login', (req, res, next) => res.render('login'))
// router.post('/login', (req, res, next) => {
//     console.log("El valor del objeto req.body es:", req.body)
//     const usernameGiven = req.body.user
//     const pwdGiven = req.body.password
//     res.send(`Tu usuario es ${usernameGiven} y tu pws es ${pwdGiven}`)
// })
module.exports = router