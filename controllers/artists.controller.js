const SpotifyApi = require('../config/spotify.config')


// Our routes go here:



module.exports.search = (req,res,next) =>  {
    res.render('artists/artist-search-results')
    
}


module.exports.doSearch = (req,res,next) =>  {

  SpotifyApi
        .searchArtists(req.query.artist)
        .then((data) => {
          //res.send(data)
           res.render('artists/artist-search-results', {
            artists: data.body.artists.items
          }) 
        })
     
             .catch(err => console.log('The error while searching artists occurred: ', 
             err));
  }
