var express = require('express');
var router = express.Router();

var spotifyApi = require('./spotifyApi')

/* GET home page. */
router.get('/', (req, res, next)=> {
  res.render('index', { title: 'Express' });
});

router.post('/', (req,res,next)=>{

  console.log('##################',req.body.searchArtist)

if(req.body.searchArtist){
    spotifyApi.searchArtists(req.body.searchArtist)
    .then((data)=> {
      // debugger
      console.log(data.body.artists.items)
      res.render('artists', 
                    { title: 'Express',
                      info: data.body.artists.items,
                      button: "View Albums" 
                    }
      );
    })
    .catch((err)=> {

      console.log(err)
      res.send("ERROR");

    })
}else if(req.body.searchAlbum){
  spotifyApi.getArtistAlbums(req.body.searchAlbum).then(
    (data)=>{
      debugger
      console.log('Artist albums', data.body);
      res.render('artists', { title: 'Express', info: data.body.items })
    },
    (err)=>{
      console.error('ALBUM ERROR',err);
    }
  );
}else{
  res.redirect('/')
}



})



module.exports = router
