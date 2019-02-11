let router = require ('express').Router()
let Spotify = require ('../models/Spotify')




module.exports = router

//vista de lista
// router.get ('/'), (req,res =>{
//     Spotify.find()
//     .then(artists =>{
//         console.log(artistas)
//         res.render('list'), {artist})
//     })
//     .catch(e=> res.send(e))
// })