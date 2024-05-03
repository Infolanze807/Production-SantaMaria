import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function AddService() {
    const [name, setName] = useState('');
    const [supplierId, setSupplierId] = useState('');
    const [description, setDescription] = useState('');
    const [image, setImage] = useState(null);
    const [error, setError] = useState('');
    const [token, setToken] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const [suppliers, setSuppliers] = useState([]);

    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        if (storedToken) {
          setToken(storedToken);
        } else {
          navigate('/sign-in');
          alert("Token is not valid. Please login first.");
        }
      }, [navigate]);

      useEffect(() => {
        const fetchSupplier = async () => {
            try {
                const token = localStorage.getItem('token');
                if (token) {
                    const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/admin/supplier/getAllSuppliers`, {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    });
                    const supplierData = response.data.data;
                    const modifiedSupplierData = supplierData.map(item => {
                        const { iv, encryptedData } = item.id;
                        const id = btoa(JSON.stringify({ "iv": iv, "encryptedData": encryptedData }));
                        return { id, name: item.name };
                    });
    
                    setSuppliers(modifiedSupplierData);
                    // console.log("Companies:", modifiedSupplierData);
                } else {
                    navigate('/sign-in');
                }
            } catch (error) {
                console.error('Error fetching supplier:', error);
            }
        };
    
        fetchSupplier();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
          setLoading(true);
          const formData = new FormData();
          formData.append('name', name);
          formData.append('supplierId', supplierId);
          formData.append('description', description);
          formData.append('image', image);
    
          const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/admin/service`, formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
              Authorization: `Bearer ${token}`
            }
          });
          if (response.status === 201) {
            setName('');
            setSupplierId('');
            setDescription('');
            setImage(null);
            toast.success("Service added successfully.");
          }
          console.log(response.data);
        } catch (error) {
          console.error('Error adding company:', error);
          setError('Error adding company. Please try again.');
          setLoading(false);
          if (error.response && error.response.status === 500) {
            window.alert('Token is expired, Please sign in again');
            // navigate('/sign-in');
          } else {
            window.alert('Error adding event. Please try again.');
          }
        } finally {
          setLoading(false);
        }
      };

  return (
    <div>
        <div className='p-4 py-8 mb-7 bg-[--main-color] bg-clip-border rounded-xl'>
        <form className="max-w-xl mx-auto" onSubmit={handleSubmit}>
          <div className="mb-5">
            <label htmlFor="serviceName" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Service Title</label>
            <input value={name} onChange={(e) => setName(e.target.value)} type="text" id="serviceName" className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-[--second-color] focus:border-[--second-color] block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-[--second-color] dark:focus:border-[--second-color]" placeholder="Service Title..."  required />
          </div>
          <div className="mb-5">
            <label htmlFor="supplierId" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Supplier Name</label>
            <select value={supplierId} onChange={(e) => setSupplierId(e.target.value)} id="supplierId" className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-[--second-color] focus:border-[--second-color] block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-[--second-color] dark:focus:border-[--second-color]" required>
              <option value="">Select Supplier</option>
              {suppliers.map(supplier => (
                <option key={supplier.id} value={supplier.id}>{supplier.name}</option>
              ))}
            </select>
          </div>
          <div className="mb-5">
            <label htmlFor="eventDate" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Service Description</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder='Service Description...' type="date" id="eventDate" className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"  required />
          </div>
          <div className='mb-5'>
            <label htmlFor="companyImage" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Service Image</label>
            <input onChange={(e) => setImage(e.target.files[0])} type="file" id="companyImage" className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-[--second-color] focus:border-[--second-color] block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-400 dark:focus:ring-[--second-color] dark:focus:border-[--second-color]"  />
          </div>
          <button type="submit" className="text-white bg-[--second-color] font-medium rounded-lg text-sm w-full px-5 py-2.5 text-center" disabled={loading}>{loading ? 'Submitting...' : 'Submit'}</button>
          {/* Display error message if there's an error */}
          {error && <div className="text-red-600">{error}</div>}
        </form>
      </div>
    </div>
  )
}

export default AddService