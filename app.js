require('dotenv').config();


const express = require('express')
const hbs = require('hbs')
const app = express()

const SpotifyWebApi = require('spotify-web-api-node')

app.set('view engine', 'hbs')
app.set('views', __dirname + '/views')
app.use(express.static(__dirname + '/public'))

const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET
});

spotifyApi
    .clientCredentialsGrant()
    .then(data => spotifyApi.setAccessToken(data.body['access_token']))
    .catch(error => console.log('Something went wrong when retrieving an access token', error))



app.get('/', (req, res) => {
    res.render('home')
})


app.get('/artist-search', (req, res) => {

    //res.send(req.query)

    const { artist } = req.query

    spotifyApi
        .searchArtists(artist)
        .then(data => {
            res.render('artistSearch', { artist: data.body.artists.items })
        })
        .catch(err => console.log('The error while searching artists occurred: ', err));
})

app.get('/album/:artistId', (req, res) => {

    const { artistId } = req.params

    spotifyApi
        .getArtistAlbums(artistId)
        .then(data => {
            // res.send(data.body)
            res.render("album", { artista: data.body.items })

        })
        .catch(err => console.log('The error while searching artists occurred: ', err));
})

app.get('/albun/:artistId', (req, res) => {

    const { artistId } = req.params

    spotifyApi
        .getAlbumTracks(artistId)
        .then(data => {
            // console.log(data.body)
            res.render("albun", { soong: data.body.items })

        })
        .catch(err => console.log('The error while searching artists occurred: ', err));
})






app.listen(5005, () => console.log('My Spotify project running on port 5005'))