const express = require('express');
const hbs = require('hbs');
const bodyParser = require('body-parser');
// require spotify-web-api-node package here:
const SpotifyWebApi = require('spotify-web-api-node');

require('dotenv').config();

const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({ extended: true }));


// setting the spotify-api goes here:
const clientId = process.env.API_CLIENT;
const clientSecret = process.env.API_SECRET;

const spotifyApi = new SpotifyWebApi({
    clientId: clientId,
    clientSecret: clientSecret
});

// Retrieve an access token
spotifyApi.clientCredentialsGrant()
    .then(data => {
        spotifyApi.setAccessToken(data.body['access_token']);
    })
    .catch(error => {
        console.log('Something went wrong when retrieving an access token', error);
    })



// the routes go here:
app.get('/', (req, res) => {
    res.render('layout')
})


app.listen(3000, () => console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊"));