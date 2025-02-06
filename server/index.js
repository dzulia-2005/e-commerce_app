const express = require('express');
const connectDB = require('./database/db');
const dotenv = require('dotenv');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const path = require("path");
const {errorhandler} = require('./middlewares/errors');
const authRoute= require('./routes/auth');
const cardRoute = require('./routes/card');
const verifyToken = require("./middlewares/verify");
dotenv.config();

const app = express();

app.use(
    cors({
        origin:'*',
    })
);

app.use(express.json());
app.use(cookieParser());
app.use("/uploads" , express.static(path.join(__dirname,"uploads")));

//Routes
app.use("/api/auth",authRoute);
app.use("/api/card",verifyToken,cardRoute);



app.use(errorhandler);

connectDB();

app.listen(2000,()=>{
    connectDB();
    console.log("server started is port:2000")
})

module.exports = app;