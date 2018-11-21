const express = require('express');
const app = express();
const hbs = require('hbs');
const bodyParser = require ("body-parser")
const axios = require ("axios")
var path = require("path")

hbs.registerPartials(__dirname + '/views/partials');

app.use(express.static("public"))

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.use(bodyParser.json() );
app.use(bodyParser.urlencoded({
 extended: true
}));

app.use("/", require("./routes/index"))
app.use("/artists", require("./routes/artists"))

app.listen(3000,  ()=>{
  console.log("listening")
})
