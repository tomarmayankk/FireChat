import React, { useContext, useEffect, useRef } from "react";
import { AuthContext } from "../context/AuthContext";
import { ChatContext } from "../context/ChatContext";

const Message = ({ message }) => {
  const { currentUser } = useContext(AuthContext);
  const { data } = useContext(ChatContext);

  const ref = useRef();

  useEffect(() => {
    ref.current?.scrollIntoView({ behavior: "smooth" });
  }, [message]);

  return (
    <div
      ref={ref}
      className={`flex gap-4 mb-4 ${message.senderId === currentUser.uid ? "justify-end" : ""}`}
    >
      <div
        className={`messageInfo flex flex-col items-center text-gray-500 font-medium ${
          message.senderId === currentUser.uid ? "hidden" : ""
        }`}
      >
        <img
          src={data.user.photoURL} // User's photo for received messages
          alt=""
          className="w-8 h-8 rounded-full"
        />
      </div>

      <div
        className={`messageContent max-w-[70%] ${
          message.senderId === currentUser.uid ? "text-right" : ""
        }`}
      >
        {message.text && ( // Only render text if it exists
          <p
            className={`p-3 rounded-lg shadow-sm ${
              message.senderId === currentUser.uid
                ? "bg-blue-400 text-white rounded-tl-lg"
                : "bg-white text-black rounded-br-lg"
            }`}
          >
            {message.text}
          </p>
        )}
        {message.img && (
          <img
            src={message.img}
            alt=""
            className="w-30 h-40 object-cover mt-2 rounded-md"
          />
        )}
      </div>

      {message.senderId === currentUser.uid && (
        <div className="messageInfo flex flex-col items-center text-gray-500 font-medium">
          <img
            src={currentUser.photoURL} // Current user's photo for sent messages
            alt=""
            className="w-8 h-8 rounded-full"
          />
        </div>
      )}
    </div>
  );
};

export default Message;
