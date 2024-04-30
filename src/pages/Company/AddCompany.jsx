import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function AddCompany() {
  const [companyName, setCompanyName] = useState('');
  const [companyBio, setCompanyBio] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [instagramURL, setInstagramURL] = useState('');
  const [locationLink, setLocationLink] = useState('');
  const [companyImage, setCompanyImage] = useState(null);
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
      formData.append('name', companyName);
      formData.append('bio', companyBio);
      formData.append('contact_no', contactNumber);
      formData.append('instagram_url', instagramURL);
      formData.append('location', locationLink);
      formData.append('profile_image', companyImage);
      formData.append('cover_image', coverImage);

      const response = await axios.post('http://ec2-16-170-165-104.eu-north-1.compute.amazonaws.com:5000/api/admin/company', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`
        }
      });
      if (response.status === 201) {
        // Clear form fields
        setCompanyName('');
        setCompanyBio('');
        setContactNumber('');
        setInstagramURL('');
        setLocationLink('');
        setCompanyImage(null);
        setCoverImage(null);
        setError('');
     
        // Optionally, alert the user
        // window.alert('Company added successfully.');
        toast.success('Company added successfully.');
    }
      console.log(response.data);
    } catch (error) {
      console.error('Error adding company:', error);
      setError('Error adding company. Please try again.');    
      window.alert('Error adding company. Please try again.');
    } finally {
      setLoading(false); // Set loading to false after data submission
    }
  };

  return (
    <div>
      <div className='p-4 py-8 mb-7 bg-[--main-color] bg-clip-border rounded-xl'>
        <form className="max-w-xl mx-auto" onSubmit={handleSubmit}>
          <div className="mb-5">
            <label htmlFor="companyName" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Company Name</label>
            <input type="text" id="companyName" className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-[--second-color] focus:border-[--second-color] block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-[--second-color] dark:focus:border-[--second-color]" placeholder="Company Name..." value={companyName} onChange={(e) => setCompanyName(e.target.value)} required />
          </div>
          <div className="mb-5">
            <label htmlFor="companyBio" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Company Bio</label>
            <textarea placeholder='Company Bio...' id="companyBio" className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-[--second-color] focus:border-[--second-color] block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-[--second-color] dark:focus:border-[--second-color]" value={companyBio} onChange={(e) => setCompanyBio(e.target.value)} required />
          </div>
          <div className="mb-5">
            <label htmlFor="contactNumber" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Contact Number</label>
            <input placeholder='Number...' type="tel" id="contactNumber" className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-[--second-color] focus:border-[--second-color] block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-[--second-color] dark:focus:border-[--second-color]" value={contactNumber} onChange={(e) => setContactNumber(e.target.value)} required />
          </div>
          <div className="mb-5">
            <label htmlFor="instagramURL" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Instagram URL</label>
            <input type="text" id="instagramURL" className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-[--second-color] focus:border-[--second-color] block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-[--second-color] dark:focus:border-[--second-color]" placeholder="Instagram URL..." value={instagramURL} onChange={(e) => setInstagramURL(e.target.value)} required />
          </div>
          <div className="mb-5">
            <label htmlFor="locationLink" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Location Link</label>
            <input type="text" id="locationLink" className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-[--second-color] focus:border-[--second-color] block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-[--second-color] dark:focus:border-[--second-color]" placeholder="Location Link..." value={locationLink} onChange={(e) => setLocationLink(e.target.value)} required />
          </div>
          <div className='mb-5'>
            <label htmlFor="companyImage" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Profile Image</label>
            <input type="file" id="companyImage" className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-[--second-color] focus:border-[--second-color] block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-400 dark:focus:ring-[--second-color] dark:focus:border-[--second-color]" onChange={(e) => setCompanyImage(e.target.files[0])} required />
          </div>
          <div className='mb-5'>
            <label htmlFor="coverImage" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Cover Image</label>
            <input type="file" id="coverImage" className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-[--second-color] focus:border-[--second-color] block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-400 dark:focus:ring-[--second-color] dark:focus:border-[--second-color]" onChange={(e) => setCoverImage(e.target.files[0])} required />
          </div>
          <button type="submit" className="text-white bg-[--second-color] font-medium rounded-lg text-sm w-full px-5 py-2.5 text-center" disabled={loading}>{loading ? 'Submitting...' : 'Submit'}</button>
          {/* Display error message if there's an error */}
          {error && <div className="text-red-600">{error}</div>}
        </form>
      </div>
    </div>
  );
}

export default AddCompany;
