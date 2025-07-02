import express from "express"
import jwt from "jsonwebtoken"
import dotenv from "dotenv"
import UserModel from "../models/User.js";

const route = express.Router();

dotenv.config()




route.post('/signup' , async (req , res)=>{
    const {email , password , name } = req.body;

    try{
        const user = new UserModel({
            email , password , userName : name 
        })

        await user.save();
        const token = jwt.sign({email:email ,Name: name } , process.env.JWT_SECRET , {expiresIn:'1h'})
        res.json({token , name})

    }catch(e){
        res.status(400).json({error :  "User already exist "})
    }
})

route.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await UserModel.findOne({ email });

  const name = user?.userName
  if (!user || !(await user.comparePassword(password))) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }
  const token = jwt.sign({ email: email  , Name : name}, process.env.JWT_SECRET , {expiresIn:'1h'});
  res.json({ token, name });
})


export default route