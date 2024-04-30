import React, { useState, useEffect } from 'react';
import axios from 'axios';

function AddComponent() {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    profile_image: null,
    cover_image: null,
    icon: null
  });
  const [error, setError] = useState('');
  const [token, setToken] = useState('');

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      setToken(storedToken);
    }
  }, []);

  const handleChange = (e) => {
    if (e.target.name === 'profile_image' || e.target.name === 'cover_image' || e.target.name === 'icon') {
      setFormData({ ...formData, [e.target.name]: e.target.files[0] });
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('profile_image', formData.profile_image);
      formDataToSend.append('cover_image', formData.cover_image);
      formDataToSend.append('icon', formData.icon);
  
      const response = await axios.post('http://ec2-16-170-165-104.eu-north-1.compute.amazonaws.com:5000/api/admin/component', formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`
        }
      });
      if (response.status === 201) {
        // Clear form fields
        setFormData({
          name: '',
          description: '',
          profile_image: null,
          cover_image: null,
          icon: null
        });
     
        // Optionally, alert the user
        window.alert('Component added successfully.');
    }
      console.log(response.data);
  
    } catch (error) {
      console.error('Error adding component:', error);
      setError('Error adding component. Please try again.');
    }
  };
  

  return (
    <div>
      <div className='p-4 py-8 mb-7 bg-[--main-color] bg-clip-border rounded-xl'>
        <form className="max-w-xl mx-auto" onSubmit={handleSubmit}>
          <div className="mb-5">
            <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Component Name</label>
            <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Component Name..." required />
          </div>
          <div className="mb-5">
            <label htmlFor="description" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Component Description</label>
            <textarea value={formData.description} onChange={handleChange} placeholder='Component Description...' type="text" id="description" name="description" className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required />
          </div>
          <div className='mb-5'>
            <label htmlFor="profile_image" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Profile Image</label>
            <input onChange={handleChange} type="file" id="profile_image" name="profile_image" accept="image/*" className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500" required />
          </div>
          <div className='mb-5'>
            <label htmlFor="cover_image" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Cover Image</label>
            <input onChange={handleChange} type="file" id="cover_image" name="cover_image" accept="image/*" className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500" required />
          </div>
          <div className='mb-5'>
            <label htmlFor="icon" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Icon File</label>
            <input onChange={handleChange} type="file" id="icon" name="icon" accept="image/*" className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500" required />
          </div>
          <div className=''>
            <button type="submit" className="text-white bg-[--second-color] font-medium rounded-lg text-sm w-full px-5 py-2.5 text-center">Submit</button>
            {error && <div className="text-red-600">{error}</div>}
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddComponent;
