var express = require('express');
var router = express.Router();
const spotifyApi = require('./spotifyWebApi')

router.get('/artists', function(req, res, next) {
    // console.log(req.body.artist)
    // res.send(req.body.artist)
    // debugger
    spotifyApi.searchArtists(req.query.artist)
    .then(data => {
        // console.log(data.body)
        // console.log(data.body.artists.items)
        // console.log(data.body.artists.items[0].images[0].url)
        // console.log(data.body.artists.items[0].id)
        // res.send(data.body)
        res.render('artists', {artist: data.body.artists.items})
        // res.render('artists', {
        //     artist: data.body.artists.items,
        //     imag
        // })
    })
    .catch(err => {
        console.log(err)
    })
    // spotifyApi.searchArtists('Love')
    // .then(data => {
    //     console.log(data.body)
    //     res.send(data.body)
    // })
    // .catch(err => {
    //     console.log(err)
    // })
});

module.exports = router;