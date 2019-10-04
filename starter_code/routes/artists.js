const express = require("express");
const router = express.Router();
const axios = require("axios");

router.get("/artists", (req,res,next)=>{
    axios({
        method: "GET",
        headers: {Authorization:`Bearer ${access_token}`},
        url: `https://api.spotify.com/v1/search`,
        params: {
            type: "artist",
            q: "prince"
        }
    })
    .then((response)=>{
        console.log(response);
    })
    .catch((err)=>{
        console.log(err);
    })
});

module.exports = router;