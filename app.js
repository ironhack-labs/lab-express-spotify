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
app.get('/', (req, res, next) => {
    console.log(`We are getting tho homepage`)
    //res.send(`this is a homepage`)
    res.render('index')
});

app.get('/artist-search', (req, res, next) => {

    spotifyApi
        .searchArtists(req.query.name)
        .then(data => {
            console.log('The received data from the API: ', data.body.artists.items[0].images);
            //res.send(`this was sucessfull` + data.body.artist)
            // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
            res.render('artist-search-results', {listOfArtists: data.body.artists.items})
        })
        .catch(err => console.log('The error while searching artists occurred: ', err));

})


app.listen(3100, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));