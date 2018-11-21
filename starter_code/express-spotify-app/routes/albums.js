const express = require("express")
const app = express()

var spotifyApi = require("../spotifySetup.js")

app.get("/albums/:artistId", function(req, res){
    spotifyApi.getArtistAlbums(req.params.artistId)
    .then(data => {
        res.render("albums", {albums: data.body.items, 
                                title: 'Albums'
        })    
    })
    .catch(err => {
        throw(err)
    })
})


module.exports = app 