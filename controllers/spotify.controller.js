module.exports.home = (req, res, next) => res.render('home');

const spotifyApi = require('../configs/spotify.config');

module.exports.searchArtist = (req, res, next) => {
    const artist = req.query.name;
    if(!artist) {
        res.redirect('/')
    }

    spotifyApi.searchArtists(artist)
      .then((data) => {
        res.render('artists/artist-search-results', { data: data.body })
      })
      .catch((error) => console.log('The error while searching artists occurred: ', error));
}