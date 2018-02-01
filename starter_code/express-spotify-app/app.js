var SpotifyWebApi = require("spotify-web-api-node");
const express = require("express");
const app = express();
const expressLayouts = require("express-ejs-layouts");

//tell our server to serve static files from the public directory
app.use(express.static("public"));

// creates an absolute path pointing to a folder called "views"
app.set("views", __dirname + "/views/layouts");
app.set("view engine", "ejs");

app.use(expressLayouts);
app.set("views", __dirname + "/views/layouts");
app.set("layout", "main-layout");

//Remember to paste here your credentials

// var clientId = " d6ffd24f10694ddb8091367925b376cb",
//   clientSecret = "6a846df66efa4d41a261dc0c0528399d ";

// var spotifyApi = new SpotifyWebApi({
//   clientId: clientId,
//   clientSecret: clientSecret
// });

// Retrieve an access token.
// spotifyApi.clientCredentialsGrant().then(
//   function(data) {
//     spotifyApi.setAccessToken(data.body["access_token"]);
//   },
//   function(err) {
//     console.log("Something went wrong when retrieving an access token", err);
//   }
// );

app.get("/artists", (req, res, next) => {
  res.render("index.ejs");
});

// Server Started
app.listen(3000, () => {
  console.log("mySpotify ready at port 3000!");
});
