require('dotenv').config();

const express = require('express');
const hbs = require('hbs');

//* require spotify-web-api-node package here:
const SpotifyWebApi = require('spotify-web-api-node');
const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

//* setting the spotify-api goes here:
const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET
});

// Retrieve an access token
spotifyApi
    .clientCredentialsGrant()
    .then(data => spotifyApi.setAccessToken(data.body['access_token']))
    .catch(error => console.log('Something went wrong when retrieving an access token', error));

//*Middleware for parsing the json and form-data requests
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//* Our routes go here:

//Home page route
app.get("/", (req, res) => {
    res.render("index");
});
//Route to get the artists
app.get("/artist-search", async (req, res) => {
    //console.log('artistName', typeof(artistName));
    //to get this value use 'req.query' ---> use it to access data sent from the get forms, values that come after
    const data = await spotifyApi
        .searchArtists(req.query.artistName)
    const artists = data.body.artists.items
    //console.log(data.body.artists.items)
    //console.log('artists[0].images ->', artists[0].images);
    res.render('artist-search-results', { artists: artists })
})

//Route to get the id
app.get('/albums/:artistId', async (req, res, next) => {
    //to capture value from dynamic endpoint we use: req.params
    const data = await spotifyApi
        .getArtistAlbums(req.params.artistId)
    //console.log('data.body.items', data.body.items);
    const allAlbums = data.body.items;
    //console.log('allAlbums', typeof(allAlbums));

    res.render('albums', { albums: allAlbums });
});

//Route to get the tracks
app.get('/tracks/:albumId', async (req, res, next) => {

    const data = await spotifyApi
        .getAlbumTracks(req.params.albumId)
    const tracksArray = data.body.items;
    console.log('tracks', tracksArray);

    res.render('tracks', { tracksArray: tracksArray });
});

app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
