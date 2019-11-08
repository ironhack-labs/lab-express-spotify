require('dotenv').config()

const express = require('express');
const hbs = require('hbs');

// require spotify-web-api-node package here:
const SpotifyWebApi = require("spotify-web-api-node");

hbs.registerPartials(__dirname + "/views/partials");

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
    .then(data => {
        spotifyApi.setAccessToken(data.body["access_token"]);
    })
    .catch(error => {
        console.log("Something went wrong when retrieving an access token", error);
    });

// the routes go here:
app.get('/', (req, res) => {
    res.render('index.hbs');
});

app.get("/artists", (req, res) => {
    const query = req.query.userQuery;
    spotifyApi
        .searchArtists(query)
        .then(data => {

            const artists = data.body.artists.items;
            res.render("artists.hbs", {
                artist: artists
            })
        })
        .catch(err => {
            console.log("The error while searching artists occurred: ", err);
        });
})

app.get("/albums/:artistId", (req, res, next) => {
    const Id = req.params.artistId;
    console.log("here")
    spotifyApi.getArtistAlbums(Id)
        .then(data => {
            let albums = data.body.items


            console.log("WHAT THE ACTUAL FUCK,  ")
            return res.render("index.hbs")
            // res.render("albums.hbs", {
            //     albums
            // })
        })
        .catch(err => {
            console.log("The error while searching albums occurred: ", err);
        });
})




app.listen(3030, () => console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊"));