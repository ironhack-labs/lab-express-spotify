const express = require("express");
const router = express.Router();
const axios = require("axios");

router.get("/albums/:id", (req,res,next)=>{
    axios({
        method: "GET",
        headers: {Authorization:`Bearer ${access_token}`},
        url: `https://api.spotify.com/v1/artists/${req.params.id}/albums`,
        params: {
            limit: 3
        }
    })
    .then((response)=>{
        debugger
        // console.log(response);
        var itemsArray = response.data.items
        res.render("albums", {itemsArray})
    })
    .catch((err)=>{
        console.log(err);
    })
});

module.exports = router;