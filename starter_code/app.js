const express = require("express");
const hbs = require("hbs");
const bodyParser = require("body-parser");

// require spotify-web-api-node package here:
const SpotifyWebApi = require("spotify-web-api-node");

const app = express();

app.set("view engine", "hbs");
app.set("views", __dirname + "/views");
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({ extended: true }));

// setting the spotify-api goes here:
const clientId = "3e4f4acc4068406faa7075ae7c3406cd",
    clientSecret = "e3290721fcef4797836e4349d2bde967";

const spotifyApi = new SpotifyWebApi({
    clientId: clientId,
    clientSecret: clientSecret
});

spotifyApi
    .clientCredentialsGrant()
    .then(data => {
        return spotifyApi.setAccessToken(data.body["access_token"]);
    })
    .catch(error => {
        console.log("Something went wrong when retrieving an access token", error);
    });

// the routes go here:
app.get("/", (req, res, next) => {
    res.render("index");
});

app.post("/artists", (req, res, next) => {
    // console.log(req.body.artists)
    spotifyApi
        .searchArtists(req.body.artists)
        .then(data => {
            var artistData = data.body.artists.items;

            // console.log(artistData[0]);

            res.render("artists", { artists: artistData });
            console.log("The received data from the API: ", artistData);
        })
        .catch(err => {
            console.log("The error while searching artists occurred: ", err);
        });
});

app.get("/albums/:artistId", (req, res, next) => {
    spotifyApi
        .getArtistAlbums(req.params.artistId)
        .then(albumData => {
            var albumNames = albumData.body.items.map(album => ({
                albumName: album.name,
                photo: album.images[0].url,
                albumId: album.id
            }));
            res.render("albums", { albumNames });
        })
        .catch(err => {
            console.log("The error while searching artists occurred: ", err);
        });
});

app.get("/tracks/:albumId", (req, res, next) => {
    spotifyApi
        .getAlbumTracks(req.params.albumId)
        .then(albumData => {

            var tracksData = albumData.body.items

            res.render("tracks", { tracks: tracksData });
        })
        .catch(err => {
            console.log("The error while searching artists occurred: ", err);
        });
});

app.listen(3000, () =>
    console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊")
);