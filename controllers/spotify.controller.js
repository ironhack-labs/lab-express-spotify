const spotifyApi = require("../config/spotify.config")

module.exports.home = (req, res) => {
    res.render("home");
};

//GET /artist-search?search=shakira
module.exports.search = (req, res) => {
    spotifyApi
        .searchArtists(req.query.search)
        .then(data => {
            res.render('search', {artists: data.body.artists.items});
        })
        .catch(err => console.log('The error while searching artists occurred: ', err));
};

module.exports.albums = (req, res) => {
    spotifyApi
        .getArtistAlbums(req.params.id)
        .then(data => {
            res.render('albums', {albums: data.body.items});
        })
        .catch(err => console.log('The error while searching artists occurred: ', err));
};

module.exports.tracks = (req, res) => {
    spotifyApi
        .getAlbumTracks(req.params.id)
        .then(data => {
            res.render('tracks', {tracks: data.body.items});
        })
        .catch(err => console.log('The error while searching artists occurred: ', err));
};