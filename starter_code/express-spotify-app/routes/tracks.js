const express = require("express")
const app = express()

var spotifyApi = require("../spotifySetup.js")

app.get("/tracks/:albumId", function(req, res){
    spotifyApi.getAlbumTracks(req.params.albumId)
    .then(data => {
        console.log(data.body.items)
        res.render("tracks", {tracks: data.body.items, 
                                title: 'Tracks'
        })    
    })
    .catch(err => {
        throw(err)
    })
})


module.exports = app 