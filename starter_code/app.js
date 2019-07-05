const express = require('express');
const app = express();
const hbs = require('hbs');
const SpotifyWebApi = require('spotify-web-api-node');
// require spotify-web-api-node package here:
const clientId = 'ed8a5a1167cd41148d7577c8010830d5';
const clientSecret = '022faed6981d4e79846a6e5ee489ee21';

const spotifyApi = new SpotifyWebApi({
  clientId : clientId,
  clientSecret : clientSecret
});

// Retrieve an access token
spotifyApi.clientCredentialsGrant()
  .then( data => {
    spotifyApi.setAccessToken(data.body['access_token']);
  })
  .catch(error => {
    console.log('Something went wrong when retrieving an access token', error);
  })


app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

hbs.registerPartials(__dirname + '/views/partials');
// setting the spotify-api goes here:
// the routes go here:
app.get('/', (req, res) => {
  res.render('home');
});

app.get('/artists', (req, res) => {
// console.log("requested : " + req.query.artistx);

spotifyApi.searchArtists(req.query.artistx)
    .then(data => {

      // console.log("The received data from the API: ", data.body);
      // console.log("The received data from the API: ", JSON.stringify( data.body.artists.items));

      // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
      
      let theartists = data.body.artists.items;
      // console.log(JSON.stringify(theartists));
      res.render('artists', {theartists});
    })
    .catch(err => {
      console.log("The error while searching artists occurred: ", err);
    })

});

app.get('/albums/:artistid', (req, res) => {
  console.log("artist id: " + req.params.artistid);

  
    spotifyApi.getArtistAlbums(req.params.artistid)
      .then(function(data) {
        // console.log('Artist albums', JSON.stringify (data.body.items));
        let albums = data.body.items;
        res.render('albums', {albums} );
      }, function(err) {
        console.error(err);
      });

  
});

app.get('/viewtracks/:albumid', (req, res) => {
  console.log("albumid from tracks id: " + req.params.albumid);
  let albumid = req.params.albumid;

  spotifyApi.getAlbum(albumid)
  .then(function(data) {
    console.log("Data from ==== " + JSON.stringify(data.body.tracks.items[0]));
    // let somearr = [2,4,6,8];
    let other = JSON.stringify(data.body.tracks.items);
     res.render('viewtracks', {trackArray: data.body.tracks.items} );
    //  return data.body.tracks.map(function(t) { return t.id; });
  })
  // .then(function(trackIds) {
  //   return spotifyApi.getTracks(trackIds);
  // })
  // .then(function(tracksInfo) {
  //   console.log(tracksInfo);
  // })
  .catch(function(error) {
    console.error(error);
  });



  
  
});

