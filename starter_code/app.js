require('dotenv').config();
const express = require('express');
const app = express();

const hbs = require('hbs');
const SpotifyWebApi = require("spotify-web-api-node");
const bodyParser = require("body-parser")
// require spotify-web-api-node package here:
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));


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
    .then(data => {
        spotifyApi.setAccessToken(data.body["access_token"]);
    })
    .catch(error => {
        console.log("Something went wrong when retrieving an access token", error);
    });




// setting the spotify-api goes here:






// the routes go here:

app.get("/", (req, res) => {
    res.render("index")
})

app.post("/artists", (req, res) => {

    spotifyApi
        .searchArtists(req.body.artist)
        .then(data => {
            console.log("The received data from the API: ", data.body);
            // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
            res.render("artists", {
                data
            })
            // res.json(data)

        })
        .catch(err => {
            console.log("The error while searching artists occurred: ", err);
        });

})


app.get("/artists", (req, res) => {




    res.render("artists")
})


app.get("/albums/:id", (req, res) => {

    spotifyApi.getArtistAlbums(req.params.id)
        .then(data => {
            res.render("albums", {data})
            // res.json(data)

        })


})

app.get("/tracks/:albumId", (req, res) => {

spotifyApi.getAlbum(req.params.albumId)
.then(data => {
    res.render("tracks", {data})
    // res.json(data)
})

})



app.listen(3000, () => console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊"));
