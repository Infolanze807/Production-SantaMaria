import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Loader from '../Loader';

function GetCompany() {
    const [apiResponse, setApiResponse] = useState(null);
    const [companyData, setCompanyData] = useState([]);
    const [selectedCompany, setSelectedCompany] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        bio: '',
        contact_no: '',
        instagram_url: '',
        location: ''
    });
    const [error, setError] = useState('');
    const [deleteLoadingId, setDeleteLoadingId] = useState(null);
    const [loadingUpdate, setLoadingUpdate] = useState(false);
    const [loading, setLoading] = useState(false);

    
  const URL = `${process.env.REACT_APP_API_URL}/api/admin/company?limit=5&page=1`

    const fetchCompanyData = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('No token found. Please login again.');
            }

            const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/admin/company`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            console.log(response.data.data,"apidetails")
            setApiResponse(response.data.data);
            setCompanyData(response.data.data.data);
            
        } catch (error) {
            console.error('Error fetching company data:', error);
            window.alert('Error fetching cpmpany data. Please try again.');
            setError('Error fetching company data. Please try again.');
        } finally {
            setLoading(false); // Set loading back to false after fetching data
        }
    };

    const replacePagehost = (url) => {
        return url.replace(`${process.env.REACT_APP_API_URL}/api/admin/company`);
      };

    const handleNext = () => {
        if (apiResponse && apiResponse.next) {
         const nexturl = replacePagehost(apiResponse.next)
         console.log(nexturl,"next")
         fetchCompanyData(nexturl);
       }
   };

   const handlePrevious = () => {
    if (apiResponse && apiResponse.previous) {
        const previousurl = replacePagehost(apiResponse.previous);
        console.log(previousurl, "previous");
        fetchCompanyData(previousurl);
    }
};

  
    useEffect(() => {
        fetchCompanyData(URL);
    }, []);

    const handleViewClick = (company) => {
        setSelectedCompany(company);
        setFormData({
            name: company.name,
            bio: company.bio,
            contact_no: company.contact_no,
            instagram_url: company.instagram_url,
            location: company.location
        });
    };

    const handleCloseClick = () => {
        setSelectedCompany(null);
    };

    const handleDeleteClick = async (companyId) => {
            // Use window.confirm to show a confirmation dialog
            if (window.confirm("Are you sure you want to delete?")) {
              // If the user clicks "Yes", perform the deletion logic here
              try {
                setDeleteLoadingId(companyId);
                const token = localStorage.getItem('token');
                if (!token) {
                    throw new Error('No token found. Please login again.');
                }
        
                const base64EncodedIdObject = btoa(JSON.stringify({
                    "iv": companyId.iv,
                    "encryptedData": companyId.encryptedData
                }));
                
              const response = await axios.delete(`${process.env.REACT_APP_API_URL}/api/admin/company/${base64EncodedIdObject}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
        
                if (response.status === 200) {
                    fetchCompanyData(URL)
                    // window.alert("Company deleted successfully.");
                    toast.success('Company deleted successfully.');
                }   
                
            } catch (error) {
                console.error('Error deleting company:', error);
                console.error('Error response from server:', error.response?.data); // Log the response data directly
                window.alert('Error deleting company. Please try again.');
            }  finally {
                setDeleteLoadingId(null); // Set loading state to false after API call completes
            } 
            //   console.log("Item deleted");  // This would be replaced with actual deletion logic
            } else {
              // If the user clicks "No", simply close the dialog
              console.log("Deletion cancelled");  // This line is optional, for debugging
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
        try {
            setLoadingUpdate(true);
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('No token found. Please login again.');
            }

            const base64EncodedIdObject = btoa(JSON.stringify({
                "iv": selectedCompany.id.iv,
                "encryptedData": selectedCompany.id.encryptedData
            }));
            
         const response = await axios.put(`${process.env.REACT_APP_API_URL}/api/admin/company/${base64EncodedIdObject}`, formData, {
                headers: {
                       'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${token}`
                }
            });

            if (response.status === 200) {
                // window.alert("User Updated Successfully");
                toast.success('Company Updated Successfully');
                fetchCompanyData(URL)  
                handleCloseClick()
             } setSelectedCompany(null); // Close the modal after updating

        } catch (error) {
            console.error('Error updating company:', error);
            console.error('Error response from server:', error.response?.data); // Log the response data directly
        } finally {
            setLoadingUpdate(false);
        }
    };

    const replaceLocalhost = (url) => {
        return url.replace("http://localhost:5000", `${process.env.REACT_APP_API_URL}`);
    };

    return (
        <div>
        {loading && <Loader />}
            {companyData.map(company => (
                <div key={company.id.encryptedData} className="grid lg:grid-cols-6 grid-cols-1 items-center border rounded-lg p-5 bg-[--main-color] mb-5">
                    <div className='col-span-2 relative'>
                        <div className='pt-11 lg:w-72'>
                            <img className='-z-10 w-full object-cover rounded-lg' src={replaceLocalhost(company.cover_image)} alt="" />
                        </div>
                        <div className=''>
                            <img className='absolute border-4 bg-white w-24 h-24 rounded-full object-cover left-6 top-0' src={replaceLocalhost(company.profile_image)} alt="" />
                        </div>
                    </div>
                    <div className='col-span-3 text-gray-900 font-semibold text-sm leading-relaxed pt-5 lg:pt-0'>
                        <div>Name: &nbsp;<span className='font-normal'>{company.name}</span></div>
                        <div>Bio: &nbsp;<span className='font-normal'>{company.bio}</span></div>
                        <div>Number: &nbsp;<span className='font-normal'>{company.contact_no}</span></div>
                        <div>Instagram URL: &nbsp;<span className='font-normal'>{company.instagram_url}</span></div>
                        <div>Link: &nbsp;<span className='font-normal'>{company.location}</span></div>
                    </div>
                    <div className='lg:flex lg:flex-col mx-auto gap-2 pt-4 lg:pt-0'>
                        <button className="bg-green-500 px-8 w-max p-2 text-sm rounded-full text-white lg:me-5 lg:mb-0 mb-3" onClick={() => handleViewClick(company)}>View</button>
                        <button className="bg-red-500 px-7 p-2 w-max text-sm rounded-full text-white" disabled={deleteLoadingId === company.id} onClick={() => handleDeleteClick(company.id)}>{deleteLoadingId === company.id ? 'Deleting...' : 'Delete'}</button>
                    </div>
                </div>
            ))}
            <div className='text-center pt-4'>
              <button onClick={handlePrevious} disabled={!apiResponse || !apiResponse.previous} className='bg-[#2d2d2d] px-5 p-2 text-sm rounded-full text-white mx-2 w-24'>Previous</button>
              <button onClick={handleNext} disabled={!apiResponse || !apiResponse.next} className='bg-[#2d2d2d] px-5 p-2 text-sm rounded-full text-white mx-2 w-24'>Next</button>
            </div>
            {selectedCompany && (
                <div className="fixed p-3 inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50 overflow-y-auto">
                    <div className="bg-white w-[600px] max-w-2xl p-6 rounded-lg">
                        <h2 className="text-2xl font-bold mb-4">Update Company</h2>
                        <form className="max-w-xl mx-auto" onSubmit={handleSubmit}>
                            <div className="mb-4">
                                <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Company Name</label>
                                <input value={formData.name} onChange={handleChange} type="text" id="name" name="name" className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Company Name..." required />
                            </div>
                            <div className="mb-4">
                                <label htmlFor="bio" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Company Bio</label>
                                <textarea value={formData.bio} onChange={handleChange} placeholder='Company Bio...' type="text" id="bio" name="bio" className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required />
                            </div>
                            <div className="mb-4">
                                <label htmlFor="contact_no" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Contact Number</label>
                                <input value={formData.contact_no} onChange={handleChange} placeholder='Number...' type="tel" id="contact_no" name="contact_no" className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required />
                            </div>
                            <div className="mb-4">
                                <label htmlFor="instagram_url" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Instagram URL</label>
                                <input value={formData.instagram_url} onChange={handleChange} placeholder='Instagram URL...' type="text" id="instagram_url" name="instagram_url" className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required />
                            </div>
                            <div className="mb-4">
                                <label htmlFor="location" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Location</label>
                                <input value={formData.location} onChange={handleChange} placeholder='Location...' type="text" id="location" name="location" className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required />
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
    );
}

export default GetCompany;
