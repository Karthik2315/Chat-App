import React, { useContext, useState } from 'react'
import assets from '../assets/assets'
import { AuthContext } from '../context/AuthContext';

const LoginPage = () => {
  const [currentState,setCurrentState] = useState('Sign Up');
  const [fullName,setfullName] = useState('');
  const [email,setemail] = useState('');
  const [bio,setbio] = useState('');
  const [password,setPassword] = useState('');
  const [isDataSubmitted,setisDataSubmitted] = useState(false);

  const {login} = useContext(AuthContext);


  const onSubmitHandler = (e) => {
    e.preventDefault();
    if(currentState==='Sign Up' && !isDataSubmitted)
    {
      setisDataSubmitted(true);
      return ;
    }

    login(currentState==="Sign Up" ? "signup" : "login",{fullName,email,password,bio});
  }

  return (
    <div className='min-h-screen backdrop-blur-2xl bg-cover bg-center flex items-center justify-center sm:justify-evenly max-sm:flex-col'>
      {/* -------------------------- */}
      <img src={assets.logo_big} className='w-60'/>
      {/* -------------------------- */}
      <form onSubmit={onSubmitHandler} className='border-2 bg-white/8 text-white border-gray-500 p-6 flex flex-col gap-4 rounded-lg shadow-lg'>
        <h2 className='font-medium text-2xl flex justify-between items-center'>
          {currentState}
          {isDataSubmitted && <img onClick={() => setisDataSubmitted(false)} src={assets.arrow_icon} className='cursor-pointer w-5'/>}
        </h2>
        {currentState === "Sign Up" && !isDataSubmitted && <input onChange={(e) => setfullName(e.target.value)} value={fullName} type='text' className='p-2 border border-gray-500 rounded-md focus:ring-2 focus:ring-indigo-500' placeholder='Enter Full name' required/>}
        {!isDataSubmitted && (
          <>
            <input onChange={(e) => setemail(e.target.value)} value={email} type='email' className='p-2 border border-gray-500 rounded-md focus:ring-2 focus:ring-indigo-500' placeholder='Enter Email' required/>
            <input onChange={(e) => setPassword(e.target.value)} value={password} type='password' className='p-2 border border-gray-500 rounded-md focus:ring-2 focus:ring-indigo-500 ' placeholder='Enter Password' required/>
          </>
        )}
        {currentState ==='Sign Up' && isDataSubmitted && (
          <textarea onChange={(e) => setbio(e.target.value)} value={bio} row={4} className='p-2 border border-gray-500 rounded-md focus:ring-2 focus:ring-indigo-500 ' placeholder='Set a short Bio....' required>
          </textarea>
        )}
        <button type='submit' className='bg-gradient-to-r from-purple-500 to-violet-600 rounded-full py-3 cursor-pointer'>
          {currentState === 'Sign Up' ? "Create Account" : "Login Now"}
        </button>
        {currentState === 'Sign Up' && (
          <div className='flex items-center gap-2 text-sm text-gray-500'>
            <input type='checkbox'/>
            <p> Agree to terms of use & privacy policy.</p>
          </div>
        )}
        <div className='flex flex-col text-gray-500 gap-2'>
          {currentState === 'Sign Up' ? (
            <p className='text-sm'>Already have an account? <span onClick={() => {setCurrentState('Login');setisDataSubmitted(false)}} className=' cursor-pointer text-indigo-500 font-medium'>Login Here</span></p>
          ):(
            <p className='text-sm'>Create an account? <span onClick={() => {setCurrentState('Sign Up');setisDataSubmitted(false)}}className=' cursor-pointer text-indigo-500 font-medium'>Click Here</span></p>
          )}
        </div>
      </form>
    </div>
  )
}

export default LoginPage
