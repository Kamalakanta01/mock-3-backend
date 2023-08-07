let express = require("express");
let mongoose = require("mongoose")
const { connection } = require("./connection");
const { productModule } = require("./productSchema")
let app = express();
app.use(express.json());

app.get("/browse",async (req,res)=>{
    try{
        let {category,date,q} = req.query;
        let data = []
        if(category&&q&&date){
            if(date=="asc"){
                data = await productModule.find({name:{$regex:q,$options:"i"},category:category}).sort({postedAt:1})
            }else{
                data = await productModule.find({name:{$regex:q,$options:"i"},category:category}).sort({postedAt:-1})
            }
        }else if(category&&q){
            data = await productModule.find({name:{$regex:q,$options:"i"},category:category})
        }else if(q&&date){
            if(date=="asc"){
                data = await productModule.find({name:{$regex:q,$options:"i"}}).sort({postedAt:1})
            }else{
                data = await productModule.find({name:{$regex:q,$options:"i"}}).sort({postedAt:-1})
            }
        }else if(category&&date){
            if(date=="asc"){
                data = await productModule.find({category:category}).sort({postedAt:1})
            }else{
                data = await productModule.find({category:category}).sort({postedAt:-1})
            }
        }else if(category){
            data = await productModule.find({category});
        }else if(date){
            if(date=="asc"){
                data = await productModule.find().sort({postedAt:1})
            }else{
                data = await productModule.find().sort({postedAt:-1})
            }
        }else if(q){
            data = await productModule.find({name:{$regex:q,$options:"i"}});
        }else{
            data = await productModule.find();
            console.log("else");
        }
        res.send(data);
    }catch(error){
        res.status(500).send("server error")
    }
})

app.post("/post", async(req,res)=>{
    try{
        let {name,description,category,image,location,postedAt,price} = req.body;
        let newProdcut = new productModule({
            name:name,
            description:description,
            category:category,
            image:image,
            location:location,
            postedAt:postedAt,
            price:price
        })
        await newProdcut.save();
        res.send("Product added")
    }catch(error){
        res.send(error);
    }
})

app.delete("/browse/:id", async(req,res)=>{
    try{
        let id = req.params.id;
        await productModule.findOneAndDelete({_id:id});
        console.log(id);
        res.send("Deleted")
    }catch(error){
        res.send(error)
    }
})

app.listen(8080,async ()=>{
    try{
        await connection;
        console.log("connected on port 8080")
    }catch(error){
        console.log(error);
    }
})