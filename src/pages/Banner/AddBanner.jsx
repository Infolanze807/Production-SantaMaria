import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function AddBanner() {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(null);
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
      const formDataToSend = new FormData();
      formDataToSend.append('name', name);
      formDataToSend.append('description', description);
      formDataToSend.append('image', image);

      const response = await axios.post('http://ec2-16-170-165-104.eu-north-1.compute.amazonaws.com:5000/api/admin/banner', formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`
        }
      });
      if (response.status === 201) {
        // Clear form fields
        setName('');
        setDescription('');
        setImage(null);
        toast.success('Banner added successfully.');
      }
      console.log(response.data);
    } catch (error) {
      console.error('Error adding banner:', error);
      setError('Error adding banner. Please try again.');
      window.alert('Error adding banner. Please try again.');
    } finally {
      setLoading(false); // Set loading to false after data submission
    }
  };

  return (
    <div>
      <div className='p-4 py-8 mb-7 bg-[--main-color] bg-clip-border rounded-xl'>
        <form className="max-w-xl mx-auto" onSubmit={handleSubmit}>
          <div className="mb-5">
            <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Name</label>
            <input type="text" id="name" className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-[--second-color] focus:border-[--second-color] block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-[--second-color] dark:focus:border-[--second-color]" placeholder="Name..." value={name} onChange={(e) => setName(e.target.value)} required />
          </div>
          <div className="mb-5">
            <label htmlFor="description" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Description</label>
            <textarea placeholder='Description...' id="description" className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-[--second-color] focus:border-[--second-color] block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-[--second-color] dark:focus:border-[--second-color]" value={description} onChange={(e) => setDescription(e.target.value)} required />
          </div>
          <div className='mb-5'>
            <label htmlFor="image" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Image</label>
            <input type="file" id="image" className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-[--second-color] focus:border-[--second-color] block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-400 dark:focus:ring-[--second-color] dark:focus:border-[--second-color]" onChange={(e) => setImage(e.target.files[0])} required />
          </div>
          <button type="submit" className="text-white bg-[--second-color] font-medium rounded-lg text-sm w-full px-5 py-2.5 text-center" disabled={loading}>{loading ? 'Submitting...' : 'Submit'}</button>
          {/* Display error message if there's an error */}
          {error && <div className="text-red-600">{error}</div>}
        </form>
      </div>
    </div>
  );
}

export default AddBanner;
