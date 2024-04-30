import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import axios from 'axios';

function AddEmergency() {
    const [formData, setFormData] = useState({
        name: '',
        contact_no: '',
        profile_image: null,
        cover_image: null
    });
    const [error, setError] = useState('');
    const [token, setToken] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        if (storedToken) {
          setToken(storedToken);
        } else {
          navigate('/sign-in');
          alert("Token is not valid. Please login first.");
        }
      }, [navigate]);

      const handleChange = (e) => {
        if (e.target.name === 'profile_image' || e.target.name === 'cover_image') {
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
            formDataToSend.append('contact_no', formData.contact_no);
            formDataToSend.append('profile_image', formData.profile_image);
            formDataToSend.append('cover_image', formData.cover_image);

            const response = await axios.post('http://ec2-16-170-165-104.eu-north-1.compute.amazonaws.com:5000/api/admin/contact', formDataToSend, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${token}`
                  }
            });

            if (response.status === 201) {
            setFormData({
                name: '',
                contact_no: '',
                profile_image: null,
                cover_image: null
            });
            window.alert('Emergency contact added successfully!');
        }
        console.log(response.data)
    } catch (error) {
        console.error('Error adding Contact:', error) ;
        setError('Error adding Contact. Please try again.');
        window.alert('Error adding Contact. Please try again.');
      }
    };

    return (
        <div>
            <div className='p-4 py-8 mb-7 bg-[--main-color] bg-clip-border rounded-xl'>
                <form onSubmit={handleSubmit} className="max-w-xl mx-auto">
                    <div className="mb-5">
                        <label htmlFor="text" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Emergency Contact Name</label>
                        <input
                            type="text"
                            id="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            placeholder="Emergency Contact Name..."
                            required
                        />
                    </div>
                    <div className="mb-5">
                        <label htmlFor="tel" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Emergency Contact Number</label>
                        <input
                            placeholder='Emergency Contact Number...'
                            type="tel"
                            id="tel"
                            name="contact_no"
                            value={formData.contact_no}
                            onChange={handleChange}
                            className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            required
                        />
                    </div>
                    <div className='mb-5'>
                        <label htmlFor="profile_image" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Emergency Profile Image</label>
                        <input
                            className="block w-full p-2 text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-white dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
                            aria-describedby="profile_image_help"
                            id="profile_image"
                            type="file"
                            name="profile_image"
                            onChange={handleChange}
                        />
                    </div>
                    <div className='mb-5'>
                        <label htmlFor="cover_image" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Emergency Cover Image</label>
                        <input
                            className="block w-full p-2 text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-white dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
                            aria-describedby="cover_image_help"
                            id="cover_image"
                            type="file"
                            name="cover_image"
                            onChange={handleChange}
                        />
                    </div>
                    <div className=''>
                        <button type="submit" className="text-white bg-[--second-color] font-medium rounded-lg text-sm w-full px-5 py-2.5 text-center">Submit</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default AddEmergency;
