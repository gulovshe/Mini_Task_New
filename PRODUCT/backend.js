const express=require("express")
const app=express()
const mongoose=require("mongoose")

const bodyParser=require("body-parser")
const dotenv=require("dotenv")
dotenv.config()
const cors = require('cors')
app.use(bodyParser.json())
app.use(express.static('public'))

app.use(cors({
    exposedHeaders: ['x-token'] 
}))

const bcrypt=require("bcrypt")
const jwt=require("jsonwebtoken")
const joi = require("joi")



mongoose.connect(process.env.connection)
.then(res=>{
    console.log("connected")
})
.catch(err=>{
    console.log(err)
    
})



const ProductSchema=new mongoose.Schema({
    name:String,
    description:String,
    price:Number
})

let UserSchema=new mongoose.Schema({
    username:String,
    email:String,
    password:String
})


let ProductValidationSchema=joi.object({
    name:joi.string().min(3).max(30).required(),
    description:joi.string().min(3).max(40).required(),
    price:joi.number().integer().positive().min(5).max(100000).required()
})



const UserValidationSchema = joi.object({
    username: joi.string().min(3).max(30).required(),
    email: joi.string().email().required(),
    password: joi.string().min(8).max(50).pattern(/[A-Z]/, 'uppercase').pattern(/[a-z]/, 'lowercase').pattern(/[0-9]/, 'number').required().messages({
            'string.pattern.base': `Password must contain at least one uppercase letter, one lowercase letter, and one number`
        })
})






const UserModel=mongoose.model("user",UserSchema)
const ProductModel=mongoose.model("product",ProductSchema)


let tokenControl=function(req,res,next){
    let token=req.header("x-token")
    if(!token){
        return res.status(401).send("token yoxdur")
    }
    try {
        let decodedToken= jwt.verify(token,"jwttokensecretkey")
        req.user=decodedToken
         next()
    } catch (err) {
        return res.status(401).send("Token yanlışdır")
        
    }
  
}


app.get("/products",tokenControl,async(req,res,next)=>{
    let products=await ProductModel.find()
    res.send(products)
   

})
app.post("/products",async (req,res)=>{
    let {error}=ProductValidationSchema.validate(req.body)
    if(error){
        return res.send(error.details[0].message)
    }

    let newProduct=new ProductModel(req.body)
    await newProduct.save()
    res.send(newProduct)
})


app.delete("/products/:id", async (req,res)=>{
    let id=req.params.id
    let deleted= await ProductModel.findByIdAndDelete(id)
    res.send(deleted)
})

app.post("/users/register",async(req,res)=>{
    const { error } = UserValidationSchema.validate(req.body)
    if (error) {
        return res.send(error.details[0].message)
    }

    let user=await UserModel.findOne({email:req.body.email})
    if(user){
        return res.send("bu account mövcuddur.")
    }
   let hashedPassword=await bcrypt.hash(req.body.password,10)
//   console.log(hashedPassword)
   let newUser=new UserModel({
        username:req.body.username,
        email:req.body.email,
        password:hashedPassword

    })
    await newUser.save()

let token=await jwt.sign({_id:newUser._id},"jwttokensecretkey")

res.header("x-token",token).send(newUser)
})

app.post("/users/login",async(req,res)=>{
    let user=await UserModel.findOne({email:req.body.email})
    if(!user){
        return res.send("bele bir account müvcud deyil.")
    }
    let isPassword=await bcrypt.compare(req.body.password,user.password)
    if(!isPassword){
        return res.send("Password yanlışdır")
    
    }


 let token=jwt.sign({_id:user._id},"jwttokensecretkey")


    res.send(token)
})




app.listen(8484,()=>{
    console.log("8484 portunda isleyir")
})



