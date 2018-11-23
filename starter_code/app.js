const express = require('express')
const app = express()

const hbs = require('hbs')

var SpotifyWebApi = require('spotify-web-api-node')

// Remember to paste your credentials here
var clientId = '52d168fb95db4ba0bcff0805d666dde0',
    clientSecret = '96daf099aea5480eaacf953d9b604912'

var spotifyApi = new SpotifyWebApi({
    clientId: clientId,
    clientSecret: clientSecret
})

// Retrieve an access token.
spotifyApi.clientCredentialsGrant()
    .then(function (data) {
        spotifyApi.setAccessToken(data.body['access_token'])
    }, function (err) {
        console.log('Something went wrong when retrieving an access token', err)
    })

app.use(express.static('public'))
app.set('views', __dirname + '/views')
app.set('view engine', 'hbs')


//routes
var spotifyRoutes = require('./routes/routes')
app.use('/', spotifyRoutes)


app.listen(3000, () => {
    console.log('initialized')
})