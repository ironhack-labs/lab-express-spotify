const express = require('express');
const router = express.Router();

// require spotify-web-api-node package here: ==================
const SpotifyWebApi = require('spotify-web-api-node');
// ===============================================================
// setting the spotify-api goes here: -----------------------------
const spotifyApi = new SpotifyWebApi({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET
});
// ----------------------------------------------------------------
// Retrieve an access token ****************************************
spotifyApi
  .clientCredentialsGrant()
  .then(data => spotifyApi.setAccessToken(data.body['access_token']))
  .catch(error => console.log('Something went wrong when retrieving an access token', error));
//   ***************************************************************


// GET home page
router.get('/', (req, res, next) => {
  res.render('index');
});


router.get('/artist-search', (req, res, next) => {
  console.log({theQuery: req.query});
  spotifyApi
      .searchArtists(req.query.searchQuery)
      .then(data => {
          console.log('The received data from the API: ', data.body.artists.items);
          // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
          // res.redirect('back');
          const dataToDisplay = {
              searchResults: data.body.artists.items
          };
          res.render('artist-search-results', dataToDisplay);
      })
      .catch(err => console.log('The error while searching artists occurred: ', err));
});



router.get('/albums/:artistId', (req, res, next) => {
      
  spotifyApi
    .getArtistAlbums(req.params.artistId) 
    .then(data => {
      console.log('Artist albums from API:', data.body);
    
       res.render('albums',  {albumResults: data.body.items } )
    })
    .catch(err => console.log('The error while searching albums occurred: ', err));
});



router.get('/tracks/:albumId', (req, res, next) => {
     
  spotifyApi
    .getAlbumTracks(req.params.albumId) 
    .then(data => {
      console.log('Album tracks from API:', data.body);
    
      res.render('tracks',  {tracksResults: data.body.items } )
    })
    .catch(err => console.log('The error while searching tracks occurred: ', err));
});



module.exports = router;

//////////////?????///////////////////

//  //WHY DOES THIS HAPPEN  for albums & tracks///
 ///////////// logs album or track before error..get an error after in console but works to display on page and app works fine?? ///////////////// 

 /// for the following .getArtistAlbums(req.params.artistId)  &  .getAlbumTracks(req.params.albumId)

//  router.get('/albums/:artistId', (req, res, next) => {
//   spotifyApi
//     .getArtistAlbums(req.params.artistId) 
//     .then(data => {
//       console.log('Artist albums from API:', data.body);
    
//        res.render('albums',  {albumResults: data.body.items } )
//     })
//     .catch(err => console.log('The error while searching albums occurred: ', err));
// });



// router.get('/tracks/:albumId', (req, res, next) => {
     
//   spotifyApi
//     .getAlbumTracks(req.params.albumId) 
//     .then(data => {
//       console.log('Album tracks from API:', data.body);
    
//       res.render('tracks',  {tracksResults: data.body.items } )
//     })
//     .catch(err => console.log('The error while searching tracks occurred: ', err));
// });

/////////////////////// DETAILS INFO////////

        ////  ERROR below for album same as tracks////

// The error while searching albums occurred:  WebapiRegularError: An error occurred while communicating with Spotify's Web API.
// Details: invalid id.
//     at _toError (/Users/rachelfeldman/Desktop/ironhack2021/labs2021/lab-express-spotify/node_modules/spotify-web-api-node/src/http-manager.js:39:12)
//     at /Users/rachelfeldman/Desktop/ironhack2021/labs2021/lab-express-spotify/node_modules/spotify-web-api-node/src/http-manager.js:71:25
//     at Request.callback (/Users/rachelfeldman/Desktop/ironhack2021/labs2021/lab-express-spotify/node_modules/superagent/lib/node/index.js:905:3)
//     at /Users/rachelfeldman/Desktop/ironhack2021/labs2021/lab-express-spotify/node_modules/superagent/lib/node/index.js:1127:20
//     at IncomingMessage.<anonymous> (/Users/rachelfeldman/Desktop/ironhack2021/labs2021/lab-express-spotify/node_modules/superagent/lib/node/parsers/json.js:22:7)
//     at Stream.emit (events.js:321:20)
//     at Unzip.<anonymous> (/Users/rachelfeldman/Desktop/ironhack2021/labs2021/lab-express-spotify/node_modules/superagent/lib/node/unzip.js:53:12)
//     at Unzip.emit (events.js:333:22)
//     at endReadableNT (_stream_readable.js:1201:12)
//     at processTicksAndRejections (internal/process/task_queues.js:84:21) {
//   body: { error: { status: 400, message: 'invalid id' } },
//   headers: {
//     'content-type': 'application/json; charset=utf-8',
//     'cache-control': 'private, max-age=0',
//     'x-robots-tag': 'noindex, nofollow',
//     'access-control-allow-origin': '*',
//     'access-control-allow-headers': 'Accept, App-Platform, Authorization, Content-Type, Origin, Retry-After, Spotify-App-Version, X-Cloud-Trace-Context, client-token, content-access-token',
//     'access-control-allow-methods': 'GET, POST, OPTIONS, PUT, DELETE, PATCH',
//     'access-control-allow-credentials': 'true',
//     'access-control-max-age': '604800',
//     'content-encoding': 'gzip',
//     'strict-transport-security': 'max-age=31536000',
//     'x-content-type-options': 'nosniff',
//     date: 'Sat, 09 Jan 2021 18:11:28 GMT',
//     server: 'envoy',
//     via: 'HTTP/2 edgeproxy, 1.1 google',
//     'alt-svc': 'clear',
//     connection: 'close',
//     'transfer-encoding': 'chunked'
//   },
//   statusCode: 400
// } 


        //// EXAMPLE IT CONSOLE.LOGS WHAT LOOKING FOR///
//  Artist albums from API: {
//   href: 'https://api.spotify.com/v1/artists/3c3NbrBWqQzG5Xni2DLi9a/albums?offset=0&limit=20&include_groups=album,single,compilation,appears_on',
//   items: [
//     {
//       album_group: 'album',
//       album_type: 'album',
//       artists: [Array],
//       available_markets: [Array],
//       external_urls: [Object],
//       href: 'https://api.spotify.com/v1/albums/0GXHaHd0hbrdddt939dAwV',
//       id: '0GXHaHd0hbrdddt939dAwV',
//       images: [Array],
//       name: 'Delacorte Theatre',
//       release_date: '2020-05-14',
//       release_date_precision: 'day',
//       total_tracks: 8,
//       type: 'album',
//       uri: 'spotify:album:0GXHaHd0hbrdddt939dAwV'
//     }, ....... rest of objects

//  limit: 20,
//   next: null,
//   offset: 0,
//   previous: null,
//   total: 12
// } 