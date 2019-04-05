const spotifyApi = require('../api')

console.log(spotifyApi) 
//Me devuelve esto!
// { _credentials:
//    { clientId: '474b5e2eb7ca4abd9991988d486e9592',
//      clientSecret: 'b9f3ecb275ad430d866a78734acaeeb9' } }

module.exports.list = (req, res, next) => {
  const criteria = req.query.artist;
  spotifyApi.searchArtists(criteria)
    .then(data => {
      res.render('artist', {artists: data.body.artists.items})
    })
    .catch(err => {
      console.log("The error while searching artists occurred: ", err);
    })

  // res.render('artist')
}