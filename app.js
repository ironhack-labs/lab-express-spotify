require('dotenv').config();

const express = require('express');
const hbs = require('hbs');

const SpotifyWebApi = require('spotify-web-api-node');// require spotify-web-api-node package here:

const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET
});

// Retrieve an access token
spotifyApi
    .clientCredentialsGrant()
    .then(data => spotifyApi.setAccessToken(data.body['access_token']))
    .catch(error => console.log('Something went wrong when retrieving an access token', error));// setting the spotify-api goes here:

// Our routes go here:

app.get('/', (req, res) => {
    res.render('index')
})

app.get('/artist-search', (req, res) => {
    //res.send(req.query.artistName)


    spotifyApi
        .searchArtists(req.query.artistName)
        .then(data => {
            console.log('ESTO ES LO QUE TE DEVUELVE LA API AL PASARLE LA QUERY AL METODO SEARCHARTIST: ', data.body.artists.items);

            res.render('artists-search-results', { artists: data.body.artists.items })

        })
        .catch(err => console.log('The error while searching artists occurred: ', err));

})





app.listen(5005, () => console.log('My Spotify project running on port 5005 🎧 🥁 🎸 🔊'));
