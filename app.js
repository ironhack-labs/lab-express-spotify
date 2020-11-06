require('dotenv').config();

const express = require("express");
const SpotifyWebApi = require("spotify-web-api-node");
const {
    CLIENT_ID,
    CLIENT_SECRET
} = process.env;

const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

const spotifyApi = new SpotifyWebApi({
    clientId: CLIENT_ID,
    clientSecret: CLIENT_SECRET,
});

spotifyApi
    .clientCredentialsGrant()
    .then((data => spotifyApi.setAccessToken(data.body["access_token"]))
        .catch((error) =>
            console.log("Something went wrong when retrieving an access token", error));

        app.get("/", (req, res) => res.render("index"));

        app.get("/artist-search", (req, res) => {
            const {
                artistName
            } = req.query;

            spotifyApi
                .searchArtists(artistName)
                .then((data) => {
                    console.log("The received data from the API: ", data.body.artists.items);
                    const {
                        items
                    } = data.body.artists;
                    res.render("artists-search-results", {
                        artists: items
                    });
                })
                .catch((err) =>
                    console.log("The error while searching artists ocurred: ", err));
        });

        app.get("/albums/:id", (req, res) => {
            const {
                id
            } = req.params;

            spotifyApi
                .getArtistAlbums(id)
                .then((data) => {
                    const {
                        items
                    } = data.body;

                    res.render("albums", {
                        albums: items
                    });
                })

                .catch((err) => console.log("An error while searching artist album ocurred: ", err));
        });

        app.get("/tracks/:albumId", (req, res) => {
            const {
                albumId
            } = req.params;

            spotifyApi
                .getAlbumTracks(albumId)
                .then((data) => {
                    const {
                        items
                    } = data.body;
                    res.render("tracks", {
                        tracks: items
                    });
                })


                .catch((err) => console.log("An error while searching tracks ocurred: ", err))

        })


        app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));