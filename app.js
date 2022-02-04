require('dotenv').config();

const express = require('express');
const hbs = require('hbs');

const SpotifyWebApi = require('spotify-web-api-node');

const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
hbs.registerPartials(__dirname + "/views/partials");
app.use(express.static(__dirname + '/public'));

const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET
});

// Retrieve access Token 
spotifyApi
  .clientCredentialsGrant()
  .then(data => spotifyApi.setAccessToken(data.body['access_token']))
  .catch(error => console.log('Something went wrong when retrieving an access token', error));

// Our routes go here:
app.get("/", function(req, res) {
    res.render("home");
});

app.get("/artist-search", function(req, res) {

    spotifyApi
    .searchArtists(req.query.searchedArtist)
    .then(data => {  
        
        const artistInfoArr = [];
        data.body.artists.items.forEach(artist => {
            artistInfoArr.push({
                artistName: artist.name,
                imageSrc: (artist.images[0]) ? artist.images[0].url : ""
            });
        });

        res.render("artist-search-results.hbs", {artistsInfo: artistInfoArr});
    })
    .catch(err => console.log("something went wrong: ", err));

})

app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
