import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import axios from 'axios';

function AddNews() {
  const [newsTitle, setnewsTitle] = useState('');
  const [newsType, setnewsType] = useState('News');
  const [newsContent, setnewsContent] = useState('');
  const [newsDate, setnewsDate] = useState('');
  const [newsImage, setnewsImage] = useState(null);
  const [isFeatured, setIsFeatured] = useState(false);
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('title', newsTitle);
      formData.append('type', newsType);
      formData.append('content', newsContent);
      formData.append('published_date', newsDate);
      formData.append('image', newsImage);
      formData.append('isFeatured', isFeatured);

        console.log(newsType)
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/admin/newsandevent`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`
        }
      });
      if (response.status === 201) {
        // Clear form fields
        setnewsTitle('');
        setnewsType('news');
        setnewsContent('');
        setnewsDate('');
        setnewsImage(null);
        setIsFeatured(false);
        setError('');
        // Optionally, alert the user
        window.alert('news added successfully.');
      }
      console.log(response.data);
    } catch (error) {
      console.error('Error adding news:', error);
      setError('Error adding news. Please try again.');
      window.alert('Error adding news. Please try again.');
    }
  };

  return (
    <div className='p-4 py-8 mb-7 bg-[--main-color] bg-clip-border rounded-xl'>
      <form className="max-w-xl mx-auto" onSubmit={handleSubmit}>
        <div className="mb-5">
          <label htmlFor="newsTitle" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">News Title</label>
          <input type="text" id="newsTitle" className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="news Title..." value={newsTitle} onChange={(e) => setnewsTitle(e.target.value)} required />
        </div>
        <div className="mb-5">
          <label htmlFor="newsType" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">News Type</label>
          <select disabled id="newsType" className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" value={newsType} onChange={(e) => setnewsType(e.target.value)} required>
            <option value="News">News</option>
            {/* <option value="News">News</option> */}
          </select>
        </div>
        <div className="mb-5">
          <label htmlFor="newsContent" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">News Description</label>
          <textarea placeholder='news Description...' id="newsContent" className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" value={newsContent} onChange={(e) => setnewsContent(e.target.value)} required />
        </div>
        <div className="mb-5">
          <label htmlFor="newsDate" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">News Date</label>
          <input placeholder='news Date...' type="date" id="newsDate" className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" value={newsDate} onChange={(e) => setnewsDate(e.target.value)} required />
        </div>
        <div className='mb-5'>
          <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white" htmlFor="newsImage">Upload Image</label>
          <input className="block w-full p-2 text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-white dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400" aria-describedby="newsImage_help" id="newsImage" type="file" onChange={(e) => setnewsImage(e.target.files[0])} required />
        </div>
        <div className="flex items-center mb-5">
          <input id="isFeatured" type="checkbox" checked={isFeatured} onChange={(e) => setIsFeatured(e.target.checked)} className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
          <label htmlFor="isFeatured" className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">Show on top</label>
        </div>
        <div className=''>
          <button type="submit" className="text-white bg-[--second-color] font-medium rounded-lg text-sm w-full px-5 py-2.5 text-center">Submit</button>
        </div>
        {/* Display error message if there's an error */}
        {error && <div className="text-red-600">{error}</div>}
      </form>
    </div>
  );
}

export default AddNews;
