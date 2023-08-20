const spotify = require("../config/spotify.config.js");

module.exports.searchArtists = (req, res) => {
    const search = req.query.search;
    spotify.searchArtists(search).then(artists => res.render("artists", { artists: artists.body.artists.items }))
};

module.exports.searchAlbums = (req, res) => {
    const artistId = req.params.artistId;
    spotify.getArtistAlbums(artistId).then((albums) => { res.render("albums", { albums: albums.body.items }) })
}

module.exports.searchTracks = (req, res) => {
    const albumId = req.params.albumId;
    spotify.getAlbumTracks(albumId).then(tracks => res.render("tracks", { tracks: tracks.body.items }))
}