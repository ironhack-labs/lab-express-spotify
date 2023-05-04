require('dotenv').config()

const express = require('express')
const hbs = require('hbs');
const SpotifyWebApi = require('spotify-web-api-node')

const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET
});

// Retrieve an access token
spotifyApi
    .clientCredentialsGrant()
    .then(data => spotifyApi.setAccessToken(data.body['access_token']))
    .catch(error => console.log('Something went wrong when retrieving an access token', error))
// require spotify-web-api-node package here:
//

const app = express();

app.set('view engine', 'hbs')
app.set('views', __dirname + '/views')
app.use(express.static(__dirname + '/public'))

// setting the spotify-api goes here:

app.get('/', (req, res) => {
    res.render('index')
})

app.get('/artist-search', (req, res) => {

    console.log(req.query)
    const { Artist } = req.query

    spotifyApi
        .searchArtists(Artist)
        .then(data => {
            res.render("artist-search-result", { allItems: data.body.artists.items })
            //res.send(data);
            // ----> 'HERE'S WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
        })
        .catch(err => console.log('The error while searching artists occurred: ', err));
})

app.get('/albums/:id', (req, res) => {
    const { id } = req.params
    spotifyApi
        .getArtistAlbums(id) //faltID
        .then(dato => {
            //res.send(dato)
            res.render("albums", { artista: dato.body.items })
        })
        .catch(err => console.log('The error while searching artists occurred: ', err));

})

// Our routes go here:

app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'))
