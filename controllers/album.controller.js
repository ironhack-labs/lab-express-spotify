const spotifyApi = require("../configs/spotify.config");

module.exports.albums = ('/albums/:artistId', (req, res, next) => {
    const artistId = req.params.artistId;
    const search = req.query;
    
    console.log("Artist ID:", artistId);

    spotifyApi
        .getArtistAlbums(artistId)
        .then((data) => {
            res.render("albums", { albums: data.body.items, search: search, artistId: artistId });
        })
        .catch((error) => { 
            console.error("Error fetching albums:", error);
        });
});
