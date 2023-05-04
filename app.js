require('dotenv').config();

const express = require('express');
const hbs = require('hbs');
// require spotify-web-api-node package here:
const SpotifyWebApi = require('spotify-web-api-node')


const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET
});
// Retrieve an access token
spotifyApi
    .clientCredentialsGrant()
    .then(data => spotifyApi.setAccessToken(data.body['access_token']))
    .catch(error => console.log('Something went wrong when retrieving an access token', error));

const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

// setting the spotify-api goes here:

// Our routes go here:
app.get("/", (req, res) => {
    res.render("home")
})
app.get("/resultados", (req, res, next) => {
    //const name = req.quert.name --> metodo sin destructuracion
    const title = req.query.name
    spotifyApi
        .searchArtists(title)
        .then(artistSpects => {
            console.log('The received data from the API: ', artistSpects.body.artists.items);
            { { artistSpects.body.artists.items.name = title } }

            // ----> 'HERE'S WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
            res.render("resultados", { albums: artistSpects.body.artists.items })
        })
        .catch(err => console.log('The error while searching artists occurred: ', err));

})
//resultados

app.get("/detalles/:id", (req, res) => {
    const { id } = req.params
    spotifyApi
        .getArtistAlbums(id)
        .then(albumes => {
            console.log("he recibido -->", albumes.body.items[0].images)
            res.render("detalles/albumes-pages", { albums: albumes.body.items })
        })
})



app.listen(5005, () => console.log('My Spotify project running on port 5005 🎧 🥁 🎸 🔊'));
