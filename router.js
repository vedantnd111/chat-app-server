const express=require("express");
const Router=express.Router();

Router.get("/",(req,res)=>{
    res.send("server is running and up..");
});

module.exports=Router;