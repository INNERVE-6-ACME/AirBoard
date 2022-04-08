const express=require("express")
require('dotenv').config();

const app=express()
app.set('view engine','ejs');

app.use(express.static(__dirname + '/public'));
// app.get('/', (req, res)=>{
//     res.render("team_page")
// })




  app.listen(3300)