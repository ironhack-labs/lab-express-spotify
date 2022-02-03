require('dotenv').config();

const express = require('express');
const hbs = require('hbs');
// require spotify-web-api-node package here:
const SpotifyWebApi = require('spotify-web-api-node')

const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));
hbs.registerPartials(`${__dirname}/views/partials/`)

// setting the spotify-api goes here:
const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET
})

spotifyApi
    .clientCredentialsGrant()
    .then(data => spotifyApi.setAccessToken(data.body['access_token']))
    .catch(error => console.log('Something went wrong when retrieving an access token', error))
// Our routes go here:

// app.get("/", (req, res) => {
//     res.render("home")
// })

app.get("/", (req, res) => {

    res.render('home')


})

app.get("/artistas", (req, res) => {
    const { search } = req.query

    spotifyApi
        .searchArtists(search)
        .then(data => {
            const artistsData = data.body.artists.items
            console.log(artistsData[0].images)
            res.render('artist-search-results', { theArtists: artistsData })
        })
        .catch(err => console.log('The error while searching artists occurred: ', err));

})

app.listen(5000, () => console.log('My Spotify project running on port 5000 🎧 🥁 🎸 🔊'));
