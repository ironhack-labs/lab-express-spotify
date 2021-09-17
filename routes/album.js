// 1. IMPORTACIONES

const express       = require("express")
const router        = express.Router()

const albumController    = require("./../controllers/albumcontroller")
const tracksController    =require("./../controllers/tracksController")

// 2. RUTAS
// http://localhost:3000/books/
//       RUTA   CONTROLLER

// http://localhost:3000/albums/:id
router.get("/:id", albumController.readArtist)
router.get("/:id/:tracks", tracksController.readTrack)




// 3. EXPORTACIÓN
module.exports = router