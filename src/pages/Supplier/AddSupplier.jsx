import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function AddSupplier() {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [contactNumber, setContactNumber] = useState('');
    const [profileImage, setProfileImage] = useState(null);
    const [coverImage, setCoverImage] = useState(null);
    const [error, setError] = useState('');
    const [token, setToken] = useState('');
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        if (storedToken) {
          setToken(storedToken);
        } else {
          navigate('/sign-in');
          alert("Token is not valid. Please login first.");
        }
      }, [navigate]);

      const handleSubmit = async (e) => {
        e.preventDefault();
        try {
          setLoading(true);
          const formData = new FormData();
          formData.append('name', name);
          formData.append('description', description);
          formData.append('contact_no', contactNumber);
          formData.append('profile_image', profileImage);
          formData.append('cover_image', coverImage);
      
          const token = localStorage.getItem('token');
          if (!token) {
            throw new Error('No token found. Please login again.');
          }

          const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/admin/supplier`, formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
              Authorization: `Bearer ${token}`
            }
          });

          if (response.status === 201) {
            setName('');
            setDescription('');
            setContactNumber('');
            setProfileImage(null);
            setCoverImage(null);
            setError('');
            toast.success('Supplier added successfully.');
          }
          console.log(response.data);
    } catch (error) {
      console.error('Error adding supplier:', error);
      setLoading(false);
      if (error.response && error.response.status === 500) {
        window.alert('Token is expired, Please sign in again');
        navigate('/sign-in');
      } else {
        setError('Error adding supplier. Please try again.');    
        window.alert('Error adding supplier. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
        <div className='p-4 py-8 mb-7 bg-[--main-color] bg-clip-border rounded-xl'>
        <form className="max-w-xl mx-auto" onSubmit={handleSubmit}>
        <div class="mb-5">
            <label for="text" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Supplier Name</label>
            <input type="text" id="text" class="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Supplier Name..." value={name} onChange={(e) => setName(e.target.value)} required />
        </div>
        <div class="mb-5">
            <label for="text" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Description</label>
            <textarea placeholder='Supplier Des...' type="text" id="text" class="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" value={description} onChange={(e) => setDescription(e.target.value)} required />
        </div>
        <div class="mb-5">
            <label for="tel" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Contact Number</label>
            <input placeholder='Number...' type="tel" id="text" class="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" value={contactNumber} onChange={(e) => setContactNumber(e.target.value)} required />
        </div>
        <div className='mb-5'>
        <label class="block mb-2 text-sm font-medium text-gray-900 dark:text-white" for="user_avatar">Profile Image</label>
        <input class="block w-full p-2 text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-white dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400" aria-describedby="user_avatar_help" id="user_avatar" type="file"  onChange={(e) => setProfileImage(e.target.files[0])}/>
        </div>
        <div className='mb-5'>
        <label class="block mb-2 text-sm font-medium text-gray-900 dark:text-white" for="user_avatar">Cover Image</label>
        <input class="block w-full p-2 text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-white dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400" aria-describedby="user_avatar_help" id="user_avatar" type="file"  onChange={(e) => setCoverImage(e.target.files[0])}/>
        </div>
        
        <button type="submit" className="text-white bg-[--second-color] font-medium rounded-lg text-sm w-full px-5 py-2.5 text-center" disabled={loading}>{loading ? 'Submitting...' : 'Submit'}</button>
        {error && <div className="text-red-600">{error}</div>}
        </form>
    </div>
    </div>
  )
}

export default AddSupplier