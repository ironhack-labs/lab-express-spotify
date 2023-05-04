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

//route a la página principal
app.get('/', (req, res) => {
    res.render('index')
})

//routa al artist search
app.get('/artist-search', (req, res) => {

    const { artist_name } = req.query

    console.log(artist_name)

    spotifyApi
        .searchArtists(artist_name)
        .then(data => {
            console.log('The received data from the API: ', data.body.artists);
            const hbsData = { artists: data.body.artists.items }
            console.log({ hbsData })
            res.render("artist-search-result", hbsData)
        })
        .catch(err => console.log('The error while searching artists occurred: ', err));
})


//ruta a la albums

app.get('/albums/:id', (req, res) => {

    const { id } = req.query

    console.log(id)

    spotifyApi
        .getArtistAlbums(id)
        .then(data => {
            console.log('The received data from the API: ', data.body.artists);
            const hbsData = { artists: data.body.artists.items }
            res.send("albums")
        })
        .catch(err => console.log('The error while searching artists occurred: ', err));
})

app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
