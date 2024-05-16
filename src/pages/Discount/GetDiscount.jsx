import React, { useState,useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Loader from '../Loader';

function GetDiscount() {

    const [apiResponse, setApiResponse] = useState(null);
    const [discountData, setDiscountData] = useState([]);
    const [formData, setFormData] = useState({
        title: '',
        companyId: '',
        image: null,
        valid_till: '',
        companybaseurl:''
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
    
    const URL = `${process.env.REACT_APP_API_URL}/api/admin/discount?limit=${limitPerPage}&page=${currentPage}`;

    const fetchDiscountData = async (URL) => {
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
              setDiscountData(response.data.data.data);
              setTotalPages(Math.ceil(response.data.data.total / limitPerPage)); // Calculate total pages
          } else {
              navigate('/sign-in');
          }
      } catch (error) {
          console.error('Error fetching discount data:', error);
          setLoading(false);
          if (error.response && error.response.status === 500) {
              window.alert('Token is expired, Please sign in again');
              // navigate('/sign-in');
          } else {
              window.alert('Error fetching discount data. Please try again.');
              setError('Error fetching discount data. Please try again.');
          }
      } finally {
          setLoading(false);
      }
  };

  useEffect(() => {
    fetchDiscountData(URL);
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




  const handleEditClick = (discount) => {
    const companyIdBase64 = btoa(JSON.stringify({
      "iv": discount.company.id.iv,
      "encryptedData": discount.company.id.encryptedData,
  }));
    setIsModalOpen(discount);
    setFormData({
      title: discount.title,
      companyId: discount.company.name,
      // image: discount.image,
      valid_till: discount.valid_till,
      companybaseurl:companyIdBase64
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
        title: formData.title,
        companyId:formData.companybaseurl,
        image: formData.image,
        valid_till: formData.valid_till,
      };
      if (formData.image) {
        requestBody.image = formData.image;
      }
      
      const response = await axios.put(`${process.env.REACT_APP_API_URL}/api/admin/discount/${base64EncodedIdObject}`,
        requestBody, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`
        }
      });
  
      if (response.status === 200) {
        toast.success('Discount Updated Successfully');
        fetchDiscountData(URL);
        handleCancelClick();
      }
      setIsModalOpen(null);
  
    } catch (error) {
      console.error('Error updating discount:', error);
      console.error('Error response from server:', error.response?.data);
      setLoadingUpdate(false);
      if (error.response && error.response.status === 500) {
        window.alert('Token is expired, Please sign in again');
        // navigate('/sign-in');
      } else {
        window.alert("Error updating discount");
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


  const handleDeleteClick = async (discountId) => {
    if (window.confirm("Are you sure you want to delete?")) {
      try {
        setDeleteLoadingId(discountId);
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No token found. Please login again.');
        }
  
        const base64EncodedIdObject = btoa(JSON.stringify({
          "iv": discountId.iv,
          "encryptedData": discountId.encryptedData
        }));
  
        const response = await axios.delete(`${process.env.REACT_APP_API_URL}/api/admin/discount/${base64EncodedIdObject}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
  
        if (response.status === 200) {
          fetchDiscountData(URL);
          toast.success('Discount deleted successfully.');
        }
  
      } catch (error) {
        console.error('Error deleting discount:', error);
        console.error('Error response from server:', error.response?.data);
        setDeleteLoadingId(null);
        if (error.response && error.response.status === 500) {
          window.alert('Token is expired, Please sign in again');
          // navigate('/sign-in');
        } else {
          window.alert('Error deleting Discount. Please try again.');
        }
      } finally {
        setDeleteLoadingId(null);
      }
    } else {
      console.log("Deletion cancelled");
    }
  };

  function getFilenameFromUrl(url) {
    const parts = url.split('/');
    const filename = parts.pop();
    return filename;
  }
  


  return (
    <div>
      <div className="pb-7">
      {loading ? <Loader /> : 
      <div className="grid grid-cols-1 gap-10 md:grid-cols-2 xl:grid-cols-4">
        {discountData.map(discount => (
          <div key={discount.id.encryptedData} className="relative flex flex-col border border-blue-gray-50 shadow-md p-3 bg-clip-border rounded-xl bg-[--main-color] text-gray-700">
            <div className="relative bg-clip-border rounded-xl overflow-hidden bg-gray-900 text-white shadow-gray-900/20 shadow-lg mx-0 mt-0 mb-4 h-64 xl:h-40">
              <img src={discount.image} alt={discount.title} className="h-full w-full object-cover" />
            </div>
            <div className="p-6 py-0 px-1">
              <p className="block antialiased tracking-normal font-sans font-semibold text-sm leading-snug text-gray-900 mt-1 mb-2">Title: &nbsp;<span className='font-normal'>{discount.title}</span></p>
              <p className="block antialiased font-sans text-sm leading-normal font-semibold text-gray-900">Company Name: &nbsp;<span className='font-normal'>{discount.company.name}</span></p>
            <div className='text-sm text-gray-900 font-semibold pt-2'>Validity Date: &nbsp;<span className='font-normal'>{new Date(discount.valid_till).toLocaleDateString('en-GB', { day: 'numeric', month: 'numeric', year: 'numeric' })}</span></div>
            </div>
            <div className="p-6 mt-6 flex items-center justify-between py-0 px-1">
              <button className="bg-green-500 px-5 p-2 text-sm rounded-full text-white lg:me-5 lg:mb-0 mb-3" onClick={() => handleEditClick(discount)}>View</button>
              <button className="bg-red-500 px-5 p-2 text-sm rounded-full text-white" onClick={() => handleDeleteClick(discount.id)} disabled={deleteLoadingId === discount.id}>{deleteLoadingId === discount.id ? 'Loading...' : 'Delete'}</button>
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
        <div className="fixed inset-0 p-3 flex justify-center items-start bg-black bg-opacity-50 z-50">
          <div className="bg-white w-[600px] max-w-2xl p-6 rounded-lg">
            <h2 className="text-2xl font-bold mb-4">Update Discount</h2>
            <form class="max-w-xl mx-auto" onSubmit={handleSubmit}>
        <div class="mb-5">
            <label for="text" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Discount Title</label>
            <input value={formData.title} onChange={handleChange} name='title' type="text" id="text" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="lorem ipsum" />
        </div>
        <div class="mb-5">
            <label for="text" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Company ID</label>
            <input readonly value={formData.companyId}  name='companyId' placeholder='Lorem ipsum dolor sit...' type="text" id="text" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />
        </div>
        <div class="mb-5">
            <label for="text" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Validity Date: {formData.valid_till ? "" : new Date(is.valid_till).toLocaleDateString('en-GB', { day: 'numeric', month: 'numeric', year: 'numeric' })}</label>
            <input value={formData.valid_till} onChange={handleChange} name='valid_till' placeholder='Date...' type="date" id="text" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />
        </div>
        <div className='mb-5'>
        <label class="block mb-2 text-sm font-medium text-gray-900 dark:text-white" for="user_avatar">Upload Image: {formData.image ? "" : getFilenameFromUrl(isModalOpen.image)}</label>
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

export default GetDiscount;