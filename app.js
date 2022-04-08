const express=require("express")
require('dotenv').config();

const app=express()
app.set('view engine','ejs');

app.use(express.static(__dirname + '/public'));

app.get("/teams/:team_id",(req,res) =>{
    res.render("team_page", {apiurl:process.env.API_URL, team_id:req.params.team_id});
  
  })

  app.get("/session/:session_id",(req,res) => {
    console.log(process.env.API_URL);
    res.render("room", {roomId:req.params.session_id, title:"AirBoard", apiurl:process.env.API_URL, ws_url:process.env.WS_URL+"/ws/board/"})
  })
  app.listen(3300)