var express = require('express');
var router = express.Router();

var spotifyApi = require('./spotifyApi')
/* GET users listing. */
router.get('/songs', function(req, res, next) {
  res.redirect('/');
});

router.post('/songs', function(req, res, next) {
  // console.log(req.body.searchAlbum)

  spotifyApi.getAlbumTracks(req.body.searchAlbum, )
  .then(function(data) {
    // debugger
    console.log(data.body.items);

    data.body.items.forEach(item => item.duration_ms =  millisToMinutesAndSeconds(item.duration_ms) + ' min' )

    res.render('songs',{info: data.body.items});
  }, function(err) {
    console.log('Something went wrong!', err);
    res.send('there was an error, We are working on it! Please check back in later.')
  });
  
});

function millisToMinutesAndSeconds(millis) {
  var minutes = Math.floor(millis / 60000);
  var seconds = ((millis % 60000) / 1000).toFixed(0);
  return minutes + ":" + (seconds < 10 ? '0' : '') + seconds;
}

module.exports = router;
