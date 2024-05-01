import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Loader from '../Loader';
import { useNavigate } from 'react-router-dom';

function GetBanner() {
    const [apiResponse, setApiResponse] = useState(null);
    const [bannerData, setBannerData] = useState([]);
    const [selectedBanner, setSelectedBanner] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        image: null
    });
    const [error, setError] = useState('');
    const [deleteLoadingId, setDeleteLoadingId] = useState(null);
    const [loadingUpdate, setLoadingUpdate] = useState(false);
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1); 
    const navigate = useNavigate();

    const limitPerPage = 5;


    // const URL = `${process.env.REACT_APP_API_URL}/api/admin/banner?limit=5&page=1`

    const URL = `${process.env.REACT_APP_API_URL}/api/admin/banner?limit=${limitPerPage}&page=${currentPage}`;

    const fetchBannerData = async (URL) => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            if (token) {
                const response = await axios.get(URL, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setApiResponse(response.data.data);
                setBannerData(response.data.data.data);
                setTotalPages(Math.ceil(response.data.data.total / limitPerPage)); // Calculate total pages
            } else {
                navigate('/sign-in');
            }
        } catch (error) {
            console.error('Error fetching banner data:', error);
            setLoading(false);
            if (error.response && error.response.status === 500) {
                window.alert('Token is expired, Please sign in again');
                navigate('/sign-in');
            } else {
                window.alert('Error fetching banner data. Please try again.');
                setError('Error fetching banner data. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };
    

    const replaceLocalhost = (url) => {
        return url.replace(`${process.env.REACT_APP_LOCAL_HOST}`, `${process.env.REACT_APP_API_URL}`);
    };

    useEffect(() => {
      fetchBannerData(URL);
  }, [currentPage]); 

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

        const handleViewClick = (banner) => {
            setSelectedBanner(banner);
            setFormData({
                name: banner.name,
                description: banner.description,
                image: banner.image
            });
        };

        const handleCloseClick = () => {
            setSelectedBanner(null);
        };

        const handleDeleteClick = async (bannerId) => {
            if (window.confirm("Are you sure you want to delete?")) {
              try {
                setDeleteLoadingId(bannerId);
                const token = localStorage.getItem('token');
                if (!token) {
                  throw new Error('No token found. Please login again.');
                }
          
                const base64EncodedIdObject = btoa(JSON.stringify({
                  "iv": bannerId.iv,
                  "encryptedData": bannerId.encryptedData
                }));
          
                const response = await axios.delete(`${process.env.REACT_APP_API_URL}/api/admin/banner/${base64EncodedIdObject}`, {
                  headers: {
                    Authorization: `Bearer ${token}`
                  }
                });
          
                if (response.status === 200) {
                  fetchBannerData(URL);
                  toast.success('Banner deleted successfully.');
                }
          
              } catch (error) {
                console.error('Error deleting Banner:', error);
                console.error('Error response from server:', error.response?.data);
                setDeleteLoadingId(null);
                if (error.response && error.response.status === 500) {
                  window.alert('Token is expired, Please sign in again');
                  navigate('/sign-in');
                } else {
                  window.alert('Error deleting Banner. Please try again.');
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
    if (name === 'image') {
        setFormData({ ...formData, [name]: e.target.files[0] });
    } else {
        setFormData({ ...formData, [name]: value });
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
        "iv": selectedBanner.id.iv,
        "encryptedData": selectedBanner.id.encryptedData
      }));
  
      const response = await axios.put(`${process.env.REACT_APP_API_URL}/api/admin/banner/${base64EncodedIdObject}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`
        }
      });
  
      if (response.status === 200) {
        toast.success('Banner Updated Successfully');
        fetchBannerData(URL);
        handleCloseClick();
      }
      setSelectedBanner(null);
  
    } catch (error) {
      console.error('Error updating banner:', error);
      console.error('Error response from server:', error.response?.data);
      setLoadingUpdate(false);
      if (error.response && error.response.status === 500) {
        window.alert('Token is expired, Please sign in again');
        navigate('/sign-in');
      } else {
        window.alert("Error updating banner");
      }
    } finally {
      setLoadingUpdate(false);
    }
  };



    return (
        <div className='pb-7'>
            {loading ? <Loader /> : 
            <div className="grid grid-cols-1 gap-10 md:grid-cols-2 xl:grid-cols-4">
                {bannerData.map(banner => (
                <div key={banner.id.encryptedData} className="relative flex flex-col border border-blue-gray-50 shadow-md p-3 bg-clip-border rounded-xl bg-[--main-color] text-gray-700">
                    <div className="relative bg-clip-border rounded-xl overflow-hidden bg-gray-900 text-white shadow-gray-900/20 shadow-lg mx-0 mt-0 mb-4 h-64 xl:h-40">
                    <img src={replaceLocalhost(banner.image)} alt={banner.title} className="h-full w-full object-cover" />
                    </div>
                    <div className="p-6 py-0 px-1">
                    <p className="block antialiased tracking-normal font-sans font-semibold text-sm leading-snug text-gray-900 mt-1 mb-2">Title: &nbsp;<span className='font-normal'>{banner.name}</span></p>
                    <p className="block antialiased font-sans text-sm leading-normal font-semibold text-gray-900">Description: &nbsp;<span className='font-normal'>{banner.description}</span></p>
                    </div>
                    <div className="p-6 mt-6 flex items-center justify-between py-0 px-1">
                    <button className="bg-green-500 px-5 p-2 text-sm rounded-full text-white lg:me-5 lg:mb-0 mb-3" onClick={() => handleViewClick(banner)}>View</button>
                    <button className="bg-red-500 px-5 p-2 text-sm rounded-full text-white" onClick={() => handleDeleteClick(banner.id)} disabled={deleteLoadingId === banner.id}>{deleteLoadingId === banner.id ? 'Loading...' : 'Delete'}</button>
                    </div>
                </div>
                ))}
            </div>
            }
            <div className='text-center pt-7'>
                <button onClick={handlePrevious} disabled={!apiResponse || !apiResponse.previous || currentPage === 1} className={`bg-[#2d2d2d] rounded-md px-5 p-2 text-sm text-white mx-2 w-24 ${!apiResponse || !apiResponse.previous || currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''}`}>Previous</button>
                {Array.from({ length: Math.min(totalPages, 3) }, (_, index) => currentPage - 1 + index).map(pageNumber => (
                    pageNumber > 0 && pageNumber <= totalPages && (
                        <button key={pageNumber} onClick={() => handlePageClick(pageNumber)} className={`bg-[#2d2d2d] rounded-md p-2 text-sm text-white mx-1 w-8 focus:outline-none ${pageNumber === currentPage ? 'bg-blue-500' : ''}`}>{pageNumber}</button>
                    )
                ))}
                <button onClick={handleNext} disabled={!apiResponse || !apiResponse.next || currentPage === totalPages} className={`bg-[#2d2d2d] rounded-md px-5 p-2 text-sm text-white mx-2 w-24 ${!apiResponse || !apiResponse.next || currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : ''}`}>Next</button>
            </div>
            {selectedBanner && (
                <div className="fixed p-3 inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50 overflow-y-auto">
                    <div className="bg-white w-[600px] max-w-2xl p-6 rounded-lg">
                        <h2 className="text-2xl font-bold mb-4">Update Banner</h2>
                        <form className="max-w-xl mx-auto" onSubmit={handleSubmit}>
                            <div className="mb-4">
                                <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Banner Name</label>
                                <input value={formData.name} onChange={handleChange} type="text" id="name" name="name" className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Banner Name..." required />
                            </div>
                            <div className="mb-4">
                                <label htmlFor="description" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Description</label>
                                <textarea value={formData.description} onChange={handleChange} placeholder='Description...' type="text" id="description" name="description" className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required />
                            </div>
                            <div className="mb-4">
                                <label htmlFor="image" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Image</label>
                                <input onChange={handleChange} type="file" id="image" name="image" className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500" />
                            </div>
                            <div className="flex items-center justify-end space-x-4">
                                <button type="button" onClick={handleCloseClick} className="border border-gray-300 text-gray-900 dark:text-white rounded-lg px-6 py-2">Cancel</button>
                                <button type="submit" className="bg-blue-500 text-white rounded-lg px-6 py-2" disabled={loadingUpdate}>{loadingUpdate ? 'Updating...' : 'Update'}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default GetBanner;
