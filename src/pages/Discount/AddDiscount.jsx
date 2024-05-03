import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function AddDiscount() {
  const [title, setTitle] = useState('');
  const [companyId, setCompanyId] = useState('');
  const [date, setDate] = useState('');
  const [image, setImage] = useState(null);
  const [error, setError] = useState('');
  const [token, setToken] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [companies, setCompanies] = useState([]);


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
    const fetchCompanies = async () => {
        try {
            const token = localStorage.getItem('token');
            if (token) {
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/admin/company/getAllCompanies`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                const companiesData = response.data.data;
                const modifiedCompaniesData = companiesData.map(item => {
                    const { iv, encryptedData } = item.id;
                    const id = btoa(JSON.stringify({ "iv": iv, "encryptedData": encryptedData }));
                    return { id, name: item.name };
                });

                setCompanies(modifiedCompaniesData);
                console.log("Companies:", modifiedCompaniesData);
            } else {
                window.alert('Token is not valid. Please sign in first.');
                navigate('/sign-in');
            }
        } catch (error) {
            console.error('Error fetching companies:', error);
        }
    };

    fetchCompanies();
}, []);


  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append('title', title);
      formData.append('companyId', companyId);
      formData.append('valid_till', date);
      formData.append('image', image);

      const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/admin/discount`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`
        }
      });
      if (response.status === 201) {
        setTitle('');
        setCompanyId('');
        setDate('');
        setImage(null);
        toast.success("Discount added successfully.");
      }
      console.log(response.data);
    } catch (error) {
      console.error('Error adding company:', error);
      setError('Error adding company. Please try again.');
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
    <div>
      <div className='p-4 py-8 mb-7 bg-[--main-color] bg-clip-border rounded-xl'>
        <form className="max-w-xl mx-auto" onSubmit={handleSubmit}>
          <div className="mb-5">
            <label htmlFor="companyName" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Discount Title</label>
            <input value={title} onChange={(e) => setTitle(e.target.value)} type="text" id="companyName" className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-[--second-color] focus:border-[--second-color] block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-[--second-color] dark:focus:border-[--second-color]" placeholder="Company Name..."  required />
          </div>
          <div className="mb-5">
            <label htmlFor="companyId" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Company</label>
            <select value={companyId} onChange={(e) => setCompanyId(e.target.value)} id="companyId" className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-[--second-color] focus:border-[--second-color] block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-[--second-color] dark:focus:border-[--second-color]" required>
              <option value="">Select Company</option>
              {companies.map(company => (
                <option key={company.id} value={company.id}>{company.name}</option>
              ))}
            </select>
          </div>
          <div className="mb-5">
            <label htmlFor="eventDate" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Valid Date</label>
            <input value={date} onChange={(e) => setDate(e.target.value)} placeholder='Valid Date...' type="date" id="eventDate" className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"  required />
          </div>
          <div className='mb-5'>
            <label htmlFor="companyImage" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Discount Image</label>
            <input onChange={(e) => setImage(e.target.files[0])} type="file" id="companyImage" className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-[--second-color] focus:border-[--second-color] block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-400 dark:focus:ring-[--second-color] dark:focus:border-[--second-color]"  />
          </div>
          <button type="submit" className="text-white bg-[--second-color] font-medium rounded-lg text-sm w-full px-5 py-2.5 text-center" disabled={loading}>{loading ? 'Submitting...' : 'Submit'}</button>
          {/* Display error message if there's an error */}
          {error && <div className="text-red-600">{error}</div>}
        </form>
      </div>
    </div>
  );
}
  
export default AddDiscount;