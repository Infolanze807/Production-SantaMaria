import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Loader from '../Loader';
import { useNavigate } from 'react-router-dom';

function GetSupplier() {
    const [apiResponse, setApiResponse] = useState(null);
    const [supplierData, setSupplierData] = useState([]);
    const [selectedSupplier,setSelectedSupplier] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        contact_no: ''
    });
    const [error, setError] = useState('');
    const [deleteLoadingId, setDeleteLoadingId] = useState(null);
    const [loadingUpdate, setLoadingUpdate] = useState(false);
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1); 
    const navigate = useNavigate();
    const limitPerPage = 5;

    const URL = `${process.env.REACT_APP_API_URL}/api/admin/supplier?limit=${limitPerPage}&page=${currentPage}`;

    const fetchSupplierData = async (URL) => {
        try {
          setLoading(true);
          const token = localStorage.getItem('token');
          if (token) {
            const response = await axios.get(URL, {
              headers: {
                Authorization: `Bearer ${token}`
              }
            });
            const sortedData = response.data.data.data.sort((a, b) => a.ordering_index - b.ordering_index);
            setApiResponse(response.data.data);
            setSupplierData(sortedData);
            setTotalPages(Math.ceil(response.data.data.total / limitPerPage));
            console.log("xyz", sortedData)
          } else {
            navigate('/sign-in');
            window.alert('Token is not valid. Please sign in first.');
          }
        } catch (error) {
            console.error('Error fetching supplier data:', error);
            setLoading(false);
            if (error.response && error.response.status === 500) {
              window.alert('Token is expired, Please sign in again');
              // navigate('/sign-in');
            } else {
              window.alert('Error fetching supplier data. Please try again.');
              setError('Error fetching supplier data. Please try again.');
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
              fetchSupplierData(URL);
          }, [currentPage]);

          const handleViewClick = (supplier) => {
            setSelectedSupplier(supplier);
            setFormData({
                name: supplier.name,
                description: supplier.description,
                contact_no: supplier.contact_no,
            });
        };

        const handleCloseClick = () => {
            setSelectedSupplier(null);
        };

        const handleDeleteClick = async (supplierId) => {
            if (window.confirm("Are you sure you want to delete?")) {
              try {
                setDeleteLoadingId(supplierId);
                const token = localStorage.getItem('token');
                if (!token) {
                  throw new Error('No token found. Please login again.');
                }

                const base64EncodedIdObject = btoa(JSON.stringify({
                    "iv": supplierId.iv,
                    "encryptedData": supplierId.encryptedData
                  }));
            
                  const response = await axios.delete(`${process.env.REACT_APP_API_URL}/api/admin/supplier/${base64EncodedIdObject}`, {
                    headers: {
                      Authorization: `Bearer ${token}`
                    }
                  });

                  if (response.status === 200) {
                    fetchSupplierData(URL);
                    toast.success('Supplier deleted successfully.');
                  }   

                } catch (error) {
                    console.error('Error deleting supplier:', error);
                    console.error('Error response from server:', error.response?.data);
                    setDeleteLoadingId(null);
                    if (error.response && error.response.status === 500) {
                      window.alert('Token is expired, Please sign in again');
                      // navigate('/sign-in');
                    } else {
                      window.alert('Error deleting supplier. Please try again.');
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
                const contactNumberPattern = /^[0-9\b]+$/;
    
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
                    "iv": selectedSupplier.id.iv,
                    "encryptedData": selectedSupplier.id.encryptedData
                  }));
              
                  const response = await axios.put(`${process.env.REACT_APP_API_URL}/api/admin/supplier/${base64EncodedIdObject}`, formData, {
                    headers: {
                      'Content-Type': 'multipart/form-data',
                      Authorization: `Bearer ${token}`
                    }
                  });
              
                  if (response.status === 200) {
                    toast.success('Supplier Updated Successfully');
                    fetchSupplierData(URL);
                    handleCloseClick();
                  }
                  setSelectedSupplier(null); 
              
                } catch (error) {
                  console.error('Error updating supplier:', error);
                  console.error('Error response from server:', error.response?.data);
                  setLoadingUpdate(false);
                  if (error.response && error.response.status === 500) {
                    window.alert('Token is expired, Please sign in again');
                    // navigate('/sign-in');
                  }
                } finally {
                  setLoadingUpdate(false);
                }
              };
      
   
  return (
    <div>
      {loading ? <Loader /> :
      <div>
        {supplierData.map(supplier => (
                <div key={supplier.id.encryptedData} className="grid lg:grid-cols-6 grid-cols-1 items-center border rounded-lg p-5 bg-[--main-color] mb-5">
                    <div className='col-span-2 relative'>
                        <div className='pt-11 lg:w-72'>
                            <img className='-z-10 w-full object-cover rounded-lg' src={supplier.cover_image} alt="" />
                        </div>
                        <div className=''>
                            <img className='absolute border-4 border-white w-24 h-24 rounded-full object-cover left-6 top-0' src={supplier.profile_image} alt="" />
                        </div>
                    </div>
                    <div className='col-span-3 text-gray-900 font-semibold text-sm leading-relaxed pt-5 lg:pt-0'>
                        <div>Name: &nbsp;<span className='font-normal'>{supplier.name}</span></div>
                        <div>Description: &nbsp;<span className='font-normal'>{supplier.description}</span></div>
                        <div>Number: &nbsp;<span className='font-normal'>{supplier.contact_no}</span></div>
                    </div>
                    <div className='lg:flex lg:flex-col mx-auto gap-2 pt-4 lg:pt-0'>
                        <button className="bg-green-500 px-8 w-max p-2 text-sm rounded-full text-white lg:me-5 lg:mb-0 mb-3" onClick={() => handleViewClick(supplier)}>View</button>
                        <button className="bg-red-500 px-7 p-2 w-max text-sm rounded-full text-white" disabled={deleteLoadingId === supplier.id} onClick={() => handleDeleteClick(supplier.id)}>{deleteLoadingId === supplier.id ? 'Deleting...' : 'Delete'}</button>
                    </div>
                </div>
            ))}
             </div>
            }
             <div className='text-center pb-7 pt-2'>
                <button onClick={handlePrevious} disabled={!apiResponse || !apiResponse.previous || currentPage === 1} className={`bg-[#2d2d2d] rounded-md px-5 p-2 text-sm text-white mx-2 w-24 ${!apiResponse || !apiResponse.previous || currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''}`}>Previous</button>
                {Array.from({ length: Math.min(totalPages, 3) }, (_, index) => currentPage - 1 + index).map(pageNumber => (
                    pageNumber > 0 && pageNumber <= totalPages && (
                        <button key={pageNumber} onClick={() => handlePageClick(pageNumber)} className={`bg-[#2d2d2d] rounded-md p-2 text-sm text-white mx-1 w-8 focus:outline-none ${pageNumber === currentPage ? 'bg-blue-500' : ''}`}>{pageNumber}</button>
                    )
                ))}
                <button onClick={handleNext} disabled={!apiResponse || !apiResponse.next || currentPage === totalPages} className={`bg-[#2d2d2d] rounded-md px-5 p-2 text-sm text-white mx-2 w-24 ${!apiResponse || !apiResponse.next || currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : ''}`}>Next</button>
            </div>

            {selectedSupplier && (
                <div className="fixed p-3 inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50 overflow-y-auto">
                    <div className="bg-white w-[600px] max-w-2xl p-6 rounded-lg">
                        <h2 className="text-2xl font-bold mb-4">Update Supplier</h2>
                        <form className="max-w-xl mx-auto" onSubmit={handleSubmit}>
                            <div className="mb-4">
                                <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Supplier Name</label>
                                <input value={formData.name} onChange={handleChange} type="text" id="name" name="name" className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Supplier Name..." required />
                            </div>
                            <div className="mb-4">
                                <label htmlFor="bio" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Supplier Description</label>
                                <textarea value={formData.description} onChange={handleChange} placeholder='Supplier Bio...' type="text" id="description" name="description" className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required />
                            </div>
                            <div className="mb-4">
                                <label htmlFor="contact_no" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Contact Number</label>
                                <input value={formData.contact_no} onChange={handleChange} placeholder='Number...' type="tel" id="contact_no" name="contact_no" className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required />
                            </div>
                            <div className='mb-4'>
                                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white" htmlFor="profile_img">Profile Image</label>
                                <input onChange={handleChange} name='profile_image' className="block w-full p-2 text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-white dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400" aria-describedby="user_avatar_help" id="user_avatar" type="file" />
                            </div>
                            <div className='mb-4'>
                                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white" htmlFor="cover_img">Cover Image</label>
                                <input onChange={handleChange} name='cover_image' className="block w-full p-2 text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-white dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400" aria-describedby="user_avatar_help" id="user_avatar" type="file" />
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
  )
}

export default GetSupplier;