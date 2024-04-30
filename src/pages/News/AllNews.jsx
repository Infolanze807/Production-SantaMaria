import React, { useState, useEffect } from 'react';
import axios from 'axios';

function AllNews() {
  const [newsData, setnewsData] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    type: '',
    content: '',
    published_date: '',
    image: null,
  });
  const [error, setError] = useState('');

  const fetchnewsData = async () => {
    try {
      const storedToken = localStorage.getItem('token');
      if (!storedToken) {
        throw new Error('No token found. Please login again.');
      }

      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/admin/newsandevent`, {
        headers: {
          Authorization: `Bearer ${storedToken}`
        }
      });
      const news = response.data.data.data.filter(item => item.type === 'News');
      setnewsData(news);
    } catch (error) {
      console.error('Error fetching event data:', error);
      setError('Error fetching event data. Please try again.');
    }
  };

  useEffect(() => {
    fetchnewsData();
  }, []);

  const handleViewClick = (event) => {
    setSelectedEvent(event);
    setFormData({
      title: event.title,
      type: event.type,
      content: event.content,
      published_date: event.published_date,
      image: null, // Assuming you don't want to change the image on update
    });
  };

  const handleCloseClick = () => {
    setSelectedEvent(null);
  };

  const handleDeleteClick = async (eventId) => {
    if (window.confirm("Are you sure you want to delete?")) {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No token found. Please login again.');
        }

        const base64EncodedIdObject = btoa(JSON.stringify({
          "iv": eventId.iv,
          "encryptedData": eventId.encryptedData
        }));

        const response = await axios.delete(`${process.env.REACT_APP_API_URL}/api/admin/newsandevent/${base64EncodedIdObject}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        if (response.status === 200) {
          fetchnewsData();
          window.alert("Event deleted successfully.");
        }
      } catch (error) {
        console.error('Error deleting company:', error);
        console.error('Error response from server:', error.response?.data); // Log the response data directly
    }
      console.log("Item deleted");  // This would be replaced with actual deletion logic
    } else {
      // If the user clicks "No", simply close the dialog
      console.log("Deletion cancelled");  // This line is optional, for debugging
    }
  };

  const handleChange = (e) => {
    if (e.target.name === 'image') {
      setFormData({ ...formData, [e.target.name]: e.target.files[0] });
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No token found. Please login again.');
      }

      const base64EncodedIdObject = btoa(JSON.stringify({
        "iv": selectedEvent.id.iv,
        "encryptedData": selectedEvent.id.encryptedData
    }));

    const response = await axios.put(`${process.env.REACT_APP_API_URL}/api/admin/newsandevent/${base64EncodedIdObject}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
     Authorization: `Bearer ${token}`
 }
    });

        if (response.status === 200) {
          window.alert("Event updated successfully.");
          fetchnewsData();
          handleCloseClick();
        }setSelectedEvent(null)

    } catch (error) {
      console.error('Error updating component:', error);
      console.error('Error response from server:', error.response?.data);
    }
  };

  return (
    <div>
      {newsData.map(event => (
        <div key={event.id.encryptedData} className="grid lg:grid-cols-6 grid-cols-1 items-center border rounded-lg p-5 bg-[--main-color] mb-5">
          <div className='col-span-2'>
            {event.image && <img className='w-52 h-52 object-cover rounded-lg' src={event.image} alt="" />}
          </div>
          <div className='col-span-3 text-gray-900 font-semibold text-sm leading-relaxed pt-5 lg:pt-0'>
            <div>Title: &nbsp;<span className='font-normal'>{event.title}</span></div>
            <div>Type: &nbsp;<span className='font-normal'>{event.type}</span></div>
            <div>Content: &nbsp;<span className='font-normal'>{event.content}</span></div>
            <div>Published Date: &nbsp;<span className='font-normal'>{event.published_date}</span></div>
          </div>
          <div className='lg:flex lg:flex-col mx-auto gap-2 pt-4 lg:pt-0'>
            <button className="bg-green-500 px-8 w-max p-2 text-sm rounded-full text-white lg:me-5 lg:mb-0 mb-3" onClick={() => handleViewClick(event)}>View</button>
            <button className="bg-red-500 px-7 p-2 w-max text-sm rounded-full text-white" onClick={() => handleDeleteClick(event.id)}>Delete</button>
          </div>
        </div>
      ))}
      {selectedEvent && (
        <div className="fixed p-3 inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50 overflow-y-auto">
          <div className="bg-white w-[600px] max-w-2xl p-6 rounded-lg">
            <h2 className="text-2xl font-bold mb-4">Update Event</h2>
            <form className="max-w-xl mx-auto" onSubmit={handleSubmit}>
              <div className="mb-4">
                <label htmlFor="title" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Event Title</label>
                <input value={formData.title} onChange={handleChange} type="text" id="title" name="title" className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Event Title..." required />
              </div>
              <div className="mb-4">
                <label htmlFor="type" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Event Type</label>
                <input value={formData.type} onChange={handleChange} type="text" id="type" name="type" className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Event Type..." required />
              </div>
              <div className="mb-4">
                <label htmlFor="content" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Event Content</label>
                <textarea value={formData.content} onChange={handleChange} placeholder='Event Content...' type="text" id="content" name="content" className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required />
              </div>
              <div className="mb-4">
                <label htmlFor="published_date" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Published Date</label>
                <input value={formData.published_date} onChange={handleChange} type="date" id="published_date" name="published_date" className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required />
              </div>
              <div className="mb-4">
                <label htmlFor="image" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Event Image</label>
                <input onChange={handleChange} type="file" id="image" name="image" accept="image/*" className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500" />
              </div>
              <div className="flex items-center justify-end space-x-4">
                <button type="button" onClick={handleCloseClick} className="border border-gray-300 text-gray-900 dark:text-white rounded-lg px-6 py-2">Cancel</button>
                <button type="submit" className="bg-blue-500 text-white rounded-lg px-6 py-2">Update</button>
              </div>
            </form>
          </div>
        </div>
      )}
      {error && <div className="text-red-600">{error}</div>}
    </div>
  );
}

export default AllNews;
