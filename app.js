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
    clientSecret: process.env.CLIENT_SECRET,
});

// Retrieve an access token
spotifyApi
    .clientCredentialsGrant()
    .then(data => spotifyApi.setAccessToken(data.body['access_token']))
    .catch(error => console.log('Something went wrong when retrieving an access token', error));

// Our routes go here:
app.get('/', (req, res) => {
    res.render("index")
})


//iteration 2
app.get('/artists-search', (req, res, next) => {
    spotifyApi
        .searchArtists(req.query.artists)
        .then(data => {
            console.log('Artist information', data.body.artists.items);
            res.render('artists-search-results', { data: data.body.artists.items });
            console.log("The received data from the API: ", data.body.artists)
        })
        .catch(err => console.log('The error while searching artists occurred: ', err))

    // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'

})

//iteration 4
app.get('/albums/:id', (req, res) => {
    const { id } = req.params;
    spotifyApi
        .getArtistAlbums(id)
        .then((data) => {
            const { items } = data.body;
            res.render("albums", { albums: items });
        })
        .catch(err => console.log('The error while searching artists occurred: ', err));
})


//iteration 5
app.get("/tracks/:albumId", (req, res) => {
    spotifyApi
        .getAlbumTracks(req.params.albumId)
        .then((data) => {
            const tracks = data.body.items;
            res.render("tracks", { tracks });
        })
        .catch(err => console.log('The error while searching artists occurred: ', err));
});




console.log("this worked")



app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));