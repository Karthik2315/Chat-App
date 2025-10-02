import bcrypt from 'bcryptjs'
import User from '../models/User.js'
import { generateToken } from '../lib/utils.js';
import cloudinary from '../lib/cloudinary.js';

export const signup = async(req,res) => {
  const { fullName,email,password,bio } = res.body;
  try {
    if(!fullName || !email || !password || !bio)
    {
      return res.status(401).json({
        success:false,
        messsage:"Full details is not there"
      })
    }
    const user = User.findOne({email:email});
    if(user)
    {
      return res.status(401).json({
        success:false,
        messsage:"User already exists"
      });
    }
    const salt = await bcrypt.genSalt(10);
    const hashed_password = await bcrypt.hash(password,salt)
    const newUser = User.create({
      fullName,email,password:hashed_password,bio
    });
    const token = generateToken(newUser._id);
    res.cookie("token", token, {
        httpOnly: true, 
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict", 
        maxAge: 7 * 24 * 60 * 60 * 1000 
    })
    res.status(201).json({
      success:true,
      userData:newUser,
      messsage:"Account Created Successfully",
    })
  } catch (error) {
    console.log(error.messsage);
    res.status(400).json({
      success:false,
      messsage:error.messsage
    });
  }
}

export const login = async(req,res) => {
  try {
    const {email,password} = res.body;
    if(!email || !password)
    {
      return res.status(401).json({
        success:false,
        messsage:"Full details is not there"
      })
    }
    const userData = User.findOne({email});
    if(!userData)
    {
      return res.status(404).json({
        success:false,
        messsage:"User does not exist"
      });
    }
    const isPasswordCorrect = bcrypt.compare(password,userData.password);
    if(!isPasswordCorrect)
    {
      return res.status(400).json({
        success:false,
        messsage:"Incorrect credentials"
      });
    }
    const token = generateToken(userData._id);
    res.cookie("token", token, {
        httpOnly: true, 
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict", 
        maxAge: 7 * 24 * 60 * 60 * 1000 
    })
    return res.status(200).json({
      success:true,
      messsage:"User logged in successfully",
      userData
    });

  } catch (error) {
    console.log(error.messsage);
    res.status(400).json({
      success:false,
      messsage:error.messsage
    })
  }
}

export const checkAuth = (req,res) => {
  res.json({success:true,user:req.user});
}

export const updateUserProfile = async(req,res) => {
  try {
    const {profilePic,fullName,bio} = req.body;
    const userId = req.user._id;
    let updatedUser;
    if(!profilePic)
    {
      updatedUser = await User.findByIdAndUpdate(userId,{bio,fullName},{new:true});
    }
    else{
      const upload = await cloudinary.uploader.upload(profilePic);
      updatedUser = await User.findByIdAndUpdate(userId,{profilePic:upload.secure_url,fullName,bio},{new:true});
    }
    res.status(200).json({
      success:true,
      user:updatedUser,
      messsage:"User profile got updated...."
    })
  } catch (error) {
    console.log(error.messsage);
    res.status(400).json({
      success:false,
      messsage:error.messsage
    })
  }
}