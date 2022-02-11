// modulos express y path

const express = require("express");
const path = require("path");

const app = express();

//carpeta estatica public

app.use(express.static(path.resolve(__dirname,"./public")));

//servidor localhost:3010

let puerto = 3010;
app.listen(puerto, ()=>{
    console.log("servidor corriendo en el puerto " + puerto) 
})

//vinculos de cada página

app.get("/", (req, res) => 
    res.sendFile(path.join(__dirname, "/views/index.html")))

app.get("/product-detail",(req,res)=>{
    res.sendFile(path.resolve("./views/productDetail.html"))
})