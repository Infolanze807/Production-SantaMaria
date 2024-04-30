import React from "react";
import { HiOutlineDotsVertical } from "react-icons/hi";
import axios from "axios";

function UserRequest({users,onDataChange}) {
  const handleApprove = async(user) => {
    try {
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
          
          window.alert("User Approved successfully.");
           onDataChange();  
        
      }   
  } catch (error) {
      window.alert("Error deleting company:",error)
      console.error('Error deleting company:', error);   
  }
  }

  return (
    <div className="mb-6">
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
                    {user.dob}
                  </td>
                  <td className="py-3 px-5 border-b border-blue-gray-50 text-sm">
                    {user.bio}
                  </td>
                  <td className="py-3 px-5 border-b border-blue-gray-50 text-sm">
                    {user.location}
                  </td>

                  <td className="py-3 px-5 border-b border-blue-gray-50 text-sm text-center">
                    <button className="bg-green-500 px-5 p-2 rounded-full text-white" onClick={() => handleApprove(user)}>
                      Accept
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
    </div>
  );
}

export default UserRequest;
