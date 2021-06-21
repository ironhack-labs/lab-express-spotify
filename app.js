require('dotenv').config();

const express = require('express');
const hbs = require('hbs');
const path = require('path')
const SpotifyWebApi = require('spotify-web-api-node');

// require spotify-web-api-node package here:

const app = express();

app.set('view engine', 'hbs');
app.set('views', path.join(__dirname + '/views'));
app.use(express.static(path.join(__dirname + '/public')));
hbs.registerPartials(__dirname+'/views/Partials')
// setting the spotify-api goes here:
const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET
});
console.log(process.env.CLIENT_ID)

// Retrieve an access token
spotifyApi
    .clientCredentialsGrant()
    .then(data => spotifyApi.setAccessToken(data.body['access_token']))
    .catch(error => console.log('Something went wrong when retrieving an access token', error));
// Our routes go here:
app.get("/", (req, res, next) => {
    console.log("ENTRO")
    res.render("index")
});
app.get("/artist-search", (req, res, next) => {
    const { artist } = req.query;
    console.log(artist)
    spotifyApi
        .searchArtists(artist)
        .then(data => {
            const artists = data.body.artists.items;
            const artistsInfo = {
                info: artists.map((artist) => {
                    return {
                        ...artist
                    }
                })
            }

            console.log('The received data from the API: ', data.body.artists.items);
            // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
            res.render("artist-search-results", artistsInfo)
        })
        .catch(err => console.log('The error while searching artists occurred: ', err));

})

app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
