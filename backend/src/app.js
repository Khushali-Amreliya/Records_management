const express = require("express")
const connectDB = require("./db/dbconnection")
const router = require("./Routes/v1")
const cors = require("cors")

const app = express()
const PORT = 5050
app.use(cors());

app.listen(PORT, () => {
    console.log("Connected Successfully", PORT);
})
connectDB()
app.use(express.json())
app.use("/v1", router)