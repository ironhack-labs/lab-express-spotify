const SpotifyApi = require('spotify-web-api-node')



module.exports.home = (req,res,next) => {
    res.render('common/home')
}



module.exports.get = (req,res,next) =>  {
spotifyApi.getArtistAlbums('43ZHCT0cAZBISjO8DG9PnE').then(
    function(data) {
      console.log('Artist albums', data.body);
    },
    function(err) {
      console.error(err);
    }
  );
  
}


module.exports.search = (req,res,next) =>  {

    spotifyApi
        .searchArtists(req.query.artist)
         .then(data => { res.render('common/artist-search-results', {
             artists: data.body})
        
             .catch(err => console.log('The error while searching artists occurred: ', 
             err));
  })
