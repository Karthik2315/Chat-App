import React, { useContext, useEffect, useState } from 'react';
import  assets  from '../assets/assets.js';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext.jsx';
import { MessageContext } from '../context/MessageContext.jsx';

const Sidebar = () => {
  const {getUsers,users,selectedUser,setSelectedUser,unseenMessages,setUnseenMessages} = useContext(MessageContext)
  const navigate = useNavigate();
  const {logout,onlineUsers} = useContext(AuthContext);
  const [input,setInput] = useState(false);
  const filteredUsers = input ? users.filter((user) => user.fullName.toLowerCase().includes(input.toLowerCase())):users;
  useEffect(() => {
    getUsers();
  },[onlineUsers]);
  return (
    <div className={`p-5 bg-[#8185B2]/10 h-full rounded-r-xl overflow-y-scroll text-white ${selectedUser ? "max-md:hidden" : ''}`}>
      <div className='pb-5'>
        <div className='flex justify-between items-center'>
          <img src={assets.logo} alt="logo" className='max-w-40' />
          <div className="relative py-2 group">
            <img src={assets.menu_icon} alt="logo" className='max-h-5 cursor-pointer' />
            <div className='absolute top-full right-0 z-20 w-32 p-5 rounded-md bg-[#282142] border border-gray-600 text-gray-100 hidden group-hover:block'>
              <p onClick={() => navigate('/profile')} className='cursor-pointer text-sm'>Edit Profile</p>
              <hr className='my-2 border-t border-gray-500' />
              <p onClick={logout} className='cursor-pointer text-sm' >LogOut</p>
            </div>
          </div>
        </div>

        <div className='mt-2 p-2 rounded-full bg-[#282142] flex items-center gap-2'>
          <img src={assets.search_icon} alt="Search" className='w-3'/>
          <input onChange= {(e) => setInput(e.target.value)} type='text' className='bg-transparent border-none outline-none text-white text-sm flex-1' placeholder='Search User'/>
        </div>
      </div> 
      <div className='flex flex-col bg-transparent h-full rounded-2xl'>
        {filteredUsers.map((user,index) => {
          return (
          <div onClick = {() => {setSelectedUser(user)}} className={`relative flex items-center gap-2 rounded cursor-pointer text-white p-2 ${selectedUser?._id === user._id && 'bg-[#282142]/50'}`} key={index}>
            <img className='rounded-full w-16 h-16 pb-2' src={user?.profilePic || assets.avatar_icon} alt="" />
            <div className='pl-2 flex flex-col leading-5'>
              <p>{user.fullName}</p>
              {
                onlineUsers.includes(user._id) ? 
                <span className='text-green-500 text-xs'>Online</span> : <span className='text-xs'>Offline</span>
              }
            </div>
            {unseenMessages[user._id]>0 && <p className='absolute top-4 right-4 rounded-full h-5 w-5 bg-violet-600 flex justify-center items-center'>{unseenMessages[user._id]}</p>}
          </div> )
        })}
      </div> 
    </div>
  );;
};

export default Sidebar;