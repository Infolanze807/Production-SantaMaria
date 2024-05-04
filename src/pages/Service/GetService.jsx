import React, { useState,useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Loader from '../Loader';

function GetService() {

    const [apiResponse, setApiResponse] = useState(null);
    const [serviceData, setServiceData] = useState([]);
    const [formData, setFormData] = useState({
        name: '',
        supplierId: '',
        image: null,
        description: '',
        supplierbaseurl:''
    });
    const [error, setError] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1); 
    const navigate = useNavigate();
    const [deleteLoadingId, setDeleteLoadingId] = useState(null);
    const [loadingUpdate, setLoadingUpdate] = useState(false);
    const [loading, setLoading] = useState(false);
    const limitPerPage = 4;
    const URL = `${process.env.REACT_APP_API_URL}/api/admin/service?limit=${limitPerPage}&page=${currentPage}`;


    const fetchServiceData = async (URL) => {
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
                setServiceData(response.data.data.data);
                setTotalPages(Math.ceil(response.data.data.total / limitPerPage)); // Calculate total pages
            } else {
              window.alert('Token is expired, Please sign in again');
                navigate('/sign-in');
            }
        } catch (error) {
            console.error('Error fetching service data:', error);
            setLoading(false);
            if (error.response && error.response.status === 500) {
                window.alert('Token is expired, Please sign in again');
                // navigate('/sign-in');
            } else {
                window.alert('Error fetching service data. Please try again.');
                setError('Error fetching service data. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };
  
    useEffect(() => {
      fetchServiceData(URL);
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

  const handleEditClick = (service) => {
    console.log(service)
    const supplierIdBase64 = btoa(JSON.stringify({
      "iv": service.supplier.id.iv,
      "encryptedData": service.supplier.id.encryptedData,
  }));
    setIsModalOpen(service);
    setFormData({
      name: service.name,
      supplierId: service.supplier.name,
      description: service.description,
      supplierbaseurl:supplierIdBase64
  });
  };

  const handleCancelClick = () => {
    setIsModalOpen(false);
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
        "iv": isModalOpen.id.iv,
        "encryptedData": isModalOpen.id.encryptedData
      }));
      const requestBody = {
        name: formData.name,
        supplierId:formData.supplierbaseurl,
        image: formData.image,
        description: formData.description,
      };
      if (formData.image) {
        requestBody.image = formData.image;
      }
      
      const response = await axios.put(`${process.env.REACT_APP_API_URL}/api/admin/service/${base64EncodedIdObject}`,
        requestBody, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`
        }
      });
  
      if (response.status === 200) {
        toast.success('Service Updated Successfully');
        fetchServiceData(URL);
        handleCancelClick();
      }
      setIsModalOpen(null);
  
    } catch (error) {
      console.error('Error updating service:', error);
      console.error('Error response from server:', error.response?.data);
      setLoadingUpdate(false);
      if (error.response && error.response.status === 500) {
        window.alert('Token is expired, Please sign in again');
        // navigate('/sign-in');
      } else {
        window.alert("Error updating service");
      }
    } finally {
      setLoadingUpdate(false);
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

const handleDeleteClick = async (serviceId) => {
    if (window.confirm("Are you sure you want to delete?")) {
      try {
        setDeleteLoadingId(serviceId);
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No token found. Please login again.');
        }
  
        const base64EncodedIdObject = btoa(JSON.stringify({
          "iv": serviceId.iv,
          "encryptedData": serviceId.encryptedData
        }));
  
        const response = await axios.delete(`${process.env.REACT_APP_API_URL}/api/admin/service/${base64EncodedIdObject}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
  
        if (response.status === 200) {
          fetchServiceData(URL);
          toast.success('Service deleted successfully.');
        }
  
      } catch (error) {
        console.error('Error deleting service:', error);
        console.error('Error response from server:', error.response?.data);
        setDeleteLoadingId(null);
        if (error.response && error.response.status === 500) {
          window.alert('Token is expired, Please sign in again');
          // navigate('/sign-in');
        } else {
          window.alert('Error deleting service. Please try again.');
        }
      } finally {
        setDeleteLoadingId(null);
      }
    } else {
      console.log("Deletion cancelled");
    }
  };


  return (
    <div>
        <div className="pb-7">
      {loading ? <Loader /> : 
      <div className="grid grid-cols-1 gap-10 md:grid-cols-2 xl:grid-cols-4">
        {serviceData.map(service => (
          <div key={service.id.encryptedData} className="relative flex flex-col border border-blue-gray-50 shadow-md p-3 bg-clip-border rounded-xl bg-[--main-color] text-gray-700">
            <div className="relative bg-clip-border rounded-xl overflow-hidden bg-gray-900 text-white shadow-gray-900/20 shadow-lg mx-0 mt-0 mb-4 h-64 xl:h-40">
              <img src={service.image} alt={service.name} className="h-full w-full object-cover" />
            </div>
            <div className="p-6 py-0 px-1">
              <p className="block antialiased tracking-normal font-sans font-semibold text-sm leading-snug text-gray-900 mt-1 mb-2">Title: &nbsp;<span className='font-normal'>{service.name}</span></p>
              <p className="block antialiased font-sans text-sm leading-normal font-semibold text-gray-900">Supplier Name: &nbsp;<span className='font-normal'>{service.supplier.name}</span></p>
            <div className='text-sm text-gray-900 font-semibold pt-2'>Description: &nbsp;<span className='font-normal'>{service.description}</span></div>
            </div>
            <div className="p-6 mt-6 flex items-center justify-between py-0 px-1">
              <button className="bg-green-500 px-5 p-2 text-sm rounded-full text-white lg:me-5 lg:mb-0 mb-3" onClick={() => handleEditClick(service)}>View</button>
              <button className="bg-red-500 px-5 p-2 text-sm rounded-full text-white" onClick={() => handleDeleteClick(service.id)} disabled={deleteLoadingId === service.id}>{deleteLoadingId === service.id ? 'Loading...' : 'Delete'}</button>
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
      {isModalOpen && (
        <div className="fixed inset-0 p-3 flex justify-center items-center bg-black bg-opacity-50 z-50">
          <div className="bg-white w-[600px] max-w-2xl p-6 rounded-lg">
            <h2 className="text-2xl font-bold mb-4">Update Service</h2>
            <form class="max-w-xl mx-auto" onSubmit={handleSubmit}>
        <div class="mb-5">
            <label for="text" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Service Title</label>
            <input value={formData.name} onChange={handleChange} name='name' type="text" id="text" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="lorem ipsum" />
        </div>
        <div class="mb-5">
            <label for="text" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Service ID</label>
            <input readonly value={formData.supplierId}  name='serviceId' placeholder='Lorem ipsum dolor sit...' type="text" id="text" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />
        </div>
        <div class="mb-5">
            <label for="text" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Service Description</label>
            <textarea value={formData.description} onChange={handleChange} name='description' placeholder='Date...' type="date" id="text" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />
        </div>
        <div className='mb-5'>
        <label class="block mb-2 text-sm font-medium text-gray-900 dark:text-white" for="user_avatar">Upload Image</label>
        <input onChange={handleChange} name='image' class="block w-full p-2 text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400" aria-describedby="user_avatar_help" id="user_avatar" type="file" />
        </div>
            <div className="flex justify-between mt-4">
              <button type='submit' className="bg-green-500 text-white px-4 py-2 rounded mr-4" disabled={loadingUpdate}>{loadingUpdate ? 'Updating...' : 'Update'}</button>
              <button className="bg-red-500 text-white px-4 py-2 rounded" onClick={handleCancelClick}>Cancel</button>
            </div>
        </form>
          </div>
        </div>
      )}
    </div>
    </div>
  )
}

export default GetService;