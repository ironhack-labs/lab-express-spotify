const express = require("express");
const hbs = require("hbs");
const SpotifyWebApi = require("spotify-web-api-node");
const app = express();
require("dotenv").config();

const clientId = process.env.CLIENTID;
const clientSecret = process.env.CLIENTSECRET;

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
    console.log("Oops", error);
  });

app.set("view engine", "hbs");
app.set("views", __dirname + "/views");
app.use(express.static(__dirname + "/public"));

// setting the spotify-api goes here:

// the routes go here:
app.get("/", (req, res, next) => {
  res.render("index");
});

app.get("/artists", (req, res, next) => {
  spotifyApi
    .searchArtists(req.query.artist)
    .then(data => {
      res.render("artists", { data: data.body.artists.items });
      //   res.send(data.body);
      //   console.log("The received data from the API: ", data.body);
      // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
    })
    .catch(err => {
      console.log("The error while searching artists occurred: ", err);
    });
});

app.get("/albums/:albumId", (req, res, next) => {
  spotifyApi
    .getArtistAlbums(req.params.albumId)
    .then(data => {
      //   console.log(data.body);
      res.render("albums", { data: data.body.items });
      //   res.send(data.body);
      //   console.log("The received data from the API: ", data.body);
      // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
    })
    .catch(err => {
      console.log("The error while searching artists occurred: ", err);
    });
});

app.listen(3000, () =>
  console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊")
);

//logic for sorting data before pushing to handlebars
// let newArray = [];
// for(let i = 0; i < data.body.artists.items.length; i++) {
//     let isInNewAray = false;
//     newArray.forEach(oneArtist => {
//         if(data.body.artists.items[i].name === oneArtist.name ) {
//             isInNewAray = true;
//         }
//     })
//     if(!isInNewAray) {
//         newArray.push(data.body.artists.items[i])
//     } else {
//         continue;
//     }
// }
//   console.log(data.body);
