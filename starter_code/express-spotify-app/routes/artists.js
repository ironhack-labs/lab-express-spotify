const express = require("express")
const app = express()

var spotifyApi = require("../spotifySetup.js")

app.post("/artists", function(req, res){
    spotifyApi.searchArtists(req.body.artist)
    .then(data => {
        res.render("artists", {artists: data.body.artists.items, 
                                title: 'Artists'
        })    
    })
    .catch(err => {
        throw(err)
    })
})

module.exports = app 