const spotifyApi = require('../models/spotify');

module.exports.home = (req, res) => {
  res.render("index", {});
};

//module.exports.searchArtist
spotifyApi
  .searchArtists(artistName)
  .then(data => {
    console.log('The received data from the API: ', data.body);
    res.render('artist/artist-search-resoults', {
      data: data.body
    })
  })
  .catch(err => console.log('The error while searching artists occurred: ', err));