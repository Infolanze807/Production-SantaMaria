import React, { useState, useEffect } from 'react';
import axios from 'axios';

function GetCompany() {
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

    
    const fetchCompanyData = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('No token found. Please login again.');
            }

            const response = await axios.get('http://ec2-16-170-165-104.eu-north-1.compute.amazonaws.com:5000/api/admin/company', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setCompanyData(response.data.data.data);
            
        } catch (error) {
            console.error('Error fetching company data:', error);
            setError('Error fetching company data. Please try again.');
        }
    };

  
    useEffect(() => {
        fetchCompanyData();
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
                const token = localStorage.getItem('token');
                if (!token) {
                    throw new Error('No token found. Please login again.');
                }
        
                const base64EncodedIdObject = btoa(JSON.stringify({
                    "iv": companyId.iv,
                    "encryptedData": companyId.encryptedData
                }));
                
              const response = await axios.delete(`http://ec2-16-170-165-104.eu-north-1.compute.amazonaws.com:5000/api/admin/company/${base64EncodedIdObject}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
        
                if (response.status === 200) {
                    fetchCompanyData()
                    window.alert("Company deleted successfully.");
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
        const { name, value } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('No token found. Please login again.');
            }

            const base64EncodedIdObject = btoa(JSON.stringify({
                "iv": selectedCompany.id.iv,
                "encryptedData": selectedCompany.id.encryptedData
            }));
            
         const response = await axios.put(`http://ec2-16-170-165-104.eu-north-1.compute.amazonaws.com:5000/api/admin/company/${base64EncodedIdObject}`, formData, {
                headers: {
                       'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${token}`
                }
            });

            if (response.status === 200) {
                window.alert("User Updated Successfully");
                fetchCompanyData()  
                handleCloseClick()
             } setSelectedCompany(null); // Close the modal after updating

        } catch (error) {
            console.error('Error updating company:', error);
            console.error('Error response from server:', error.response?.data); // Log the response data directly
        }
    };

    return (
        <div>
            {companyData.map(company => (
                <div key={company.id.encryptedData} className="grid lg:grid-cols-6 grid-cols-1 items-center border rounded-lg p-5 bg-[--main-color] mb-5">
                    <div className='col-span-2 relative'>
                        <div className='pt-11 lg:w-72'>
                            <img className='-z-10 w-full object-cover rounded-lg' src={company.cover_image} alt="" />
                        </div>
                        <div className=''>
                            <img className='absolute border-4 bg-white w-24 h-24 rounded-full object-cover left-6 top-0' src={company.profile_image} alt="" />
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
                        <button className="bg-red-500 px-7 p-2 w-max text-sm rounded-full text-white" onClick={() => handleDeleteClick(company.id)}>Delete</button>
                    </div>
                </div>
            ))}
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
                            <div className="flex items-center justify-end space-x-4">
                                <button type="button" onClick={handleCloseClick} className="border border-gray-300 text-gray-900 dark:text-white rounded-lg px-6 py-2">Cancel</button>
                                <button type="submit" className="bg-blue-500 text-white rounded-lg px-6 py-2">Update</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default GetCompany;
