require("dotenv").config();

const express = require("express")
const hbs = require("hbs")
const app = express();


app.set("view engine", "hbs")
app.set("views", __dirname + "/views")
app.use(express.static(__dirname + "/public"));
// hbs.registerPartials(`${__dirname}/views/partials`)
// setting the spotify-api goes here:

// the routes go here:
const index = require("./routes/indexRoutes.js");
app.use("/", index);



app.listen(3000, () =>
    console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊")
)