import React, { useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import assets from '../assets/assets';
import { AuthContext } from '../context/AuthContext';

const ProfilePage = () => {

  const {authUser,updateProfile} = useContext(AuthContext);
  const [selectedImg,setSelectedImg] = useState(null);
  const navigate = useNavigate();
  const [name,setName] = useState(authUser.fullName);
  const [bio,setBio] = useState(authUser.bio);

  const handleSubmit = async(e) => {
    e.preventDefault();
    if(!selectedImg)
    {
      await updateProfile({fullName:name,bio});
      navigate('/');
      return;
    }
    const reader = new FileReader();
    reader.readAsDataURL(selectedImg);
    reader.onload = async ()=>{
        const base64Image = reader.result;
        await updateProfile({profilePic: base64Image, fullName: name, bio});
        navigate('/');
        return;
    }
  }

  return (
    <div className='min-h-screen flex justify-center items-center'>
      <div className='w-5/6 max-w-2xl backdrop-blur-2xl text-white border-2 border-gray-600 flex justify-between items-center rounded-lg
      max-sm:flex-col-reverse'>
        <form onSubmit={handleSubmit} className='flex flex-col p-10 gap-5 flex-1'>
          <h3 className='text-lg'>Profile Details</h3>
          <label htmlFor='avatar' className='flex items-center gap-3 cursor-pointer'>
            <input onChange={(e) => setSelectedImg(e.target.files[0])} type="file" id='avatar' accept='.png, .jpg, .jpeg'  hidden/>
            <img src={selectedImg ? URL.createObjectURL(selectedImg) : assets.avatar_icon} className={`w-12 h-12 ${selectedImg && 'rounded-full'}`}/> Upload Profile Pic
          </label>
          <input type='text' onChange={(e) => setName(e.target.value)} placeholder='Your Name'  value={name} required className='p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500' />
          <textarea type='te' onChange={(e) => setBio(e.target.value)} placeholder='Enter the Bio'  value={bio} required className='p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500 text-white' rows={4} />
          <button type='submit' className='bg-gradient-to-r from-violet-500 to-indigo-600 text-white rounded-full p-2 cursor-pointer'>
            Save
          </button>
        </form>
        <img src={authUser.profilePic ? authUser.profilePic : assets.logo_icon} className={`max-w-40 aspect-square rounded-full mx-10 max-sm:mt-10 ${authUser.profilePic && 'rounded-full'}`} />
      </div>
    </div>
  )
} 

export default ProfilePage
