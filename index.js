// require('dotenv').config()
const express = require('express');
const app = express();
const PORT = process.env.PORT ||3000 ;

const cors = require('cors');

const mongoose = require('mongoose');
const DB_URL = "mongodb://localhost:27017/BookShelf";
mongoose.connect(DB_URL,{  autoIndex: true })
.then(()=>{console.log("connected")});

app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use(cors());

const AuthRoutes = require("./Routes/AuthRoutes")
const UsersRoutes = require("./Routes/UserRoutes")
const BookRoutes= require("./Routes/BookRoutes")
const CartRoutes=require("./Routes/CartRoutes")

app.use("/auth",AuthRoutes)
app.use("/user",UsersRoutes)
app.use("/book",BookRoutes)
app.use("/cart",CartRoutes)



app.listen(PORT, ()=>{console.log("http://localhost:"+PORT)});
