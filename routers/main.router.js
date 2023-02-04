const router = require("express").Router()
const controller = require("../controllers/main.controller")

router.get("/", controller.home)

module.exports = router