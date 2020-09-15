const router = require("express").Router();
const { spotifyApi, configSpotify } = require("../config/spotify-config");


configSpotify().then((data) => {
    console.log("Spotify API authenticated", data);
}).catch((err) => console.error(err));



router.get("/", (req, res) => {
    res.render("home");
});

router.get("/artist-search", (req, res) => {
    spotifyApi
        .searchArtists(req.query.artistSearch)
        .then((data) => {
            res.render("artist-search-results", { artists: data.body.artists })
        })
        .catch((err) => console.log("An error has occurred while searching artist: ", err));
});

router.get("/albums/:artistId", async (req, res) => {
    try {
        const dataFromApi = await spotifyApi.getArtistAlbums(req.params.artistId);
        res.render("albums", { albums: dataFromApi.body })
    } catch (err) {
        console.log("An error has occurred while searching artist: ", err);
    }
});

router.get('/tracks/:albumId', async (req, res) => {
    try {
        const dataFromApi = await spotifyApi.getAlbumTracks(req.params.albumId);
        res.render('tracks', {
            tracks: dataFromApi.body.items.sort((a, b) => a.track_number - b.track_number)
        })
    } catch (err) {
        console.log("An error has occurred while searching artist: ", err);
    }
});


module.exports = router;