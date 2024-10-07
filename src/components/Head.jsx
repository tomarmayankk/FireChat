import { signOut } from 'firebase/auth'
import React, { useContext } from 'react'
import { auth } from '../Firebase'
import { AuthContext } from '../context/AuthContext'
import { LogOut } from 'lucide-react'
const Head = () => {
  const {currentUser} = useContext(AuthContext);
  return (
    <div className='bg-blue-400 flex items-center justify-between h-20 p-4'>
      <span className='font-bold text-2xl text-green-50'>FireChat</span>
      <div className='flex items-center justify-center'>
        <img className='h-7 w-7 rounded-full' src={currentUser.photoURL} alt="" />
        <span className='mr-4 ml-2 text-white font-medium'>{currentUser.displayName}</span>
        <button onClick={() => signOut(auth)} className='bg-gray-50 cursor-pointer font-semibold p-1 w-auto rounded-md hover:bg-gray-300'><LogOut/></button>
      </div>
    </div>
  )
}
export default Head
