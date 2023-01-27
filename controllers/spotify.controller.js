const spotifyApi = require ('../config/spotify.config')

module.exports.home = (req, res) => {
    res.render('home');
}

module.exports.search = (req, res) => {
    spotifyApi
        .searchArtists(req.query.search)
        .then(data => {
            console.log('The received data from the API: ', data.body.artists.items[0]);
            res.render('artist-search-results', { artists: data.body.artists.items })
        })
        .catch(err => console.log('The error while searching artists occurred: ', err));
}


module.exports.albums = (req, res) => {
    spotifyApi
        .getArtistAlbums(req.params.id)
        .then(data => {
            console.log('The received data from the API: ', data.body.items);
            res.render('albums', { albums: data.body.items })
            })
        .catch(err => console.log('The error while searching artists occurred: ', err));
}

module.exports.tracks = (req, res) => {
    spotifyApi
        .getAlbumTracks(req.params.albumId)
        .then(data => {
            console.log('The received data from the API: ', data.body.items);
            res.render('tracks', { tracks: data.body.items })
            })
        .catch(err => console.log('The error while searching artists occurred: ', err));
}