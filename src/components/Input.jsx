import React, { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { ChatContext } from "../context/ChatContext";
import {
  arrayUnion,
  doc,
  serverTimestamp,
  Timestamp,
  updateDoc,
} from "firebase/firestore";
import { db, storage } from "../Firebase";
import { v4 as uuid } from "uuid";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { Paperclip, Send } from "lucide-react";

const Input = () => {
  const [text, setText] = useState("");
  const [img, setImg] = useState(null);
  const [loading, setLoading] = useState(false); // Loading state

  const { currentUser } = useContext(AuthContext);
  const { data } = useContext(ChatContext);

  const handleSend = async () => {
    if (loading || (!text && !img)) return; // Prevent sending if loading or no text/img
    setLoading(true); // Set loading state

    try {
      const messageData = {
        id: uuid(),
        text,
        senderId: currentUser.uid,
        date: Timestamp.now(),
      };

      if (img) {
        const storageRef = ref(storage, uuid());
        const uploadTask = uploadBytesResumable(storageRef, img);

        uploadTask.on(
          "state_changed",
          null, // Progress function can be added if needed
          (error) => {
            // Handle error appropriately
            console.error("Upload error:", error);
            setLoading(false); // Reset loading state
          },
          async () => {
            try {
              const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
              messageData.img = downloadURL; // Add image URL to message data
              
              // Send message with image
              await updateDoc(doc(db, "chats", data.chatId), {
                messages: arrayUnion(messageData),
              });
              console.log("Message sent with image");
            } catch (error) {
              console.error("Error getting download URL:", error);
            }
          }
        );
      } else {
        // Send message without image
        await updateDoc(doc(db, "chats", data.chatId), {
          messages: arrayUnion(messageData),
        });
        console.log("Message sent without image");
      }

      // Update last message for both users
      await Promise.all([
        updateDoc(doc(db, "userChats", currentUser.uid), {
          [data.chatId + ".lastMessage"]: { text },
          [data.chatId + ".date"]: serverTimestamp(),
        }),
        updateDoc(doc(db, "userChats", data.user.uid), {
          [data.chatId + ".lastMessage"]: { text },
          [data.chatId + ".date"]: serverTimestamp(),
        }),
      ]);

      setText("");
      setImg(null);
    } catch (error) {
      console.error("Send message error:", error);
    } finally {
      setLoading(false); // Always reset loading state
    }
  };

  // Handle Enter key press
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault(); // Prevents default behavior of Enter key
      handleSend();
    }
  };

  return (
    <div className='fixed bottom-0 w-full bg-gray-200 h-14 p-4 flex items-center'>
      <input 
        type="text" 
        placeholder={loading ? "Sending..." : "Message"}  // Dynamic placeholder based on loading state
        className='bg-transparent border-none outline-none rounded-md p-2 mr-4 w-[50rem]'
        onChange={(e) => setText(e.target.value)}
        value={text}
        onKeyDown={handleKeyDown}  // Listen for Enter key press
        aria-label="Type your message" // Accessibility
        disabled={loading} // Disable input during loading
      />
      <div className='flex items-center gap-3 ml-[16rem] mr-2'>
        <input onChange={(e) => setImg(e.target.files[0])} type="file" id='fileip' style={{ display: 'none' }} />
        <label htmlFor="fileip" className='cursor-pointer'>
          <Paperclip size={24} className="text-gray-500" />
        </label>
        <button 
          onClick={handleSend} 
          className='bg-blue-400 p-2 rounded-md flex items-center justify-center'
          disabled={!text && !img || loading} // Disable send if no text or image, or if loading
        >
          <Send size={18} className='text-white' />
        </button>
      </div>
    </div>
  );
}

export default Input;
