const express = require("express");
const router = express.Router();
const axios = require("axios");

router.get("/tracks/:id", (req,res,next)=>{
    axios({
        method: "GET",
        headers: {Authorization:`Bearer ${access_token}`},
        url: `https://api.spotify.com/v1/albums/${req.params.id}/tracks`
    })
    .then((response)=>{
        debugger
        var itemsArray = response.data.items;
        res.render("tracks", {itemsArray});
    })
    .catch((err)=>{
        console.log(err);
    })
});

module.exports = router;