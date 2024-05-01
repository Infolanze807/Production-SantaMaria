import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function AddEvent() {
  const [eventTitle, setEventTitle] = useState('');
  const [eventType, setEventType] = useState('');
  const [eventContent, setEventContent] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [eventImage, setEventImage] = useState(null);
  const [isFeatured, setIsFeatured] = useState(false);
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
      formData.append('title', eventTitle);
      formData.append('type', eventType);
      formData.append('content', eventContent);
      formData.append('published_date', eventDate);
      formData.append('image', eventImage);
      formData.append('isFeatured', isFeatured);
  
      console.log(eventType)
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/admin/newsandevent`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`
        }
      });
      if (response.status === 201) {
        setEventTitle('');
        setEventType('');
        setEventContent('');
        setEventDate('');
        setEventImage(null);
        setIsFeatured(false);
        setError('');
        toast.success('News or Event added successfully.');
      }
      console.log(response.data);
    } catch (error) {
      console.error('Error adding event:', error);
      setError('Error adding event. Please try again.');
      setLoading(false);
      if (error.response && error.response.status === 500) {
        window.alert('Token is expired, Please sign in again');
        navigate('/sign-in');
      } else {
        window.alert('Error adding event. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='p-4 py-8 mb-7 bg-[--main-color] bg-clip-border rounded-xl'>
      <form className="max-w-xl mx-auto" onSubmit={handleSubmit}>
        <div className="mb-5">
          <label htmlFor="eventTitle" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">News & Event Title</label>
          <input type="text" id="eventTitle" className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="News & Event Title..." value={eventTitle} onChange={(e) => setEventTitle(e.target.value)} required />
        </div>
        <div className="mb-5">
          <label htmlFor="eventType" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">News & Event Type</label>
          <select id="eventType" className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" value={eventType} onChange={(e) => setEventType(e.target.value)} required>
            <option value="Event">Event</option>
            <option value="News">News</option>
          </select>
        </div>
        <div className="mb-5">
          <label htmlFor="eventContent" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">News & Event Description</label>
          <textarea placeholder='News & Event Description...' id="eventContent" className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" value={eventContent} onChange={(e) => setEventContent(e.target.value)} required />
        </div>
        <div className="mb-5">
          <label htmlFor="eventDate" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">News & Event Date</label>
          <input placeholder='News & Event Date...' type="date" id="eventDate" className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" value={eventDate} onChange={(e) => setEventDate(e.target.value)} required />
        </div>
        <div className='mb-5'>
          <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white" htmlFor="eventImage">Upload Image</label>
          <input className="block w-full p-2 text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-white dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400" aria-describedby="eventImage_help" id="eventImage" type="file" onChange={(e) => setEventImage(e.target.files[0])} required />
        </div>
        <div className="flex items-center mb-5">
          <input id="isFeatured" type="checkbox" checked={isFeatured} onChange={(e) => setIsFeatured(e.target.checked)} className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
          <label htmlFor="isFeatured" className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">Show on top</label>
        </div>
        <div className=''>
          <button type="submit" className="text-white bg-[--second-color] font-medium rounded-lg text-sm w-full px-5 py-2.5 text-center" disabled={loading}>{loading ? 'Submitting...' : 'Submit'}</button>
        </div>
        {/* Display error message if there's an error */}
        {error && <div className="text-red-600">{error}</div>}
      </form>
    </div>
  );
}

export default AddEvent;
