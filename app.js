require('dotenv').config();

const port = 5555;
const express = require('express');
const app = express();
const hbs = require('hbs');
// require spotify-web-api-node package here:
const SpotifyWebApi = require('spotify-web-api-node')

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
    console.log('homepage request');
    res.render('index', {doctitle: 'Ironhack spotify thing',});
})

app.get('/search', (req, res) => {
    const searchPhrase = req.query.q;
    console.log(searchPhrase);
    spotifyApi.searchArtists(searchPhrase.toLowerCase())
    .then(data => {
        console.log('The received data from the API: ', data.body);
        res.render('artist-search-results', { artistsList: data.body.items })// ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
    })
    .catch(err => console.log('The error while searching artists occurred: ', err));
    // const filteredMovies = movies.filter(movie =>
    // 	movie.title.toLowerCase().includes(searchPhrase.toLowerCase())
    // )
    // console.log(filteredMovies);
    // res.render('movies', { moviesList: filteredMovies, doctitle: 'Filtered Movies' });
})

app.listen(5555, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
