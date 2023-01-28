const SpotifyWebApi = require('../config/spotify.config');

module.exports.home = (req, res) => {
    res.render('home');
};

module.exports.search = (req, res) => {
    SpotifyWebApi
        .searchArtists(req.query.search)
        .then((data) => {
            //console.log(data.body.artists.items[0]);
            res.render('search', {artists: data.body.artists.items});
        })
        .catch(err => console.log('The error while searching artists occurred: ', err));
};

module.exports.albums = (req, res) => {
    SpotifyWebApi
        .getArtistAlbums(req.params.id)
        .then(data => {
            //console.log(data.body.items);
            res.render('albums', {albums: data.body.items});    
        })
        .catch(err => console.log('The error while searching artists occurred: ', err));
};

module.exports.tracks = (req, res) => {
    SpotifyWebApi
        .getAlbumTracks(req.params.id)
        .then(data => {
            console.log(data.body.items);
            res.render('tracks', {tracks: data.body.items});
        })
        .catch(err => console.log('The error while searching artists occurred: ', err));
};
