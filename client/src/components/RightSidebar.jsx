import React, { useContext, useEffect, useState } from 'react'
import assets, { imagesDummyData } from '../assets/assets'
import { MessageContext } from '../context/MessageContext'
import { AuthContext } from '../context/AuthContext'

const RightSideBar = () => {
  const {selectedUser,messages} = useContext(MessageContext)
  const {logout,onlineUsers} = useContext(AuthContext)
  const [imgs,setImgs] = useState([]);
  useEffect(() => {
    setImgs(
      messages.filter(msg=>msg.image).map(msg=>msg.image)
    )
  },[messages]);
  return (
    <div className={`bg-[#8185B2] text-white w-full relative overflow-y-scroll ${selectedUser ? "max:md-hidden" : ""}`}>
      <div className='pt-16 flex flex-col items-center gap-2 font-light text-xs mx-auto'>
        <img src={selectedUser?.profilePic || assets.avatar_icon} alt="" className='w-20 aspect-[1/1] rounded-full' />
        <h1 className='font-medium flex px-10 items-center gap-2 mx-2 text-xl '>
          <p className='h-2 w-2 rounded-full bg-green-500'></p>
          {selectedUser.fullName}
        </h1>
        <p className='px-10 mx-auto'>{selectedUser.bio}</p>
      </div>
      <hr className='my-4 border-[#ffffff50]'/>
      <div className='px-5 text-xs'>
        <p>Media</p>
        <div className='mt-2 max-h-[200px] overflow-y-scroll grid grid-cols-2 gap-4 opacity-80'>
          {imgs.map((url,index) =>{
            return (
            <div key={index} onClick={() => window.open(url)} className='rounded cursor-pointer'>
              <img src={url} className='h-full rounded-md'/>
            </div>
            )
          })}
        </div>
      </div>
      <button onClick={logout} className='absolute bottom-5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-purple-400 to-violet-600 w-[80%] rounded-2xl h-8 cursor-pointer'>
        Logout
      </button>
    </div>
  )
}

export default RightSideBar
