import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { db } from '../Firebase';
import { onSnapshot, doc } from 'firebase/firestore';
import { ChatContext } from '../context/ChatContext';

const Chats = () => {
  const [chats, setChats] = useState([]);
  const { currentUser } = useContext(AuthContext);
  const { dispatch } = useContext(ChatContext);
  useEffect(() => {
    const getChats = () => {
      const unsub = onSnapshot(doc(db, "userChats", currentUser.uid), (doc) => {
        setChats(doc.data());
      });

      return () => {
        unsub();
      };
    };

    currentUser.uid && getChats();
  }, [currentUser.uid]);
  
  const handleSelect = (u) => {
    dispatch({ type: "CHANGE_USER", payload: u });
  };
  return (
    <div>
       {Object.entries(chats)?.sort((a,b)=>b[1].date - a[1].date).map((chat) => (
        <div key={chat[0]} onClick={() => handleSelect(chat[1].userInfo)} className='flex items-center p-4 gap-3 cursor-pointer hover:bg-slate-400'>
          <img
            className='w-11 h-11 rounded-full'
            src={chat[1].userInfo.photoURL || "https://t4.ftcdn.net/jpg/05/11/55/91/360_F_511559113_UTxNAE1EP40z1qZ8hIzGNrB0LwqwjruK.jpg"}
            alt={chat[1].userInfo.displayName}
          />
          <div>
            <span className='font-bold text-lg text-white'>{chat[1].userInfo.displayName}</span>
            <p className='text-sm font-semibold text-gray-300'>{chat[1].lastMessage?.text}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Chats;
