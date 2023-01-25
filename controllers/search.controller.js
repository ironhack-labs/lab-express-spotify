const spotifyApi = require('../config/spotify.config')

module.exports.search = (req, res) => {
    spotifyApi
      .searchArtists(req.query.search)
      .then(data => {
        console.log('The received data from the API: ', data.body.artists.items);
        res.render('search', { artists: data.body.artists.items })
      })
      .catch(err => console.log('The error while searching artists occurred: ', err));
    }