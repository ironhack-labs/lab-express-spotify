const express = require('express');
const hbs = require('hbs');
// Include process module
const process = require('dotenv').config();

// require spotify-web-api-node package here:
const SpotifyWebApi = require('spotify-web-api-node');

const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

// setting the spotify-api goes here:
const spotifyApi = new SpotifyWebApi({
  clientId: "b0fb0fa82dc24d40ab96b4d80ad87ef4",
  clientSecret: "eab9f145bb4a4ff9b1038cf2a5f5e244"
});

//retrieve an access token
spotifyApi
  .clientCredentialsGrant()
  .then(data => spotifyApi.setAccessToken(data.body['access_token']))
  .catch(error => console.log('Something went wrong when retrieving an access token', error));

// Our routes go here:
//Search for an artist
app.get('/artist-search', (req, res) => {
    spotifyApi
    .searchArtists(req.query.artist)
    .then(artist =>{
        // console.log(artist.body.artists.items[0]);
        res.render('artist-search-results', {artist: artist.body.artists.items});
    })
    .catch(err => console.log('An error occured ', err));
}
);

//create a homepage route
app.get('/', (req, res) =>{
    res.render('index');
});


app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
