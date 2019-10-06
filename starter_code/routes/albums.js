const express = require('express');
const router = express.Router();
const axios = require('axios');

router.get('/:id', (req, res) => {
    global.artistId = req.params.id;

    axios({
            method: 'GET',
            url: `https://api.spotify.com/v1/artists/${global.artistId}`, 
            headers: {Authorization:`Bearer ${global.access_token}`},
         })
         .then((result) => {
            let artist = result.data;
            axios({
                    method: 'GET',
                    url: `https://api.spotify.com/v1/artists/${global.artistId}/albums`, 
                    headers: {Authorization:`Bearer ${global.access_token}`},
                 })
                .then((result) => {
                    let albums = result.data; 
                    if (albums && albums.items.length > 0) { 
                        res.render('albums', {albums, artist}); 
                    } else {
                        res.render('artists', {errorMessage: `Could not find albums for: ${artist.name}`}); 
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




