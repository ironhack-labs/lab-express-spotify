require("dotenv").config();

const express = require("express");
const hbs = require("hbs");

// require spotify-web-api-node package here:
const SpotifyWebApi = require("spotify-web-api-node");

const app = express();

app.set("view engine", "hbs");
app.set("views", __dirname + "/views");
app.use(express.static(__dirname + "/public"));

// setting the spotify-api goes here:
const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
});

// Retrieve an access token
spotifyApi
    .clientCredentialsGrant()
    .then((data) => spotifyApi.setAccessToken(data.body["access_token"]))
    .catch((error) =>
        console.log(
            "Something went wrong when retrieving an access token",
            error
        )
    );

// Our routes go here:
app.get("/", (req, res) => {
    res.render("index");
});

app.get("/artist-search", async (req, res) => {
    try {
        const { artist } = req.query;

        let allSearchedArtist = await spotifyApi.searchArtists(artist);
        //console.log(allSearchedArtist.body.artists.items[0].images[0]);
        res.render("searched_artists", {
            artists: allSearchedArtist.body.artists.items,
        });
    } catch (err) {
        console.log(err);
    }
});

app.get("/albums/:idArtist", async (req, res) => {

    try{
        const {idArtist} = req.params;
        let searchedArtist = await spotifyApi.getArtistAlbums(idArtist);
        //console.log(searchedArtist.body.items[0]);
        res.render("artist-search-results", {albums: searchedArtist.body.items,
        });
    }catch (error){
        console.log(error)
    }

   
});

app.get("/tracks/:idAlbum", async (req, res) => {

    try{
        const {idAlbum} = req.params;
        let searchedAlbum = await spotifyApi.getAlbumTracks(idAlbum);
        //console.log(searchedAlbum.body.items[0].preview_url);
        res.render("album-search-results", {tracks: searchedAlbum.body.items});
        
    }catch (error){
        console.log(error)
    }

   
});

/* app.get("/beer/:beerId", async (req, res) => {
    try {
        const { beerId } = req.params;
        let searchedBeer = await punkApi.getBeer(beerId);
        console.log(searchedBeer);
        res.render("beer", searchedBeer[0]);
    } catch (error) {
        console.log(error);
    }
}); */

app.listen(3000, () =>
    console.log("My Spotify project running on port 3000 弗弗弗弗弗")
);
