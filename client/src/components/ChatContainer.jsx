import React, { useContext, useEffect, useState } from 'react'
import assets, { messagesDummyData } from '../assets/assets'
import { useRef } from 'react';
import { MessageContext } from '../context/MessageContext';
import { AuthContext } from '../context/AuthContext';
import toast from 'react-hot-toast';

const ChatContainer = () => {

  const { messages,selectedUser,setSelectedUser,sendMessage,getMessages } = useContext(MessageContext)

  const { authUser,onlineUsers } = useContext(AuthContext)

  const scrollEnd = useRef();
  useEffect(() => {
    if(scrollEnd.current && messages)
    {
      scrollEnd.current.scrollIntoView({behavior:"smooth"})
    }
  },[messages]);

  const [input,setInput] = useState('');

  function formatTime(timestamp) {
    const date = new Date(timestamp);
    let hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; 
    const minutesStr = minutes < 10 ? '0' + minutes : minutes;
    return `${hours}:${minutesStr} ${ampm}`;
  }

  const handlesubmitMessage = async(e) => {
    e.preventDefault();
    if(input.trim() === "") return;
    await sendMessage({text:input.trim()});
    setInput("");
  }

  const handleSendImage = async(e) => {
    const file = e.target.files[0];
    if(!file || !file.type.startsWith("image/")){
      toast.error("Send an image file");
      return;
    }
    const reader = new FileReader();
    reader.onloadend = async ()=>{
        await sendMessage({image: reader.result})
        e.target.value = ""
    }
    reader.readAsDataURL(file)
  }

  useEffect(() => {
    if(selectedUser)
    {
      getMessages(selectedUser._id);
    }
  },[selectedUser])


  return selectedUser ? (
    <div className='h-full overflow-scroll relative backdrop-blur-lg'>
    {/* ----- Header ----- */}
      <div className='flex items-center gap-3 py-3 mx-4 border-b border-stone-500'>
        <img src={selectedUser.profilePic || assets.avatar_icon} alt="" className='w-8 rounded-full'/>
        <p className='flex-1 text-lg text-white items-center gap-3'>
          {selectedUser.fullName} {onlineUsers.includes(selectedUser._id) && <span className='inline-block rounded-full w-2 h-2 bg-green-500'></span>}
        </p>
        <img onClick={() => {setSelectedUser(null)}} src={assets.arrow_icon} alt="" className='max-md:hidden max-w-7 cursor-pointer'/>
        <img src={assets.help_icon} alt="" className='max-md:hidden max-w-5'/>
      </div>
    {/* ----- Chat Area ----- */}
      <div className='flex flex-col overflow-y-scroll p-3 pb-6 h-[calc(100%-120px)]'>
        {messages.map((msg,index) => {
          return (<div key={index} className={`flex items-end gap-2 justify-end ${msg.senderId !== authUser._id && 'flex-row-reverse'}`}>
            {msg.image ? (
              <img src={msg.image} alt="" className="max-w-[230px] border border-gray-700 rounded-lg overflow-hidden mb-8"/>
            ) : (
              <p className={`p-2 max-w-[200px] md:text-sm font-light rounded-lg mb-8 break-all bg-violet-500/30 text-white ${msg.senderId === authUser._id 
                    ? 'rounded-br-none' 
                    : 'rounded-bl-none'
                }`}>
                {msg.text}
              </p>
            )}
            <div className="text-center text-xs">
              <img src={msg.senderId === authUser._id ? authUser?.profilePic || assets.avatar_icon : selectedUser?.profilePic || assets.avatar_icon} alt="" className="w-7 rounded-full"/>
              <p className='text-gray-500'>{formatTime(msg.createdAt)}</p>
            </div>
            <div ref={scrollEnd}>
            </div>
          </div> )
        })}
      </div>
      <div className='flex absolute bottom-0 left-0 right-0 items-center gap-3 p-3'>
        <div className='flex h-10 items-center w-full bg-white/10 rounded-2xl gap-2 p-1'>
          <input onChange= {(e) => setInput(e.target.value)} value={input} onKeyDown={(e) => e.key === "Enter" ? handlesubmitMessage(e) : null} type='text' className='flex-1 rounded-lg rounded-l-none ml-2 border-none outline-none text-white text-md' placeholder='Send a message'/>
          <input onChange={handleSendImage} type="file" id='image' accept='image/png, image/jpeg' hidden/>
          <label htmlFor='image'>
            <img src={assets.gallery_icon} alt="" className='w-5 mr-2 cursor-pointer'/>
          </label>
        </div>
        <img onClick={handlesubmitMessage} src={assets.send_button} className='w-8 h-8 cursor-pointer'/>
      </div>
    </div>
  ) : (
    <div className='flex justify-center items-center gap-2 bg-white/10'>
      <img src={assets.logo_icon} alt="" className='max-w-16' />
      <p className='text-white font-semibold'>Chat anytime, anywhere</p>
    </div>
  )
}

export default ChatContainer
