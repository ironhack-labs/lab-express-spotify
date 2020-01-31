const spotifyApi = require("../config/spotify.config")

exports.findArtist =  (req, res) =>{
    const {search} = req.body
    spotifyApi.searchArtists(search)
    .then(data => {
        console.log('the recived data from the api:', data.body.artists.items)
        res.render('artist-search-results', {data})

    })
    .catch(err => {
        console.log(err)
    })
}



