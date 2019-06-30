const express = require('express');
const hbs = require('hbs');
hbs.registerPartials(__dirname + "/views/partials");

const app = express();
app.set('views', __dirname + '/views');
app.set('view engine', 'hbs');
app.use(express.static("public"));

// require spotify-web-api-node package here:
const SpotifyWebApi = require("spotify-web-api-node");
const clientId = "5d7bf78f01bd43429a2dd071b754c2af";
const clientSecret = "8f5b3394169b41f08fcaf9cf47f3f76e";

// setting the spotify-api goes here:

const spotifyApi = new SpotifyWebApi({
  clientId: clientId,
  clientSecret: clientSecret
});

spotifyApi
  .clientCredentialsGrant()
  .then(data => {
    spotifyApi.setAccessToken(data.body["access_token"]);
  })
  .catch(error => {
    console.log("Something went wrong when retrieving an access token", error);
  });


// the routes go here:

app.get("/", (req, res) => {
     res.render("index.hbs");
});


app.get("/search/", (req, res) => {
  const artistToSearch = req.query.artistField;

  if (artistToSearch) {
    spotifyApi.searchArtists(artistToSearch).then(
      data => {
        let newArr = [];
        data.body.artists.items.forEach(element => {
          
          let image = "http://www.designshock.com/wp-content/uploads/2016/04/man-4-400.jpg";
          if(element.images.length > 0){
               image = element.images[0].url;
          }
          newArr.push({
            id: element.id,
            name: element.name,
            image: image
          });
        });

        res.render("artists.hbs", {
          artistList: newArr,
          layout: false
        });

      },
      function(err) {
        console.error(err);
      }
    );
  }
  else{
     res.render("index.hbs");
  }
});

app.get("/albums/:albumId", (req, res) => {

     const albumIdToSearch = req.params.albumId;

     spotifyApi
       .getArtistAlbums(albumIdToSearch)
       .then(data => {

          let newArr = [];
          data.body.items.forEach(element => {
               
               let image = "http://www.designshock.com/wp-content/uploads/2016/04/man-4-400.jpg";
               if (element.images.length > 0) {
                 image = element.images[0].url;
               }
               newArr.push({
                 id: element.id,
                 name: element.name,
                 image: image
               });

          });

          res.render("albums.hbs", {
               albumList: newArr,
               layout: false
          });

       })
       .catch(function(error) {
         console.error(error);
       });

});

app.get("/tracks/:tracksId", (req, res) => {

     const tracksIdToSearch = req.params.tracksId;

     spotifyApi
       .getAlbumTracks(tracksIdToSearch, { limit: 5, offset: 1 })
       .then(data => {
           
          let newArr = [];
          data.body.items.forEach(element => {
               newArr.push({
                 id: element.id,
                 name: element.name,
                 preview_url: element.preview_url,
               });
          });

          res.render("tracks.hbs", {
            trackList: newArr,
            layout: false
          });

         },
         function(err) {
           console.log("Something went wrong!", err);
         }
       );

});


app.listen(3000, () => console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊"));


