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

const getAndSetSpotifyToken = async () => {
    try {
        const { body: { access_token } } = await spotifyApi.clientCredentialsGrant()
        spotifyApi.setAccessToken(access_token)
        return console.log('Access token successfully')
    } catch (error) {
        return console.log('Access token failed: ' + error)
    }
}
// Get and Set Token 
getAndSetSpotifyToken()

app.get('/', async (req, res) => {

    res.send(spotifyApi)
})

app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
