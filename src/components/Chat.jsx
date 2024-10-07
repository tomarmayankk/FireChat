import React, { useContext } from 'react'
import Input from './Input'
import { ChatContext } from '../context/ChatContext';
import Messages from './Messages';

const Chat = () => {
  const { data } = useContext(ChatContext);
  return (
    <div className='flex-[2] bg-green-50 h-screen flex flex-col'>

<div className='bg-blue-400 h-20 flex items-center justify-between p-4'>
<span className='font-bold text-lg text-white'>{data.user?.displayName}</span>
  <img
    className='w-11 h-11 rounded-full object-contain'
    src={data.user?.photoURL || "https://via.placeholder.com/150"}
    alt="User profile image"
  />
</div>

        <div className='flex-1 overflow-scroll p-4 mb-10'>
          <Messages/>
        </div>
        <Input/>
        </div>
  )
}
export default Chat