app.listen(3000, () => console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊"));

// {
//   "artists": {
//     "href": "https://api.spotify.com/v1/search?query=beatles&type=artist&offset=0&limit=20",
//     "items": [
//       {
//         "external_urls": {
//           "spotify": "https://open.spotify.com/artist/3WrFJ7ztbogyGnTHbHJFl2"
//         },
//         "followers": {
//           "href": null,
//           "total": 12518294
//         },
//         "genres": [
//           "british invasion",
//           "merseybeat",
//           "psychedelic rock",
//           "rock"
//         ],
//         "href": "https://api.spotify.com/v1/artists/3WrFJ7ztbogyGnTHbHJFl2",
//         "id": "3WrFJ7ztbogyGnTHbHJFl2",
//         "images": [
//           {
//             "height": 640,
//             "url": "https://i.scdn.co/image/6fc6ac9af76d292a9cc55c7415ca0a7fb5b1d4ea",
//             "width": 640
//           },
//           {
//             "height": 320,
//             "url": "https://i.scdn.co/image/722fcccede8e231dcf1cdb55b4d58096ab9bc6da",
//             "width": 320
//           },
//           {
//             "height": 160,
//             "url": "https://i.scdn.co/image/b61ff8a2999960a73e1c885fea3058525d55d3cd",
//             "width": 160
//           }
//         ],
//         "name": "The Beatles",
//         "popularity": 90,
//         "type": "artist",
//         "uri": "spotify:artist:3WrFJ7ztbogyGnTHbHJFl2"
//       },
//       {
//         "external_urls": {
//           "spotify": "https://open.spotify.com/artist/5bHINZb8IBnQSGTIa7mJNB"
//         },
//         "followers": {
//           "href": null,
//           "total": 5
//         },
//         "genres": [],
//         "href": "https://api.spotify.com/v1/artists/5bHINZb8IBnQSGTIa7mJNB",
//         "id": "5bHINZb8IBnQSGTIa7mJNB",
//         "images": [
//           {
//             "height": 640,
//             "url": "https://i.scdn.co/image/2993d6bdb38a89002d33580426821032fc5b938b",
//             "width": 640
//           },
//           {
//             "height": 320,
//             "url": "https://i.scdn.co/image/c8b725d3da5e125e27289d4181d9ac410fa50526",
//             "width": 320
//           },
//           {
//             "height": 160,
//             "url": "https://i.scdn.co/image/91c45fd48141fabb6d84e116d21a0fb473f02998",
//             "width": 160
//           }
//         ],
//         "name": "Yoga Beatles",
//         "popularity": 8,
//         "type": "artist",
//         "uri": "spotify:artist:5bHINZb8IBnQSGTIa7mJNB"
//       },
//       {
//         "external_urls": {
//           "spotify": "https://open.spotify.com/artist/1UarLtyjvxGiRTsfFXxtnA"
//         },
//         "followers": {
//           "href": null,
//           "total": 652
//         },
//         "genres": [
//           "plunder"
//         ],
//         "href": "https://api.spotify.com/v1/artists/1UarLtyjvxGiRTsfFXxtnA",
//         "id": "1UarLtyjvxGiRTsfFXxtnA",
//         "images": [
//           {
//             "height": 640,
//             "url": "https://i.scdn.co/image/701995d0fc7e399afa56bfa374203c73903701f1",
//             "width": 640
//           },
//           {
//             "height": 300,
//             "url": "https://i.scdn.co/image/8ebff2f484e23b234da8205b422863b7bb838a80",
//             "width": 300
//           },
//           {
//             "height": 64,
//             "url": "https://i.scdn.co/image/f71f73e2fb563f02af19f23c0d800cdc8ae68da2",
//             "width": 64
//           }
//         ],
//         "name": "The Tape-beatles",
//         "popularity": 7,
//         "type": "artist",
//         "uri": "spotify:artist:1UarLtyjvxGiRTsfFXxtnA"
//       },
//       {
//         "external_urls": {
//           "spotify": "https://open.spotify.com/artist/3YojAkU7hiAalEunJy55JW"
//         },
//         "followers": {
//           "href": null,
//           "total": 197
//         },
//         "genres": [],
//         "href": "https://api.spotify.com/v1/artists/3YojAkU7hiAalEunJy55JW",
//         "id": "3YojAkU7hiAalEunJy55JW",
//         "images": [],
//         "name": "beatles",
//         "popularity": 0,
//         "type": "artist",
//         "uri": "spotify:artist:3YojAkU7hiAalEunJy55JW"
//       },
//       {
//         "external_urls": {
//           "spotify": "https://open.spotify.com/artist/2NUpOkMGBeKWAPI0Ckn6gx"
//         },
//         "followers": {
//           "href": null,
//           "total": 34
//         },
//         "genres": [],
//         "href": "https://api.spotify.com/v1/artists/2NUpOkMGBeKWAPI0Ckn6gx",
//         "id": "2NUpOkMGBeKWAPI0Ckn6gx",
//         "images": [
//           {
//             "height": 640,
//             "url": "https://i.scdn.co/image/345e06f23273b98db47eef905d59ba084e658a04",
//             "width": 640
//           },
//           {
//             "height": 300,
//             "url": "https://i.scdn.co/image/06f593dfafc16affac56cac2c37df6eb78166455",
//             "width": 300
//           },
//           {
//             "height": 64,
//             "url": "https://i.scdn.co/image/507833ffeb5f69b56ff96ef9150e2b9f28f340cb",
//             "width": 64
//           }
//         ],
//         "name": "Lopez Beatles",
//         "popularity": 0,
//         "type": "artist",
//         "uri": "spotify:artist:2NUpOkMGBeKWAPI0Ckn6gx"
//       },
//       {
//         "external_urls": {
//           "spotify": "https://open.spotify.com/artist/6ea6bBvg2oAmtRJ5aHRATP"
//         },
//         "followers": {
//           "href": null,
//           "total": 52
//         },
//         "genres": [],
//         "href": "https://api.spotify.com/v1/artists/6ea6bBvg2oAmtRJ5aHRATP",
//         "id": "6ea6bBvg2oAmtRJ5aHRATP",
//         "images": [
//           {
//             "height": 640,
//             "url": "https://i.scdn.co/image/d7f9dd9e526d590f703883ee2e3d5417502e56cf",
//             "width": 640
//           },
//           {
//             "height": 320,
//             "url": "https://i.scdn.co/image/373a992c4126193228a8cdfcca76366da890dd87",
//             "width": 320
//           },
//           {
//             "height": 160,
//             "url": "https://i.scdn.co/image/123c7b9c148112a3558a2ca76057d837b465f38d",
//             "width": 160
//           }
//         ],
//         "name": "The Norwegian Beatles",
//         "popularity": 0,
//         "type": "artist",
//         "uri": "spotify:artist:6ea6bBvg2oAmtRJ5aHRATP"
//       },
//       {
//         "external_urls": {
//           "spotify": "https://open.spotify.com/artist/23HuxUyd78GSK7Icl5khf6"
//         },
//         "followers": {
//           "href": null,
//           "total": 8
//         },
//         "genres": [],
//         "href": "https://api.spotify.com/v1/artists/23HuxUyd78GSK7Icl5khf6",
//         "id": "23HuxUyd78GSK7Icl5khf6",
//         "images": [
//           {
//             "height": 640,
//             "url": "https://i.scdn.co/image/3c8f4fc95d0ffc387c16ffaf95d28c45b92f497b",
//             "width": 640
//           },
//           {
//             "height": 300,
//             "url": "https://i.scdn.co/image/38cba4b1de7362da7ae35a863d44d4c998eb5868",
//             "width": 300
//           },
//           {
//             "height": 64,
//             "url": "https://i.scdn.co/image/9e1dc53e470cadaf5dfdf86f993f9c9f8d09d956",
//             "width": 64
//           }
//         ],
//         "name": "Olipa kerran The Beatles",
//         "popularity": 0,
//         "type": "artist",
//         "uri": "spotify:artist:23HuxUyd78GSK7Icl5khf6"
//       },
//       {
//         "external_urls": {
//           "spotify": "https://open.spotify.com/artist/5qW4j3RXhL3aRytG86jLtW"
//         },
//         "followers": {
//           "href": null,
//           "total": 168
//         },
//         "genres": [],
//         "href": "https://api.spotify.com/v1/artists/5qW4j3RXhL3aRytG86jLtW",
//         "id": "5qW4j3RXhL3aRytG86jLtW",
//         "images": [
//           {
//             "height": 640,
//             "url": "https://i.scdn.co/image/ac3b50d56bed635ebc4f33f3df34b4587f9268ab",
//             "width": 640
//           },
//           {
//             "height": 300,
//             "url": "https://i.scdn.co/image/66359facf9ea716324fc5c16d57d5bdbf1a91057",
//             "width": 300
//           },
//           {
//             "height": 64,
//             "url": "https://i.scdn.co/image/dea6fa8f03d9eab409e95e8ef895be5160fcc983",
//             "width": 64
//           }
//         ],
//         "name": "Better Than The Beatles",
//         "popularity": 3,
//         "type": "artist",
//         "uri": "spotify:artist:5qW4j3RXhL3aRytG86jLtW"
//       },
//       {
//         "external_urls": {
//           "spotify": "https://open.spotify.com/artist/7dVUCG9ijtNltJW8LshXCL"
//         },
//         "followers": {
//           "href": null,
//           "total": 4
//         },
//         "genres": [],
//         "href": "https://api.spotify.com/v1/artists/7dVUCG9ijtNltJW8LshXCL",
//         "id": "7dVUCG9ijtNltJW8LshXCL",
//         "images": [
//           {
//             "height": 640,
//             "url": "https://i.scdn.co/image/d0b9563a376e5ab4b0eb03a9f0eaa7c3858b45e6",
//             "width": 640
//           },
//           {
//             "height": 300,
//             "url": "https://i.scdn.co/image/60ca9760f28e5de0bb6ee80249aee1d459f5ea80",
//             "width": 300
//           },
//           {
//             "height": 64,
//             "url": "https://i.scdn.co/image/b931e03b6cf739fba0d14d927eaef14a6cb02c92",
//             "width": 64
//           }
//         ],
//         "name": "We Play The Beatles",
//         "popularity": 0,
//         "type": "artist",
//         "uri": "spotify:artist:7dVUCG9ijtNltJW8LshXCL"
//       },
//       {
//         "external_urls": {
//           "spotify": "https://open.spotify.com/artist/33b1KmOX7FpzOVMeDpz16I"
//         },
//         "followers": {
//           "href": null,
//           "total": 11
//         },
//         "genres": [],
//         "href": "https://api.spotify.com/v1/artists/33b1KmOX7FpzOVMeDpz16I",
//         "id": "33b1KmOX7FpzOVMeDpz16I",
//         "images": [
//           {
//             "height": 640,
//             "url": "https://i.scdn.co/image/95c148b90b597572f9cd115dad2c0e4ea4a02846",
//             "width": 640
//           },
//           {
//             "height": 300,
//             "url": "https://i.scdn.co/image/bd4270cb944b5b3a2c46d22ce01ed1802251d2d8",
//             "width": 300
//           },
//           {
//             "height": 64,
//             "url": "https://i.scdn.co/image/c16ec2d553712ec3f1fa83eb68e0df6f46961a71",
//             "width": 64
//           }
//         ],
//         "name": "Israel Filho & Forró Beatles",
//         "popularity": 5,
//         "type": "artist",
//         "uri": "spotify:artist:33b1KmOX7FpzOVMeDpz16I"
//       },
//       {
//         "external_urls": {
//           "spotify": "https://open.spotify.com/artist/4PCfEqDs3CzWQu4l98pBIR"
//         },
//         "followers": {
//           "href": null,
//           "total": 8
//         },
//         "genres": [],
//         "href": "https://api.spotify.com/v1/artists/4PCfEqDs3CzWQu4l98pBIR",
//         "id": "4PCfEqDs3CzWQu4l98pBIR",
//         "images": [],
//         "name": "the beatles featuring mark pearson",
//         "popularity": 0,
//         "type": "artist",
//         "uri": "spotify:artist:4PCfEqDs3CzWQu4l98pBIR"
//       },
//       {
//         "external_urls": {
//           "spotify": "https://open.spotify.com/artist/3cBV24PM5nZsXqopSHvdtS"
//         },
//         "followers": {
//           "href": null,
//           "total": 15191
//         },
//         "genres": [
//           "tribute"
//         ],
//         "href": "https://api.spotify.com/v1/artists/3cBV24PM5nZsXqopSHvdtS",
//         "id": "3cBV24PM5nZsXqopSHvdtS",
//         "images": [
//           {
//             "height": 640,
//             "url": "https://i.scdn.co/image/e07b85c2df502e923b579f9255239adcd2af7fcb",
//             "width": 640
//           },
//           {
//             "height": 300,
//             "url": "https://i.scdn.co/image/3a0481038785d0588f178bdde00a124036d69965",
//             "width": 300
//           },
//           {
//             "height": 64,
//             "url": "https://i.scdn.co/image/bc0dec460f1d2381fc730de56d6a7de7d6b5d896",
//             "width": 64
//           }
//         ],
//         "name": "The Beatles Recovered Band",
//         "popularity": 38,
//         "type": "artist",
//         "uri": "spotify:artist:3cBV24PM5nZsXqopSHvdtS"
//       },
//       {
//         "external_urls": {
//           "spotify": "https://open.spotify.com/artist/0rhGLV687CCwGfeJYXd176"
//         },
//         "followers": {
//           "href": null,
//           "total": 5078
//         },
//         "genres": [],
//         "href": "https://api.spotify.com/v1/artists/0rhGLV687CCwGfeJYXd176",
//         "id": "0rhGLV687CCwGfeJYXd176",
//         "images": [
//           {
//             "height": 515,
//             "url": "https://i.scdn.co/image/6fe2cc1054a5632d96122c3994356b2b4e8436b1",
//             "width": 600
//           },
//           {
//             "height": 258,
//             "url": "https://i.scdn.co/image/f492ae149844797923e6bb75a4f74bee4e4fd8b2",
//             "width": 300
//           },
//           {
//             "height": 55,
//             "url": "https://i.scdn.co/image/4453fa09defb694cc572d162bd19cf807080067e",
//             "width": 64
//           }
//         ],
//         "name": "The Beatles Tribute Band",
//         "popularity": 36,
//         "type": "artist",
//         "uri": "spotify:artist:0rhGLV687CCwGfeJYXd176"
//       },
//       {
//         "external_urls": {
//           "spotify": "https://open.spotify.com/artist/2DghgxF3jV3G5xfcTpZpKr"
//         },
//         "followers": {
//           "href": null,
//           "total": 6912
//         },
//         "genres": [
//           "tribute"
//         ],
//         "href": "https://api.spotify.com/v1/artists/2DghgxF3jV3G5xfcTpZpKr",
//         "id": "2DghgxF3jV3G5xfcTpZpKr",
//         "images": [
//           {
//             "height": 600,
//             "url": "https://i.scdn.co/image/8945c157bb5e720eef434320bc863938431f7b34",
//             "width": 600
//           },
//           {
//             "height": 300,
//             "url": "https://i.scdn.co/image/cf231c78b622ace4249033bc1c83e873f090023f",
//             "width": 300
//           },
//           {
//             "height": 64,
//             "url": "https://i.scdn.co/image/51f049091ac982d82ac752aee74111a091fc2775",
//             "width": 64
//           }
//         ],
//         "name": "Re Beatles",
//         "popularity": 27,
//         "type": "artist",
//         "uri": "spotify:artist:2DghgxF3jV3G5xfcTpZpKr"
//       },
//       {
//         "external_urls": {
//           "spotify": "https://open.spotify.com/artist/7EzNTMzMN70jRxBWbxeshd"
//         },
//         "followers": {
//           "href": null,
//           "total": 2798
//         },
//         "genres": [
//           "tribute"
//         ],
//         "href": "https://api.spotify.com/v1/artists/7EzNTMzMN70jRxBWbxeshd",
//         "id": "7EzNTMzMN70jRxBWbxeshd",
//         "images": [
//           {
//             "height": 640,
//             "url": "https://i.scdn.co/image/496314422536edff85157ef254e5555fdaabf725",
//             "width": 640
//           },
//           {
//             "height": 300,
//             "url": "https://i.scdn.co/image/9fc2c090db9146b1f7039e6769b2a32159758132",
//             "width": 300
//           },
//           {
//             "height": 64,
//             "url": "https://i.scdn.co/image/588867881351f22a7105461915fb36e51a47b78f",
//             "width": 64
//           }
//         ],
//         "name": "The Beatles Tribute Project",
//         "popularity": 29,
//         "type": "artist",
//         "uri": "spotify:artist:7EzNTMzMN70jRxBWbxeshd"
//       },
//       {
//         "external_urls": {
//           "spotify": "https://open.spotify.com/artist/3ToH1MA6We6sXviAbhaCIN"
//         },
//         "followers": {
//           "href": null,
//           "total": 73
//         },
//         "genres": [
//           "lullaby"
//         ],
//         "href": "https://api.spotify.com/v1/artists/3ToH1MA6We6sXviAbhaCIN",
//         "id": "3ToH1MA6We6sXviAbhaCIN",
//         "images": [
//           {
//             "height": 640,
//             "url": "https://i.scdn.co/image/e1b362adc433659f327d99313515f35d44314947",
//             "width": 640
//           },
//           {
//             "height": 300,
//             "url": "https://i.scdn.co/image/3fee91bd6aa4781c6b311dd58ed40b621bf9fa3b",
//             "width": 300
//           },
//           {
//             "height": 64,
//             "url": "https://i.scdn.co/image/1eaee9af70a964f798b351e7bc778969e6f57e0e",
//             "width": 64
//           }
//         ],
//         "name": "Beatles Lullaby",
//         "popularity": 22,
//         "type": "artist",
//         "uri": "spotify:artist:3ToH1MA6We6sXviAbhaCIN"
//       },
//       {
//         "external_urls": {
//           "spotify": "https://open.spotify.com/artist/6TdEBFxIMtJufTezojmCzA"
//         },
//         "followers": {
//           "href": null,
//           "total": 67
//         },
//         "genres": [
//           "lullaby"
//         ],
//         "href": "https://api.spotify.com/v1/artists/6TdEBFxIMtJufTezojmCzA",
//         "id": "6TdEBFxIMtJufTezojmCzA",
//         "images": [
//           {
//             "height": 640,
//             "url": "https://i.scdn.co/image/e1b362adc433659f327d99313515f35d44314947",
//             "width": 640
//           },
//           {
//             "height": 300,
//             "url": "https://i.scdn.co/image/3fee91bd6aa4781c6b311dd58ed40b621bf9fa3b",
//             "width": 300
//           },
//           {
//             "height": 64,
//             "url": "https://i.scdn.co/image/1eaee9af70a964f798b351e7bc778969e6f57e0e",
//             "width": 64
//           }
//         ],
//         "name": "Beatles Lullabies",
//         "popularity": 22,
//         "type": "artist",
//         "uri": "spotify:artist:6TdEBFxIMtJufTezojmCzA"
//       },
//       {
//         "external_urls": {
//           "spotify": "https://open.spotify.com/artist/3ZOhDuAjCjvw9z5lEGUmgZ"
//         },
//         "followers": {
//           "href": null,
//           "total": 13454
//         },
//         "genres": [],
//         "href": "https://api.spotify.com/v1/artists/3ZOhDuAjCjvw9z5lEGUmgZ",
//         "id": "3ZOhDuAjCjvw9z5lEGUmgZ",
//         "images": [
//           {
//             "height": 640,
//             "url": "https://i.scdn.co/image/191647985e246afa52d12012633965635f9fe82c",
//             "width": 640
//           },
//           {
//             "height": 300,
//             "url": "https://i.scdn.co/image/8c84822ba40e6dc9231f4212bd45c32151e68179",
//             "width": 300
//           },
//           {
//             "height": 64,
//             "url": "https://i.scdn.co/image/9fcee3b9963119c0f6414eb958ebd9734d498412",
//             "width": 64
//           }
//         ],
//         "name": "The Beatles Connection",
//         "popularity": 25,
//         "type": "artist",
//         "uri": "spotify:artist:3ZOhDuAjCjvw9z5lEGUmgZ"
//       },
//       {
//         "external_urls": {
//           "spotify": "https://open.spotify.com/artist/36QpVbYALWlz5NtMI3LhiV"
//         },
//         "followers": {
//           "href": null,
//           "total": 10801
//         },
//         "genres": [
//           "tribute"
//         ],
//         "href": "https://api.spotify.com/v1/artists/36QpVbYALWlz5NtMI3LhiV",
//         "id": "36QpVbYALWlz5NtMI3LhiV",
//         "images": [
//           {
//             "height": 640,
//             "url": "https://i.scdn.co/image/8e2e70fc546a58dc1d0c82415edcd5f0b2a68976",
//             "width": 640
//           },
//           {
//             "height": 300,
//             "url": "https://i.scdn.co/image/653bdfb76d8d121af44d0583a2a37dcedb3ddbc0",
//             "width": 300
//           },
//           {
//             "height": 64,
//             "url": "https://i.scdn.co/image/1a81e6e945a8301adb95234e06566d697c37bd8f",
//             "width": 64
//           }
//         ],
//         "name": "The Beatles Greatest Hits Performed By The Frank Berman Band",
//         "popularity": 30,
//         "type": "artist",
//         "uri": "spotify:artist:36QpVbYALWlz5NtMI3LhiV"
//       },
//       {
//         "external_urls": {
//           "spotify": "https://open.spotify.com/artist/0zRgwHorAZPeYVdTW9F5OX"
//         },
//         "followers": {
//           "href": null,
//           "total": 10565
//         },
//         "genres": [
//           "tribute"
//         ],
//         "href": "https://api.spotify.com/v1/artists/0zRgwHorAZPeYVdTW9F5OX",
//         "id": "0zRgwHorAZPeYVdTW9F5OX",
//         "images": [
//           {
//             "height": 640,
//             "url": "https://i.scdn.co/image/519266c351755806c6b6b5bbb3c2c8eb826ec410",
//             "width": 640
//           },
//           {
//             "height": 300,
//             "url": "https://i.scdn.co/image/95c6d42b0648249fb7bff5c5d9e9fbe445a9ffa7",
//             "width": 300
//           },
//           {
//             "height": 64,
//             "url": "https://i.scdn.co/image/621e4f52c6aec4f3991974cde320a125f0b9049b",
//             "width": 64
//           }
//         ],
//         "name": "The Beatles Revival Band",
//         "popularity": 28,
//         "type": "artist",
//         "uri": "spotify:artist:0zRgwHorAZPeYVdTW9F5OX"
//       }
//     ],
//     "limit": 20,
//     "next": "https://api.spotify.com/v1/search?query=beatles&type=artist&offset=20&limit=20",
//     "offset": 0,
//     "previous": null,
//     "total": 71
//   }
// }
