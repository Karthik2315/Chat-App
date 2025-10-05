import bcrypt from 'bcryptjs'
import User from '../models/User.js'
import { generateToken } from '../lib/utils.js';
import cloudinary from '../lib/cloudinary.js';

export const signup = async(req,res) => {
  const { fullName,email,password,bio } = req.body;
  try {
    if(!fullName || !email || !password || !bio)
    {
      return res.status(401).json({
        success:false,
        messsage:"Full details is not there"
      })
    }
    const user = await User.findOne({email:email});
    if(user)
    {
      return res.status(401).json({
        success:false,
        message:"User already exists"
      });
    }
    const salt = await bcrypt.genSalt(10);
    const hashed_password = await bcrypt.hash(password,salt)
    const newUser = await User.create({
      fullName,email,password:hashed_password,bio
    });
    const token = generateToken(newUser._id);
    res.cookie("token", token, {
        httpOnly: true, 
        secure: process.env.NODE_ENV === "production",
        sameSite: "None", 
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
    const {email,password} = req.body;
    if(!email || !password)
    {
      return res.status(401).json({
        success:false,
        message:"Full details is not there"
      })
    }
    const userData = await User.findOne({email});
    if(!userData)
    {
      return res.status(404).json({
        success:false,
        message:"User does not exist"
      });
    }
    const isPasswordCorrect = await bcrypt.compare(password,userData.password);
    if(!isPasswordCorrect)
    {
      return res.status(400).json({
        success:false,
        message:"Incorrect credentials"
      });
    }
    const token = generateToken(userData._id);
    res.cookie("token", token, {
        httpOnly: true, 
        secure: process.env.NODE_ENV === "production",
        sameSite: "None", 
        maxAge: 7 * 24 * 60 * 60 * 1000 
    })
    return res.status(200).json({
      success:true,
      message:"User logged in successfully",
      userData
    });

  } catch (error) {
    console.log(error.messsage);
    res.status(400).json({
      success:false,
      message:error.messsage
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

export const logout = async(req,res) => {
  try {
    console.log("hi")
    res.clearCookie("token",{
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "None",
    })
    res.status(200).json({
      success: true,
      message: "Logged out successfully"
    });
  } catch (error) {
    console.log(error.messsage);
    res.status(500).json({
      success:false,
      messsage:error.messsage
    })
  }
}