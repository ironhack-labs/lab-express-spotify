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

const id = process.env.SECRET;
// console.log(id)

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
	res.render('homepage');
});

// Route to search for an Artist
app.get('/artist-search', (req, res) => {
    spotifyApi
  .searchArtists(req.query.artistName)
  .then(data => {
    console.log('The received data from the API: ', data.body.artists.items);
    // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
    // the search results that match this name
    // res.render(name of hbs file to show, {whatever data you need to pass to the HBS file to display to the user - 
    // you decide on a key: info to pass})
    res.render('artist-search-results', {artistList: data.body.artists.items})
})
  .catch(err => console.log('The error while searching artists occurred: ', err));
})


app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
