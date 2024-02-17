const spotifyApi = require('../configs/spotify.config');

module.exports.artistController = (req, res, next) => {
    spotifyApi.searchArtists(req.query.search_fill)
        .then(data => {
            const artists = data.body.artists.items;
            res.render('pages/artists-search-results', { artists });
            console.log('The received data from the API: ', artists);
    // ----> 'HERE'S WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
            
        })
        .catch(error => console.error('The error while searching artists occurred: ', error));
};