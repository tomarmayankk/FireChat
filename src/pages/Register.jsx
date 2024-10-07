import { Image } from 'lucide-react';
import React, { useState } from 'react';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { storage, auth, db } from '../Firebase';
import { doc, setDoc } from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { Link, useNavigate } from 'react-router-dom';

const Register = () => {
  const [err, setErr] = useState(null);
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();
    const displayName = e.target[0].value;
    const email = e.target[1].value;
    const password = e.target[2].value;
    const file = e.target[3].files[0];

    if (!file) {
      setErr("Please upload a profile picture.");
      setLoading(false);
      return;
    }

    try {
      // Create user
      const res = await createUserWithEmailAndPassword(auth, email, password);

      // Create a unique image name
      const date = new Date().getTime();
      const storageRef = ref(storage, `${displayName + date}`);

      // Upload file with progress tracking
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setUploadProgress(progress);
        },
        (error) => {
          console.error("Upload failed:", error);
          setErr("Upload failed, please try again.");
          setLoading(false);
        },
        async () => {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          try {
            // Update profile
            await updateProfile(res.user, {
              displayName,
              photoURL: downloadURL,
            });

            // Create user in Firestore
            await setDoc(doc(db, "users", res.user.uid), {
              uid: res.user.uid,
              displayName,
              email,
              photoURL: downloadURL,
            });

            // Create empty user chats in Firestore
            await setDoc(doc(db, "userChats", res.user.uid), {});
            navigate("/");
          } catch (error) {
            console.error("Error saving user data:", error);
            setErr("Failed to save user data.");
          } finally {
            setLoading(false);
          }
        }
      );
    } catch (error) {
      console.error("Registration error:", error);
      setErr("Registration failed, please try again.");
      setLoading(false);
    }
  };

  return (
    <div className='bg-blue-300 h-screen flex items-center justify-center'>
      <div className='bg-white px-20 py-10 rounded-md flex flex-col items-center gap-10'>
        <span className='font-bold text-2xl'>Register</span>
        <form onSubmit={handleSubmit} className='flex flex-col gap-6 w-80'>
          <input className='border border-gray-400 p-2 rounded-md' type='text' placeholder='Name' required />
          <input className='border border-gray-400 p-2 rounded-md' type='email' placeholder='Email' required />
          <input className='border border-gray-400 p-2 rounded-md' type='password' placeholder='Enter your password' required />
          <input style={{ display: 'none' }} type='file' id='file' required />
          <label htmlFor='file' className='cursor-pointer bg-blue-500 text-white px-4 py-2 rounded-md flex justify-center items-center gap-2'>
            <Image size={18} /> Add your profile picture
          </label>
          <button className='bg-blue-700 cursor-pointer text-white font-semibold p-2 w-auto rounded-md' disabled={loading}>
            {loading ? 'Registering...' : 'Register'}
          </button>
          {err && <span className='text-red-500'>{err}</span>}
          {uploadProgress > 0 && <span>Upload Progress: {uploadProgress.toFixed(0)}%</span>}
        </form>
        <p className='mt-0'>Already have an account? <span className='text-blue-700 cursor-pointer'><Link to="/login">Login</Link></span></p>
      </div>
    </div>
  );
};

export default Register;
