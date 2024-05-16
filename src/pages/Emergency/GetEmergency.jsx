import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Loader from '../Loader';
import { useNavigate } from 'react-router-dom';

function GetEmergency() {
    const [apiResponse, setApiResponse] = useState(null);
    const [emergencyData, setEmergencyData] = useState([]);
    const [selectedEmergency, setSelectedEmergency] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        contact_no: '',
        profile_image: null,
        cover_image: null
    });
    const [error, setError] = useState('');
    const [deleteLoadingId, setDeleteLoadingId] = useState(null);
    const [loadingUpdate, setLoadingUpdate] = useState(false);
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1); 
    const navigate = useNavigate();
    const limitPerPage = 4;

    // const URL = `${process.env.REACT_APP_API_URL}/api/admin/contact?limit=5&page=1`
    const URL = `${process.env.REACT_APP_API_URL}/api/admin/contact?limit=${limitPerPage}&page=${currentPage}`;

    const fetchEmergencyData = async (URL) => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        // Check if token exists
        if (token) {
          const response = await axios.get(URL, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
          console.log(response.data.data, "apidetails");
          setApiResponse(response.data.data);
          setEmergencyData(response.data.data.data);
          setTotalPages(Math.ceil(response.data.data.total / limitPerPage));
        } else {
          navigate('/sign-in');
          window.alert('Token is not valid. Please sign in first.');
        }
      } catch (error) {
        console.error('Error fetching emergency data:', error);
        setLoading(false);
        if (error.response && error.response.status === 500) {
          window.alert('Token is expired, Please sign in again');
          // navigate('/sign-in');
        } else {
          window.alert('Error fetching emergency data. Please try again.');
          setError('Error fetching emergency data. Please try again.');
        }
      } finally {
        setLoading(false);
      }
    };
    

    const handleNext = () => {
      if (apiResponse && apiResponse.next) {
          setCurrentPage(prevPage => prevPage + 1);
      }
    };
    
    const handlePrevious = () => {
      if (apiResponse && apiResponse.previous) {
          setCurrentPage(prevPage => prevPage - 1);
      }
    };
    
    const handlePageClick = (pageNumber) => {
      setCurrentPage(pageNumber);
    };

    useEffect(() => {
        fetchEmergencyData(URL);
    }, [currentPage]);

    const handleViewClick = (emergency) => {
        setSelectedEmergency(emergency);
        setFormData({
            name: emergency.name,
            contact_no: emergency.contact_no,
            // profile_image: emergency.profile_image,
            // cover_image: emergency.cover_image
        });
    };

    const handleCloseClick = () => {
        setSelectedEmergency(null);
    };

    const handleDeleteClick = async (emergencyId) => {
        if (window.confirm("Are you sure you want to delete?")) {
          try {
            setDeleteLoadingId(emergencyId);
            const token = localStorage.getItem('token');
            if (!token) {
              throw new Error('No token found. Please login again.');
            }
      
            const base64EncodedIdObject = btoa(JSON.stringify({
              "iv": emergencyId.iv,
              "encryptedData": emergencyId.encryptedData
            }));
      
            const response = await axios.delete(`${process.env.REACT_APP_API_URL}/api/admin/contact/${base64EncodedIdObject}`, {
              headers: {
                Authorization: `Bearer ${token}`
              }
            });
      
            if (response.status === 200) {
              fetchEmergencyData(URL);
              toast.success('Contact deleted successfully.');
            }
      
          } catch (error) {
            console.error('Error deleting Contact:', error);
            console.error('Error response from server:', error.response?.data);
            setDeleteLoadingId(null);
            if (error.response && error.response.status === 500) {
              window.alert('Token is expired, Please sign in again');
              // navigate('/sign-in');
            } else {
              window.alert('Error deleting Contact. Please try again.');
            }
          } finally {
            setDeleteLoadingId(null);
          }
        } else {
          console.log("Deletion cancelled");
        }
      };

const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'profile_image' || name === 'cover_image') {
        setFormData(prevData => ({
            ...prevData,
            [name]: e.target.files[0]
        }));
    } else {
        setFormData(prevData => ({
            ...prevData,
            [name]: value
        }));
    }
};

