const spotifyApi = require('../configs/spotify.config');

module.exports.albums = (req, res, next) => {
    const { artistId } = req.params;
    const { search } = req.query;
    spotifyApi.getArtistAlbums(artistId,{ limit : 8 })
        .then(function(data) {
            res.render('misc/albums', {albums: data.body.items, search: search, artistId: artistId});
        })
        .catch(err => console.log('The error while searching the albums occurred: ', err));

};