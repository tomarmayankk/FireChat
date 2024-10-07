import { signInWithEmailAndPassword } from 'firebase/auth';
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { auth } from '../Firebase';
const Login = () => {
  const [err, setErr] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const email = e.target[0].value;
    const password = e.target[1].value;

    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/")
    } catch (err) {
      setErr(true);
    }
  };
  return (
    <div className='bg-blue-300 h-screen flex items-center justify-center'>
      <div className='bg-white px-20 py-10 rounded-md flex flex-col items-center gap-10'>
        <span className='font-bold text-2xl'>Login</span>
        <form onSubmit={handleSubmit} className='flex flex-col gap-6 w-80'>
          <input className='border border-gray-400 p-2 rounded-md' type="email" placeholder='Email'/>
          <input className='border border-gray-400 p-2 rounded-md' type="password" placeholder='Enter your password' />
          <button className='bg-blue-700 cursor-pointer text-white font-semibold p-2 w-auto rounded-md'>Login</button>
          {err && <span>Something went wrong</span>}
        </form>
        <p className='mt-0'>Don't have an account? <span className='text-blue-700 cursor-pointer'><Link to="/register">Register</Link></span></p>
      </div>
    </div>
  )
}
export default Login
