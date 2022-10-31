const express = require("express");
const app = express();
const cookieParser = require("cookie-parser")
const errorMiddleware = require("./middleware/error")
app.use(express.json())
app.use(cookieParser())
const products = require("./routes/productRoute")
const user = require("./routes/userRoute")
const order = require("./routes/orderRoute")

app.use("/api/v1",products)
app.use("/api/v1",user)
app.use("/api/v1",order)


app.use(errorMiddleware)

module.exports = app;