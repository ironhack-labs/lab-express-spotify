const express = require('express');
const router = express.Router();
const axios = require('axios');

router.get('/:id/tracks', (req, res) => {
    let albumId = req.params.id; 

    axios({
        method: 'GET',
        url: `https://api.spotify.com/v1/albums/${albumId}`, 
        headers: {Authorization:`Bearer ${global.access_token}`},
     }) 
     .then((result) => {
        let album = result.data;
        axios({
                method: 'GET',
                url: `https://api.spotify.com/v1/albums/${albumId}/tracks`, 
                headers: {Authorization:`Bearer ${global.access_token}`},
             }) 
            .then((result) => {
                let artistId = global.artistId;
                let tracks = result.data; 
                if (tracks && tracks.items.length > 0) { 
                    res.render('tracks', {tracks, album, artistId}); 
                } else {
                    res.render('albums', {errorMessage: `Could not find tracks for: ${album.name}`});
                }
            })
            .catch((err) => {
                res.send(err);
            })
     })
     .catch((err) => {
        res.send(err);
     })
});

module.exports = router;