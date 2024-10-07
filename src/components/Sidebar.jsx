import React from 'react'
import Head from './Head'
import Search from './Search'
import Chats from './Chats'

const Sidebar = () => {
  return (
    <div className='flex-[0.6] border-r-2 border-blue-300 bg-slate-600'>
      <Head/>
      <Search/>
      <Chats/>
      </div>
  )
}
export default Sidebar