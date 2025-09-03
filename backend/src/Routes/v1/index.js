const express = require("express")

const recordPostRoutes = require("./recordRoutes")
const router = express()

router.use("/records", recordPostRoutes)

module.exports = router