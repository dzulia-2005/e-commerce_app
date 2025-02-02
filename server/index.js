const express = require('express');
const app = express();

app.get('/',(req,res)=>{
    res.send("hello from port 2000")
})

app.listen(2000,()=>{
    console.log("server started is port:2000")
})

