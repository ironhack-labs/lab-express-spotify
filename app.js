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
app.get("/", (req, res) => {
    res.render("index");
    //console.log(req);
});

app.get("/artist-search", (req, res) => {
    let artistFromForm = req.query.artist;
    let searchResults;

    console.log(`logging query`, req.query);


    spotifyApi
        .searchArtists( artistFromForm )
        .then(data => {
            searchResults = data.body.artists.items;
            console.log('The received data from the API: ', data.body.artists.items);
            // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
            res.render("artist-search-results", 
                {searchResults, artistFromForm});
        })
        .catch(err => console.log('The error while searching artists occurred: ', err));

    
});


app.get("/album-results/:artistId", (req, res) => {
    let artistId = req.params.artistId;
    let album;
    console.log(`logging params`, req.params);

    spotifyApi
        .getArtistAlbums(artistId)
        .then(data => {
            album = data.body.items;
            console.log('The received data from the API: ', data.body.items);
            // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
            res.render("album-results",
                { album });
        })
        .catch(err => console.log('The error while retrieving albums occurred: ', err));


});

app.get("/track-list/:albumId", (req, res, next) => {
    let albumId = req.params.albumId;
    let track;
    console.log(`logging params`, req.params);

    spotifyApi
        .getAlbumTracks(albumId, {limit:5, offset: 1})
        .then(data => {
            track = data.body.items;
            
            console.log('The received data from the API: ', data.body.items);
            // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
            res.render("track-list",
                { track });
        })
        .catch(err => console.log('The error while retrieving albums occurred: ', err));


});

app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));