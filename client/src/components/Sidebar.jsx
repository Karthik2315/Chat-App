import React from 'react';
import  assets, { userDummyData }  from '../assets/assets.js';
import { useNavigate } from 'react-router-dom';

const Sidebar = ({ selectedUser, setSelectedUser }) => {
  const navigate = useNavigate();
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
              <p className='cursor-pointer text-sm' >LogOut</p>
            </div>
          </div>
        </div>

        <div className='mt-2 p-2 rounded-full bg-[#282142] flex items-center gap-2'>
          <img src={assets.search_icon} alt="Search" className='w-3'/>
          <input type='text' className='bg-transparent border-none outline-none text-white text-sm flex-1' placeholder='Search User'/>
        </div>
      </div> 
      <div className='flex flex-col bg-amber-500 h-full rounded-2xl'>
        
      </div> 
    </div>
  );
};

export default Sidebar;