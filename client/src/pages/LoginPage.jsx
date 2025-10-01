import React, { useState } from 'react'
import assets from '../assets/assets'

const LoginPage = () => {
  const [currentState,setCurrentState] = useState('Sign Up');
  return (
    <div className='min-h-screen backdrop-blur-2xl bg-cover bg-center flex items-center justify-center sm:justify-evenly max-sm:flex-col'>
      {/* -------------------------- */}
      <img src={assets.logo_big} className='w-[min(30vm,250px)]'/>
      {/* -------------------------- */}
      <form className='border-2 bg-white/8 text-white border-gray-500 p-6 flex flex-col gap-6 rounded-lg shadow-lg'>
        <h2 className='font-medium text-2xl flex justify-between items-center'>
          {currentState}
          <img src={assets.arrow_icon} className='cursor-pointer w-5'/>
        </h2>
        
      </form>
    </div>
  )
}

export default LoginPage
