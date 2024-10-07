import { doc, onSnapshot } from "firebase/firestore";
import React, { useContext, useEffect, useState } from "react";
import { ChatContext } from "../context/ChatContext";
import { db } from "../Firebase";
import Message from "./Message";

const Messages = () => {
  const [messages, setMessages] = useState([]);
  const { data } = useContext(ChatContext);

  useEffect(() => {
    if (data.chatId) {
      const unSub = onSnapshot(doc(db, "chats", data.chatId), (doc) => {
        doc.exists() && setMessages(doc.data().messages);
      });

      return () => {
        unSub();
      };
    }
  }, [data.chatId]);

  return (
    <div className="messages p-4 overflow-auto">
      {messages.length > 0 ? (
        messages.map((m) => <Message message={m} key={m.id} />)
      ) : (
        <div className="flex justify-center items-center h-full">
          <span className="text-2xl font-bold text-gray-500">
            Start a conversation
          </span>
        </div>
      )}
    </div>
  );
};

export default Messages;
