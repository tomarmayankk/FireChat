import React from 'react'
import Sidebar from '../components/Sidebar'
import Chat from '../components/Chat'

const Home = () => {
  return (
    <div className='bg-blue-300 h-screen flex items-center justify-center'>
        <div className='w-screen h-screen flex '>
        <Sidebar/>
        <Chat/>
        </div>
    </div>
  )
}

export default Home