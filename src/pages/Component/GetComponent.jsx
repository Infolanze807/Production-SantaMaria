import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Loader from '../Loader';
import { useNavigate } from 'react-router-dom';

function GetComponent() {
  const [apiResponse, setApiResponse] = useState(null);
  const [componentData, setComponentData] = useState([]);
  const [selectedComponent, setSelectedComponent] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    profile_image: null,
    cover_image: null,
    icon: null
  });
  const [error, setError] = useState('');
  const [deleteLoadingId, setDeleteLoadingId] = useState(null);
  const [loadingUpdate, setLoadingUpdate] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  // const [token, setToken] = useState('');

  const URL = `${process.env.REACT_APP_API_URL}/api/admin/component?limit=5&page=1`


  const fetchComponentData = async (URL) => {
  
    try {
      setLoading(true);
      const storedToken = localStorage.getItem('token');
      if (!storedToken) {
        throw new Error('No token found. Please login again.');
      }
  
      const response = await axios.get(URL, {
        headers: {
          Authorization: `Bearer ${storedToken}`
        }
      });
      console.log(response.data.data,"apidetails")
      setApiResponse(response.data.data);
      setComponentData(response.data.data.data);
      // setToken(storedToken);
    } catch (error) {
      console.error('Error fetching component data:', error);
      setLoading(false);
      if (error.response && error.response.status === 500) {
        window.alert('Token is expired, Please sign in again');
        navigate('/sign-in');
      } else {
        window.alert('Error fetching component data. Please try again.');
        setError('Error fetching component data. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const replaceLocalhost = (url) => {
    return url.replace(`${process.env.REACT_APP_LOCAL_HOST}`, `${process.env.REACT_APP_API_URL}`);
};

const handleNext = async() => {
  if (apiResponse && apiResponse.next) {
   const nexturl = await replaceLocalhost(apiResponse.next)
   console.log(nexturl,"next")
   fetchComponentData(nexturl);
 }
};
console.log(apiResponse,"checks")
const handlePrevious = async() => {
if (apiResponse && apiResponse.previous) {
  const previousurl = await replaceLocalhost(apiResponse.previous);
  console.log(previousurl, "previous");
  fetchComponentData(previousurl);
}
};

  useEffect(() => {
    fetchComponentData(URL);
  }, []);

  const handleViewClick = (component) => {
    setSelectedComponent(component);
    setFormData({
      name: component.name,
      description: component.description,
      profile_image: component.profile_image,
      cover_image: component.cover_image,
      icon: component.icon
    });
  };

  const handleCloseClick = () => {
    setSelectedComponent(null);
  };


  const handleDeleteClick = async (componentId) => {
    if (window.confirm("Are you sure you want to delete?")) {
      try {
        setDeleteLoadingId(componentId);
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No token found. Please login again.');
        }
  
        const base64EncodedIdObject = btoa(JSON.stringify({
          "iv": componentId.iv,
          "encryptedData": componentId.encryptedData
        }));
  
        const response = await axios.delete(`${process.env.REACT_APP_API_URL}/api/admin/component/${base64EncodedIdObject}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
  
        if (response.status === 200) {
          fetchComponentData(URL);
          toast.success('Component deleted successfully.');
        }
      } catch (error) {
        console.error('Error deleting Component:', error);
        console.error('Error response from server:', error.response?.data);
        setDeleteLoadingId(null);
        if (error.response && error.response.status === 500) {
          window.alert('Token is expired, Please sign in again');
          navigate('/sign-in');
        } else {
          window.alert('Error deleting Component. Please try again.');
        }
      } finally {
        setDeleteLoadingId(null);
      }
    } else {
      console.log("Deletion cancelled");
    }
  };
  

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
      setLoadingUpdate(true);
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No token found. Please login again.');
      }
  
      const base64EncodedIdObject = btoa(JSON.stringify({
        "iv": selectedComponent.id.iv,
        "encryptedData": selectedComponent.id.encryptedData
      }));
  
      const response = await axios.put(`${process.env.REACT_APP_API_URL}/api/admin/component/${base64EncodedIdObject}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`
        }
      });
  
      if (response.status === 200) {
        toast.success('Component Updated Successfully');
        fetchComponentData(URL);
        handleCloseClick();
      }
      setSelectedComponent(null);
  
    } catch (error) {
      console.error('Error updating component:', error);
      console.error('Error response from server:', error.response?.data);
      setLoadingUpdate(false);
      if (error.response && error.response.status === 500) {
        window.alert('Token is expired, Please sign in again');
        navigate('/sign-in');
      } else {
        window.alert("Error updating component");
      }
    } finally {
      setLoadingUpdate(false);
    }
  };

  return (
    <div className='pb-7'>
    {loading && <Loader />}
      <div className="grid grid-cols-1 gap-10 md:grid-cols-2 xl:grid-cols-4">
        {componentData.map(component => (
          <div key={component.id.encryptedData} className="relative flex flex-col border border-blue-gray-50 shadow-md p-3 bg-clip-border rounded-xl bg-[--main-color] text-gray-700">
          <div className='relative'>
            <div className='pt-11'>
                <img className='-z-10 w-full object-cover rounded-lg' src={replaceLocalhost(component.cover_image)} alt="cover" />
            </div>
            <div className='absolute border-2 border-white rounded-full left-1/2 transform -translate-x-1/2 top-0'>
                <img className='w-20 h-20 rounded-full object-cover' src={replaceLocalhost(component.profile_image)} alt="profile" />
            </div>
          </div>
            <div className="p-6 py-0 px-1 pt-5">
              <p className="block antialiased font-sans text-sm text-gray-900 font-semibold">Name: &nbsp;<span className='font-normal'>{component.name}</span></p>
              <div className='text-sm pt-1 text-gray-900 font-semibold'>Description: &nbsp;<span className='font-normal'>{component.description}</span></div>
          <div className='flex items-center text-sm text-gray-900 font-semibold pt-1'>Icon: &nbsp;<img className='object-cover rounded-full w-8 h-8' src={replaceLocalhost(component.icon)} alt="icon" /></div>
            </div>
            <div className="p-6 mt-6 flex items-center justify-between py-0 px-1">
              <button className="bg-green-500 px-5 p-2 text-sm rounded-full text-white lg:me-5 lg:mb-0 mb-3" onClick={() => handleViewClick(component)}>View</button>
              <button className="bg-red-500 px-5 p-2 text-sm rounded-full text-white" disabled={deleteLoadingId === component.id} onClick={() => handleDeleteClick(component.id)}>{deleteLoadingId === component.id ? 'Deleting...' : 'Delete'}</button>
            </div>
          </div>
        ))}
      </div>
      <div className='text-center pb-4'>
                <button onClick={handlePrevious} disabled={!apiResponse || !apiResponse.previous} className={`bg-[#2d2d2d] px-5 p-2 text-sm rounded-full text-white mx-2 w-24 ${!apiResponse || !apiResponse.previous ? 'opacity-50 cursor-not-allowed' : ''}`}>Previous</button>
                <button onClick={handleNext} disabled={!apiResponse || !apiResponse.next} className={`bg-[#2d2d2d] px-5 p-2 text-sm rounded-full text-white mx-2 w-24 ${!apiResponse || !apiResponse.next ? 'opacity-50 cursor-not-allowed' : ''}`}>Next</button>
            </div>
      {selectedComponent && (
        <div className="fixed p-3 inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50 overflow-y-auto">
          <div className="bg-white w-[600px] max-w-2xl p-6 rounded-lg">
            <h2 className="text-2xl font-bold mb-4">Update Component</h2>
            <form className="max-w-xl mx-auto" onSubmit={handleSubmit}>
              <div className="mb-4">
                <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Component Name</label>
                <input value={formData.name} onChange={handleChange} type="text" id="name" name="name" className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Component Name..." required />
              </div>
              <div className="mb-4">
                <label htmlFor="description" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Description</label>
                <textarea value={formData.description} onChange={handleChange} placeholder='Description...' type="text" id="description" name="description" className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required />
              </div>
              <div className="mb-4">
                <label htmlFor="profile_image" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Profile Image</label>
                <input onChange={handleChange} type="file" id="profile_image" name="profile_image" accept="image/*" className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500" />
              </div>
              <div className="mb-4">
                <label htmlFor="cover_image" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Cover Image</label>
                <input onChange={handleChange} type="file" id="cover_image" name="cover_image" accept="image/*" className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500" />
              </div>
              <div className="mb-4">
                <label htmlFor="icon" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Icon File</label>
                <input onChange={handleChange} type="file" id="icon" name="icon" accept="image/*" className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500" />
              </div>
              <div className="flex items-center justify-end space-x-4">
                <button type="button" onClick={handleCloseClick} className="border border-gray-300 text-gray-900 dark:text-white rounded-lg px-6 py-2">Cancel</button>
                <button type="submit" className="bg-blue-500 text-white rounded-lg px-6 py-2" disabled={loadingUpdate}>{loadingUpdate ? 'Updating...' : 'Update'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
      {error && <div className="text-red-600">{error}</div>}
    </div>
  );  
}

export default GetComponent;
