import React, { useContext, useState } from 'react';
import { db } from '../Firebase';
import { collection, doc, getDoc, getDocs, query, serverTimestamp, setDoc, updateDoc, where } from 'firebase/firestore';
import { AuthContext } from '../context/AuthContext'; 

const Search = () => {
  const [username, setUsername] = useState("");
  const [user, setUser] = useState(null);
  const [err, setErr] = useState(false);
  const [loading, setLoading] = useState(false);

  const { currentUser } = useContext(AuthContext);

  const handleSearch = async () => {
    setLoading(true);
    const q = query(
      collection(db, "users"),
      where("displayName", "==", username)
    );

    try {
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        querySnapshot.forEach((doc) => {
          setUser(doc.data());
        });
      } else {
        setErr("User not found");
      }
    } catch (err) {
      setErr("An error occurred while searching.");
    }
    setLoading(false);
  };

  const handleKey = (e) => {
    if (e.code === "Enter") {
      setErr(false);
      handleSearch();
    }
  };

  const handleSelect = async () => {
    const combinedId =
      currentUser.uid > user.uid
        ? currentUser.uid + user.uid
        : user.uid + currentUser.uid;
    try {
      const res = await getDoc(doc(db, "chats", combinedId));

      if (!res.exists()) {
        //create a chat in chats collection
        await setDoc(doc(db, "chats", combinedId), { messages: [] });

        //create user chats
        await updateDoc(doc(db, "userChats", currentUser.uid), {
          [combinedId + ".userInfo"]: {
            uid: user.uid,
            displayName: user.displayName,
            photoURL: user.photoURL,
          },
          [combinedId + ".date"]: serverTimestamp(),
        });

        await updateDoc(doc(db, "userChats", user.uid), {
          [combinedId + ".userInfo"]: {
            uid: currentUser.uid,
            displayName: currentUser.displayName,
            photoURL: currentUser.photoURL,
          },
          [combinedId + ".date"]: serverTimestamp(),
        });
      }
    } catch (err) {
      setErr("Failed to create chat.");
    }

    setUser(null);
    setUsername("");
  };

  return (
    <div className='border-b-2 border-green-700'>
      <div>
        <input
          onKeyDown={handleKey}
          onChange={(e) => setUsername(e.target.value)}
          value={username}
          className='bg-gray-100 w-full p-2 outline-none'
          type="text"
          placeholder='Search a friend'
        />
      </div>
      {loading && <span>Searching...</span>}
      {err && <span className='text-red-500'>{err}</span>}
      {user && (
        <div onClick={handleSelect} className='flex items-center p-4 gap-3 cursor-pointer hover:bg-green-700'>
          <img className='w-10 h-10 rounded-full' src={user.photoURL} alt={user.displayName} />
          <div>
            <span className='font-bold text-lg text-white'>{user.displayName}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default Search;
