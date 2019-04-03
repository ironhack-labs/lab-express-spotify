const express = require('express');
const hbs = require('hbs');
const SpotifyWebApi = require('spotify-web-api-node')
const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

hbs.registerPartials(__dirname + '/views/partials');

app.get('/', (req, res, next) => {
    res.render('index');

});

app.post('/artist', (req, res, next) => {

    res.render('artist');

    // console.log(req);    

    spotifyApi.searchArtists('Anitta')
        .then(data => {

            console.log("The received data from the API: ", data.body);
            // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
        })
        .catch(err => {
            console.log("The error while searching artists occurred: ", err);
        })

});

// Remember to insert your credentials here
const clientId = '464408e226ea494aaa688215dad64cc4',
    clientSecret = 'edd73fb0a6db401f8d50a85d6a5bed3e';

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



app.listen(3000, () => console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊"));
