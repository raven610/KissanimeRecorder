const express = require('express')
const scraper = require('./scraper')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
require('dotenv').config()


mongoose.connect(process.env.DB_CONNECT,{ useNewUrlParser: true , useUnifiedTopology: true })
const db = mongoose.connection
db.on('error',()=>console.log('Database Error'))
const app = express()
const schema = mongoose.Schema
const AnimeSchema = new schema({
    title: {type:String,unique:true},
    status: String,
    episodes: Number,
    watched:Number,
    url:String
},{strict:true});
var Anime = db.model('Anime', AnimeSchema);
app.use(bodyParser.json())
app.use(express.static('./public'))


app.get('/', function(req, res) {
    res.sendFile('index.html',{root:__dirname+"/public/"});
});

app.get('/animelist',(req,res)=>{
    res.sendFile('mylist.html',{root:__dirname+"/public/"})
})

app.get('/mylist',(req,res)=>{
    Anime.find({},function(err,result){
        if(err){
            console.log(err);
        }else {
            res.json(result)
        }
    })
})

app.post('/getDetails',async (req,res)=>{
    url = req.body.url
    const result = await scraper.getDetails(url)
    res.send(result)
})

app.post('/add',(req,res)=>{
        Anime.findOne({title:req.body.title},function(err,rest){
            if(err){
                res.send(JSON.stringify({"inserted":"false"}))
            }
            if(rest){
                res.send(JSON.stringify({"inserted":"false"}))
            }else{
                const obj = new Anime({
                    title: req.body.title,
                    status: req.body.status,
                    episodes: req.body.episodes,
                    watched:req.body.watched,
                    url:req.body.url
                })
                obj.save()
                res.send(JSON.stringify({"inserted":"true"}))
            }
        })
})

app.post("/updateWatched",(req,res)=>{
    for(let i=0;i<req.body.length;i++){
        const query = {"title":req.body[i].title}
        const set = {$set:{"watched":req.body[i].watched}}
        Anime.updateOne(query,set,(err)=>{
            if (err) {console.log(err)}
        })
    }
    res.send(JSON.stringify({"status":"done"}))
})

app.get('/updateList',async (req,res)=>{
    Anime.find({},function(err,result){
        if(err){
            res.send(JSON.stringify({"status":"false"}))
        }else{
            result.forEach(async (anime)=>{
                if(anime.status.trim() ==="Ongoing"){
                    const details = await scraper.getDetails(anime.url)
                    const query = {title : anime.title}
                    Anime.updateOne(query,{$set : {status:details.status,episodes:details.episodes}},(err)=>{
                        if(err){
                            console.log(err);
                        }
                    })
                }
            })
            res.send(JSON.stringify({"status":"true"}))
        }
    })
})


app.listen(process.env.PORT || 5000,()=>{
    console.log('listening ....');
})
