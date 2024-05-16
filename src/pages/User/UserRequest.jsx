import React, { useState, useEffect } from "react";
import { HiOutlineDotsVertical } from "react-icons/hi";
import axios from "axios";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Loader from "../Loader";

function UserRequest() {

  const [userLoadingId, setUserLoadingId] = useState(null);
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [apiResponse, setApiResponse] = useState(null);
  const [loading, setLoading] = useState(false);


  useEffect(() => {
    fetchUsers();
  }, [currentPage]); // Re-fetch users when currentPage changes

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      if (!token) {
        navigate("/sign-in");
        throw new Error('No token found. Please login again.');
      }
  
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/admin/user?isApproved=false&page=${currentPage}`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
      });
      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }
      const data = await response.json();
      console.log("API response:", data); // Log the API response
      if (response.status === 200) {
        setUsers(data.data.data);
        setTotalPages(data.data.totalPages);
        setApiResponse(data.data);
        console.log("Users", data.data);
      }
    } catch (error) {
      setLoading(false);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePageClick = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleNext = () => {
    if (apiResponse && apiResponse.next) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevious = () => {
    if (apiResponse && apiResponse.previous) {
      setCurrentPage(currentPage - 1);
    }
  };

  if (error) {
    return <div>Error: {error}</div>;
  }



  const handleApprove = async(user) => {
    try {
      setUserLoadingId(user);
      const token = localStorage.getItem('token');
      if (!token) {
          throw new Error('No token found. Please login again.');
      }

      const base64EncodedIdObject = btoa(JSON.stringify({
        "iv": user.id.iv,
        "encryptedData": user.id.encryptedData
    }));
  
      const url = `${process.env.REACT_APP_API_URL}/api/admin/user/approvedLogin/${base64EncodedIdObject}`;
     const response =  await axios.put(url, 
     {"status": 1},
     { headers: {
      Authorization: `Bearer ${token}`
          }
      });
      console.log(response)
      if (response.status === 200) {
          toast.success('User Approved successfully.');
          fetchUsers(); 
      }   
  } catch (error) {
      window.alert("Error deleting company:",error)
      console.error('Error deleting company:', error);   
  }  finally {
    setUserLoadingId(null);
} 
  };

  return (
    <div className="mb-6">
    {loading ? <Loader /> :
      <div className="bg-clip-border rounded-xl bg-white text-gray-700 border border-blue-gray-100 shadow-sm">
        <div className="p-6">
          <div className="flex items-center justify-between bg-[--main-color] p-3 py-4 rounded-lg">
            <div className="text-sm ps-2 text-gray-800">Users Requests</div>
            <div>
              <HiOutlineDotsVertical />
            </div>
          </div>
        </div>
        <div className="pt-4 pb-7 overflow-x-scroll">
          <table className="w-full min-w-[640px] table-auto">
            <thead className="">
              <tr>
              <th className="border-b border-blue-gray-50 py-3 px-6 text-left">
                  <p className="block antialiased font-sans text-sm text-blue-gray-400 uppercase">
                    No.
                  </p>
                </th>
                <th className="border-b border-blue-gray-50 py-3 px-6 text-left">
                  <p className="block antialiased font-sans text-sm text-blue-gray-400 uppercase">
                    Name
                  </p>
                </th>
                {/* <th className="border-b border-blue-gray-50 py-3 px-6 text-left">
                  <p className="block antialiased font-sans text-sm text-blue-gray-400 uppercase">
                    Last Name
                  </p>
                </th> */}
                <th className="border-b border-blue-gray-50 py-3 px-6 text-left">
                  <p className="block antialiased font-sans text-sm text-blue-gray-400 uppercase">
                    Email
                  </p>
                </th>
                <th className="border-b border-blue-gray-50 py-3 px-6 text-left">
                  <p className="block antialiased font-sans text-sm text-blue-gray-400 uppercase">
                    Date Of Birth
                  </p>
                </th>
                <th className="border-b border-blue-gray-50 py-3 px-6 text-left">
                  <p className="block antialiased font-sans text-sm text-blue-gray-400 uppercase">
                   Bio
                  </p>
                </th>
                <th className="border-b border-blue-gray-50 py-3 px-6 text-left">
                  <p className="block antialiased font-sans text-sm text-blue-gray-400 uppercase">
                    Location
                  </p>
                </th>
                <th className="border-b border-blue-gray-50 py-3 px-6 text-center">
                  <p className="block antialiased font-sans text-sm text-blue-gray-400 uppercase">
                    Action
                  </p>
                </th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, index) => (
                <tr className="hover:cursor-pointer" key={index}>
                   <td className="py-3 px-5 border-b border-blue-gray-50 text-sm text-blue-gray-900 font-bold">
                    {index+1}
                  </td>
                  <td className="py-3 px-5 border-b border-blue-gray-50 text-sm text-blue-gray-900 font-bold">
                    {user.firstName}
                  </td>
                  {/* <td className="py-3 px-5 border-b border-blue-gray-50 text-sm">
                    {user.lastName}
                  </td> */}
                  <td className="py-3 px-5 border-b border-blue-gray-50 text-sm">
                    {user.email}
                  </td>
                  <td className="py-3 px-5 border-b border-blue-gray-50 text-sm">
                  {new Date(user.dob).toLocaleDateString('en-GB', { day: 'numeric', month: 'numeric', year: 'numeric' })}
                  </td>
                  <td className="py-3 px-5 border-b border-blue-gray-50 text-sm">
                    {user.bio}
                  </td>
                  <td className="py-3 px-5 border-b border-blue-gray-50 text-sm">
                    {user.location}
                  </td>

                  <td className="py-3 px-5 border-b border-blue-gray-50 text-sm text-center">
                    <button className="bg-green-500 px-5 p-2 rounded-full text-white" disabled={userLoadingId === user} onClick={() => handleApprove(user)}>
                    {userLoadingId === user ? 'Accepting...' : 'Accept'}
                    </button>
                    {/* <button className="bg-red-500 px-5 p-2 rounded-full text-white">
                      Reject
                    </button> */}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
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
    </div>
  );
}

export default UserRequest;
