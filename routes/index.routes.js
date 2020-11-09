const express = require('express')
const router = express.Router()
const {spotifyApi} = require('../app')

// router.get('/', (req, res) => {
//     res.render('index')
// })
// router.get('/artist-search', (req, res) => {
//     console.log("lol")
//     console.log(spotifyApi)
//     spotifyApi
//         .searchArtists(req.query.artist)
//         .then(data => {
//             console.log('The received data from the API: ', data.body);
            
//         })
//         .catch(err => console.log('The error while searching artists occurred: ', err));

// })
module.exports = router