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
app.get('/', (req, res) => {
    res.render('index', {});
})

app.get('/artist-search', (req, res) => {
    spotifyApi
        .searchArtists(req.query.search.toLowerCase())
        .then(resData => {
            let artists = resData.body.artists.items;
            // replace artist without image
            artists = artists.map(artist => {
                if (artist.images.length === 0) artist.images = {url : "/images/default.png"};
                else artist.images = artist.images[0];
                return artist;
            });
            console.log(artists);
            res.render('artist-search-results', {artists: artists})
        })
        .catch(error => console.log(error))
})

app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));