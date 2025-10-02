import cloudinary from "../lib/cloudinary.js";
import message from "../models/Message.js";
import User from "../models/User.js";
import { io,userSocketMap } from "../server.js";
// get everybody except user...
export const getUserforSidebar = async(req,res) => {
  try {
    const userID = req.user._id;
    const filteredUsers = User.find({_id:{$ne:userID}}).select("-password");
    const unseenMessages = {};
    const promises = (await filteredUsers).map(async(user) => {
      const messages = await message.find({senderId:user._id,recieverId:userID,seen:false});
      if(messages.length > 0)
      {
        unseenMessages[user._id] = messages.length;
      }
    });
    await Promise.all(promises);
    res.status(200).json({
      success:true,
      users:filteredUsers,
      unseenMessages
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      success:false,
      message:error.message
    });
  }
}

export const getMessages = async(req,res) => {
  try {
    const userID = req.user._id;
    const { id: selectedUserId } = req.params;
    const messages = await message.find({
      $or:[
        {senderId:userID,recieverId:selectedUserId},
        {senderId:selectedUserId,recieverId:userID}
      ]
    });
    await message.updateMany({senderId:selectedUserId,recieverId:userID},{seen:true});
    res.status(200).json({
      success:true,
      messages
    })
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      success:false,
      message:error.message
    });
  }
}

export const markMessageAsSeen = async(req,res) => {
  try {
    const {id} = req.params;
    await message.findByIdAndUpdate(id,{seen:true});
    res.status(200).json({
      success:true
    })
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      success:false,
      message:error.message
    });
  }
}

export const sendMessage = async(req,res) => {
  try {
    const {text,image} = req.body;
    const recieverId = req.params.id;
    const senderId = req.user._id;
    let imageUrl;
    if(image)
    {
      const uploadResponse = await cloudinary.uploader.upload(image);
      imageUrl = uploadResponse.secure_url;
    }
    const newMessage = await message.create({
      senderId:senderId,
      recieverId:recieverId,
      text,
      image:imageUrl
    });
    const recieverSocketId = userSocketMap[recieverId];
    if(recieverSocketId){
      io.to(recieverSocketId).emit("newMessage",newMessage);
    }
    res.status(200).json({
      success:true,
      newMessage
    })
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      success:false,
      message:error.message
    });
  }
}