const express = require('express')
const router = express.Router()



//const Meme = require('../models/Meme')


// router.get('/', (req, res)=>{
//     res.render('home')
// })



router.get('/home', (req, res)=>{
    res.render('form')
})
router.post('/home', (req, res, next)=>{
    const artista = req.body

    spotifyApi.searchArtists(artista)
    .then(data => {
      // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
    })
    .catch(err => {
      // ----> 'HERE WE CAPTURE THE ERROR'
    })
    
})




// //bien
// router.get('/memes', (req, res, next)=>{
//     Meme.find()
//     .then(memes=>{
//         res.render('list', {memes})
//     })
//     .catch(e=>next(e))
// })

// //vista de detalle
// router.get('/memes/:id', (req, res)=>{
//     //1.- obtengo el id de lo qiue tengo que mostrar
//     const {id} = req.params
//     const{dark} =req.query
//     //2.- lo busco en la basedatos
//     // no usar =>   Meme.findOne({_id:id})
//     Meme.findById(id)
//     .then(meme=>{
//         if(dark) meme.dark = true
//         //3.- se lo doy al template
        

//         res.render('detail', meme)
//     })
//     .catch()

// })


module.exports = router