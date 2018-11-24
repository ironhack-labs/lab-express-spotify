var express = require('express');
var router = express.Router();

var SpotifyWebApi = require('spotify-web-api-node'); 
var spotifyApi = new SpotifyWebApi();


/* GET artists page. */
router.get('/', function(req, res, next) {
  spotifyApi.getArtist('2hazSY4Ef3aB9ATXW7F5w3')
  .then(function(data) {
    console.log('Artist information', data.body);
  }, function(err) {
    console.error(err);
  });
});


//// Get an artist
//spotifyApi.getArtist('2hazSY4Ef3aB9ATXW7F5w3')
//  .then(function(data) {
//    console.log('Artist information', data.body);
//  }, function(err) {
//    console.error(err);
//  });

router.post('/', function (req,res) {
	User.find({username: req.body.username})
	.then((result) => {
		bcrypt.compare(req.body.password, result[0].password, hash, function(err, match) {
		//match = true;
			res.cookie("loggedIn", "true")
			res.render('profile');
		});
	})
})


module.exports = router;
