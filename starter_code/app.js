const express = require('express');
const hbs = require('hbs');
// require spotify-web-api-node package here:
const SpotifyWebApi = require('spotify-web-api-node');



const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));


hbs.registerPartials(__dirname + "/views/partials");


// setting the spotify-api goes here:  
const clientId = "6b9b281a2744401fa4af986be0dc96a0",
    clientSecret = "18e479400e614825a8c0a7705849094c";

const spotifyApi = new SpotifyWebApi({
    clientId: clientId,
    clientSecret: clientSecret
});

// Retrieve an access token
spotifyApi.clientCredentialsGrant()
    .then(data => {
        spotifyApi.setAccessToken(data.body['access_token']);
    })
    .catch(error => {
        console.log('Something went wrong when retrieving an access token', error);
    })



// the routes go here:

app.get("/", (req, res) => {
    res.render("index");
});

app.get("/artists", (req, res) => {
    res.render("artists");
});

app.get("/albums", (req, res) => {
    res.render("albums");
});

app.get("/tracks", (req, res) => {
    res.render("albums");
});


//Route to get search results for "Artists" 
app.get("/artist", (req, res) => {
    let searchedArtist = req.query.q

    spotifyApi.searchArtists(searchedArtist)
        .then(data => {
            let foundArtist = data.body.artists.items;
            console.log("The received data from the API: ", data.body.artists.items);
            res.render("artists", {
                foundArtist
            })
        })
        .catch(err => {
            console.log("The error while searching artists occurred: ", err);
        });
});


//Route to get albums of particular artist
app.get('/albums/:artistId', (req, res, next) => {
    let searchedAlbums = req.params.artistId

    spotifyApi.getArtistAlbums(searchedAlbums)
        .then(data => {
            console.log('Albums information', data.body);
            let albums = data.body.items
            res.render("albums", {
                albums
            })
        })
        .catch(err => {
            console.log(err);
        });
});


//Route to get tracks of a particular album of a particular artist
app.get('/tracks/:albumId', (req, res, next) => {
    let searchedTracks = req.params.albumId

    spotifyApi.getAlbumTracks(searchedTracks, {
            limit: 5,
            offset: 1
        })
        .then(data => {
            console.log('Track information', data.body);
            let tracks = data.body.items
            res.render("tracks", {
                tracks
            })
        })
        .catch(err => {
            console.log(err);
        });
})



app.listen(3000, () => console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊"));