const handleSubmit = async (e) => {
    e.preventDefault();
    const contactNumberPattern = /^[0-9]+$/;
    
    if (!contactNumberPattern.test(formData.contact_no)) {
        toast.error('Contact number should contain only digits.');
        return;
    }
    try {
      setLoadingUpdate(true);
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No token found. Please login again.');
      }
  
      const base64EncodedIdObject = btoa(JSON.stringify({
        "iv": selectedEmergency.id.iv,
        "encryptedData": selectedEmergency.id.encryptedData
      }));
      const response = await axios.put(`${process.env.REACT_APP_API_URL}/api/admin/contact/${base64EncodedIdObject}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`
        }
      });
      if (response.status === 200) {
        toast.success('Emergency Contact Updated Successfully');
        fetchEmergencyData(URL);
        handleCloseClick();
      }
      setSelectedEmergency(null);
    } catch (error) {
      console.error('Error updating Contact:', error);
      console.error('Error response from server:', error.response?.data);
      setLoadingUpdate(false);
      if (error.response && error.response.status === 500) {
        window.alert('Token is expired, Please sign in again');
        // navigate('/sign-in');
      } else {
        window.alert("Error updating Contact");
      }
    } finally {
      setLoadingUpdate(false);
    }
  };

  function getFilenameFromUrl(url) {
    const parts = url.split('/');
    const filename = parts.pop();
    return filename;
  }

    

    return (
        <div className='pb-7'>
        {loading ? <Loader /> : 
            <div className="grid grid-cols-1 gap-10 md:grid-cols-2 xl:grid-cols-4">
                {emergencyData.map(emergency => (
                <div key={emergency.id.emergencyData} className="relative flex flex-col border border-blue-gray-50 shadow-md p-3 bg-clip-border rounded-xl bg-[--main-color] text-gray-700">
                <div className='relative'>
                    <div className='pt-11'>
                        <img className='-z-10 w-full object-cover rounded-lg' src={emergency.cover_image} alt="" />
                    </div>
                    <div className='absolute border-2 border-white rounded-full left-1/2 transform -translate-x-1/2 top-0'>
                        <img className='w-20 h-20 rounded-full object-cover' src={emergency.profile_image} alt="" />
                    </div>
                </div>
                    <div className="p-6 py-0 px-1 pt-5">
                    <p className="block antialiased font-sans text-sm text-gray-900 font-semibold">Name: &nbsp;<span className='font-normal'>{emergency.name}</span></p>
                    <div className='text-sm pt-1 text-gray-900 font-semibold'>Number: &nbsp;<span className='font-normal'>{emergency.contact_no}</span></div>
                    </div>
                    <div className="p-6 mt-6 flex items-center justify-between py-0 px-1">
                    <button className="bg-green-500 px-5 p-2 text-sm rounded-full text-white lg:me-5 lg:mb-0 mb-3" onClick={() => handleViewClick(emergency)}>View</button>
                    <button className="bg-red-500 px-5 p-2 text-sm rounded-full text-white" onClick={() => handleDeleteClick(emergency.id)} disabled={deleteLoadingId === emergency.id}>{deleteLoadingId === emergency.id ? 'Deleting...' : 'Delete'}</button>
                    </div>
                </div>
                ))}
            </div>
            }
            {apiResponse ? <div className='text-center pt-7'>
                <button onClick={handlePrevious} disabled={!apiResponse || !apiResponse.previous || currentPage === 1} className={`bg-[#2d2d2d] rounded-md px-5 p-2 text-sm text-white mx-2 w-24 ${!apiResponse || !apiResponse.previous || currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''}`}>Previous</button>
                {Array.from({ length: Math.min(totalPages, 3) }, (_, index) => currentPage - 1 + index).map(pageNumber => (
                    pageNumber > 0 && pageNumber <= totalPages && (
                        <button key={pageNumber} onClick={() => handlePageClick(pageNumber)} className={`bg-[#2d2d2d] rounded-md p-2 text-sm text-white mx-1 w-8 focus:outline-none ${pageNumber === currentPage ? 'bg-blue-500' : ''}`}>{pageNumber}</button>
                    )
                ))}
                <button onClick={handleNext} disabled={!apiResponse || !apiResponse.next || currentPage === totalPages} className={`bg-[#2d2d2d] rounded-md px-5 p-2 text-sm text-white mx-2 w-24 ${!apiResponse || !apiResponse.next || currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : ''}`}>Next</button>
            </div> : "" }
            {selectedEmergency && (
                <div className="fixed p-3 inset-0 flex justify-center items-start bg-black bg-opacity-50 z-50 overflow-y-auto">
                    <div className="bg-white w-[600px] max-w-2xl p-6 rounded-lg">
                        <h2 className="text-2xl font-bold mb-4">Update Emergency</h2>
                        <form className="max-w-xl mx-auto" onSubmit={handleSubmit}>
                            <div className="mb-4">
                                <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Name</label>
                                <input value={formData.name} onChange={handleChange} type="text" id="name" name="name" className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Name..." required />
                            </div>
                            <div className="mb-4">
                                <label htmlFor="contact_no" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Contact No</label>
                                <input value={formData.contact_no} onChange={handleChange} type="text" id="contact_no" name="contact_no" className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Contact No..." required />
                            </div>
                            <div className="mb-4">
                                <label htmlFor="profile_image" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Profile Image: {formData.profile_image ? "" : getFilenameFromUrl(selectedEmergency.profile_image)}</label>
                                <input onChange={handleChange} type="file" id="profile_image" name="profile_image" accept="image/*" className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />
                            </div>
                            <div className="mb-4">
                                <label htmlFor="cover_image" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Cover Image: {formData.cover_image ? "" : getFilenameFromUrl(selectedEmergency.cover_image)}</label>
                                <input onChange={handleChange} type="file" id="cover_image" name="cover_image" accept="image/*" className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />
                            </div>
                            <div className='flex items-center justify-end space-x-4'>
                            <button onClick={handleCloseClick} className="bg-gray-200 text-gray-700 px-6 py-2 rounded-md hover:bg-gray-300 transition duration-200">Cancel</button>
                            <button typce="submit" className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 transition duration-200" disabled={loadingUpdate}>{loadingUpdate ? 'Updating...' : 'Update'}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default GetEmergency;
