import React, { useState, useEffect } from 'react';
import axios from 'axios';

function GetEmergency() {
    const [emergencyData, setEmergencyData] = useState([]);
    const [selectedEmergency, setSelectedEmergency] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        contact_no: '',
        profile_image: null,
        cover_image: null
    });
    const [error, setError] = useState('');

    const fetchEmergencyData = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('No token found. Please login again.');
            }

            const response = await axios.get('http://ec2-16-170-165-104.eu-north-1.compute.amazonaws.com:5000/api/admin/contact', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setEmergencyData(response.data.data.data);
            
        } catch (error) {
            console.error('Error fetching emergency data:', error);
        }
    };

    useEffect(() => {
        fetchEmergencyData();
    }, []);

    const handleViewClick = (emergency) => {
        setSelectedEmergency(emergency);
        setFormData({
            name: emergency.name,
            contact_no: emergency.contact_no,
            profile_image: emergency.profile_image,
            cover_image: emergency.cover_image
        });
    };

    const handleCloseClick = () => {
        setSelectedEmergency(null);
    };

    const handleDeleteClick = async (emergencyId) => {
        if (window.confirm("Are you sure you want to delete?")) {
            
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('No token found. Please login again.');
            }
            

            const base64EncodedIdObject = btoa(JSON.stringify({
                "iv": emergencyId.iv,
                "encryptedData": emergencyId.encryptedData
            }));
            
            const response = await axios.delete(`http://ec2-16-170-165-104.eu-north-1.compute.amazonaws.com:5000/api/admin/contact/${base64EncodedIdObject}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if (response.status === 200) {
                fetchEmergencyData()
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
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
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
                "iv": selectedEmergency.id.iv,
                "encryptedData": selectedEmergency.id.encryptedData
            }));
            const response = await axios.put(`http://ec2-16-170-165-104.eu-north-1.compute.amazonaws.com:5000/api/admin/contact/${base64EncodedIdObject}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                 Authorization: `Bearer ${token}`
             }
            });

            // After updating, fetch updated emergency data
            if (response.status === 200) {
                window.alert("User Updated Successfully");
                fetchEmergencyData()    
                handleCloseClick()
             } setSelectedEmergency(null); // Close the modal after updating

            } catch (error) {
                console.error('Error updating company:', error);
                console.error('Error response from server:', error.response?.data); // Log the response data directly
            }
    };

    return (
        <div>
            {emergencyData.map(emergency => (
                <div key={emergency.id.encryptedData} className="grid lg:grid-cols-6 grid-cols-1 items-center border rounded-lg p-5 bg-[--main-color] mb-5">
                    <div className='col-span-2'>
                        <img className='w-full object-cover rounded-lg' src={emergency.cover_image} alt="" />
                    </div>
                    <div className='col-span-3 text-gray-900 font-semibold text-sm leading-relaxed pt-5 lg:pt-0'>
                        <div>Name: &nbsp;<span className='font-normal'>{emergency.name}</span></div>
                        <div>Contact No: &nbsp;<span className='font-normal'>{emergency.contact_no}</span></div>
                    </div>
                    <div className='lg:flex lg:flex-col mx-auto gap-2 pt-4 lg:pt-0'>
                        <button className="bg-green-500 px-8 w-max p-2 text-sm rounded-full text-white lg:me-5 lg:mb-0 mb-3" onClick={() => handleViewClick(emergency)}>View</button>
                        <button className="bg-red-500 px-7 p-2 w-max text-sm rounded-full text-white" onClick={() => handleDeleteClick(emergency.id)}>Delete</button>
                    </div>
                </div>
            ))}
            {selectedEmergency && (
                <div className="fixed p-3 inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50 overflow-y-auto">
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
                                <label htmlFor="profile_image" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Profile Image</label>
                                <input onChange={handleChange} type="file" id="profile_image" name="profile_image" accept="image/*" className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required />
                            </div>
                            <div className="mb-4">
                                <label htmlFor="cover_image" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Cover Image</label>
                                <input onChange={handleChange} type="file" id="cover_image" name="cover_image" accept="image/*" className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required />
                            </div>
                            <button type="submit" className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 transition duration-200">Update</button>
                        </form>
                        <button onClick={handleCloseClick} className="bg-gray-200 text-gray-700 px-6 py-2 rounded-md hover:bg-gray-300 transition duration-200 mt-4">Cancel</button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default GetEmergency;
