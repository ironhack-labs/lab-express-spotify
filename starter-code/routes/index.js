//const {Router}=require("express")
const {getArtist,getAlbums,getTracks}=require("../controllers/index")
//const router=Router()
const router = require('express').Router()

router
.get("/",(req,res)=>{
res.render("index")
})
.post("/artist-search", getArtist)
.get("/albums/:albumId",getAlbums)
.get("/tracks/:tracksId",getTracks)

module.exports = router