const express = require('express');
const hbs = require('hbs');
// require spotify-web-api-node package here:
const SpotifyWebApi = require('spotify-web-api-node');
const app = express();
// Remember to insert your credentials here
const clientId = '3a658dda1d4c40e0b7233d7c00b9855e',
    clientSecret = '637566ed0ca84e59a650cba35375c134';

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



app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));


// setting the spotify-api goes here:






// the routes go here:

app.get('/', (req, res) => res.render('index'))

app.get('/artists', (req, res) => {
    console.log(req.query.artist)
    spotifyApi.searchArtists(req.query.artist)
        .then(data => {
            console.log("The received data from the API: ", data.body.artists);
            const artists = data.body.artists.items
            console.log('url imagen', artists[0].images[0].url)
            //console.log(artists)
            res.render('artists', {
                artists
            })
        })
        .catch(err => {
            console.log("The error while searching artists occurred: ", err);
        })
})
app.listen(3000, () => console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊"));