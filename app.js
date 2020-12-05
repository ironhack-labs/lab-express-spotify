require('dotenv').config();

const express = require('express');
const hbs = require('hbs');

// require spotify-web-api-node package here:
const SpotifyWebApi = require("spotify-web-api-node");


const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));


//create a helper for displaying images
hbs.registerHelper('isdefined', function (value, opts) {
        if (value !== undefined) {
                return opts.fn(this);
        } else {
                return opts.inverse(this);
        }
});

//create a helper for partial
hbs.registerHelper('button', function(page, opts){
        if(value == "artist"){
                return "View Albums"
        }else{
                return "View Tracks"
        }
})

//register partials
hbs.registerPartials(__dirname + "/views/partials");

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
//route Home
app.get("/", (req, res) => {
        res.render("index")
})

//route for artist searching
app.get("/artist-search", async (req, res) => {
        await spotifyApi
                .searchArtists(req.query.artist.toLocaleLowerCase())
                .then(data => {

                        const info = data.body.artists.items
                        // console.log('The received data from the API: ', info);
                        res.render("artist-search-results", { info })
                        // res.json(info)
                })
                .catch(err => console.log('The error while searching the data from the API', err))


})

//route to view albums
app.get("/albums/:artistId", async (req, res) => {
        // console.log(req.params.artistId)
        await spotifyApi
        .getArtistAlbums(req.params.artistId)
        .then(data => {
                const listAlbums = data.body.items
                // console.log("Artist albums: ", listAlbums);
                res.render("albums", {listAlbums})
                // res.json(listAlbums[0].artists[0].name)
        })
        .catch(err => console.log(err));

})

//route to view tracks
app.get("/albums/tracks/:trackId", async(req, res) => {
        await spotifyApi
        .getAlbumTracks(req.params.trackId)
        .then(data => {
                const listTrack = data.body.items
                console.log("Artist albums: ", listTrack);
                res.render("track", {listTrack})
                // res.json(listTrack)
        })
        .catch(err => console.log(err));
})

app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
