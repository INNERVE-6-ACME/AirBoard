const express = require("express")
const app=express()
const server=require("http").Server(app)
const io=require("socket.io")(server)
const{v4:idgen}=require("uuid")
require('dotenv').config()

app.set("view engine","ejs")
app.use(express.static("public"))

app.get("/video",(req,res)=>{
    res.redirect(`/room/${idgen()}`)
})


app.get("/sessions/:team_id",(req, res) => {
    res.render("sessions", {apiurl:process.env.API_URL, team_id:req.params.team_id});
  })

  app.get("/signup",(req, res) => {
    res.render("signup",{apiurl:process.env.API_URL})
  })
  
app.get("/login",(req, res) => {
    res.render("login",{apiurl:process.env.API_URL})
  })

  app.get("/",(req, res) => {
    res.render("home",{apiurl:process.env.API_URL})
  })

  app.get("/chat/:team_id",(req, res) => {
    res.render("chat",{ws_url:process.env.WS_URL, team_id:req.params.team_id})
  })

app.get("/room/:room",(req,res)=>{
    res.render("room",{roomId:req.params.room,title:"Airboard", ws_url:process.env.WS_URL+"/ws/board/1"})
})

app.get("/session/:session_id",(req,res) => {
    res.render("board", {roomId:req.params.session_id, title:"AirBoard", api_url:process.env.API_URL, ws_url:process.env.WS_URL})
  })

io.on("connection",socket=>{
    socket.on("join-room",(roomId,userId)=>{
        socket.join(roomId)
        socket.broadcast.to(roomId).emit("user-connected",userId)
    })
    socket.on('connection-request',(roomId,userId)=>{
        io.to(roomId).emit('new-user-connected',userId);
    })
})
server.listen(process.env.port||3000)
