const spotifyApi = require('../config/spotify.config');


module.exports.home = (req, res, next)  => {
    res.render('home')
}

module.exports.list = (req, res, next) => {
    
    console.log(req.query.search)
    spotifyApi
  .searchArtists(req.query.search)
  .then(data => {
    const selectedItems = data.body.artists.items;
    console.log('The received data from the API: ', selectedItems[0].images[0].url);
    res.render('list', {selectedItems})
  })
  .catch(err => console.log('The error while searching artists occurred: ', err));
}