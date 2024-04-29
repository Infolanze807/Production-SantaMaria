import React from 'react'
import { HiOutlineDotsVertical } from "react-icons/hi";

function AllUser({users}) {

    const requests = [
        {
          first_name: "Jone",
          last_name: "Deo",
          email: "jone@gmail.com",
          date_of_birth: "22/09/2001",
          location: "Ahmedabad",
        },
        {
          first_name: "Spider",
          last_name: "Maxwell",
          email: "spider@gmail.com",
          date_of_birth: "30/04/2005",
          location: "Rajkot",
        },
        {
          first_name: "Michle",
          last_name: "Deo",
          email: "micher@gmail.com",
          date_of_birth: "20/04/2025",
          location: "Gandhinagar",
        },
      ];

  return (
    <div className="mb-6">
      <div className="bg-clip-border rounded-xl bg-white text-gray-700 border border-blue-gray-100 shadow-sm">
        <div className="p-6">
          <div className="flex items-center justify-between bg-[--main-color] p-3 py-4 rounded-lg">
            <div className="text-sm ps-2 text-gray-800">Get All Users</div>
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
                    First Name
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
              </tr>
            </thead>
            <tbody>
              {users.map((request, index) => (
                <tr key={index}>
                   <td className="py-3 px-5 border-b border-blue-gray-50 text-sm text-blue-gray-900 font-bold">
                    {index+1}
                  </td>
                  <td className="py-3 px-5 border-b border-blue-gray-50 text-sm text-blue-gray-900 font-bold">
                    {request.firstName}
                  </td>
                  {/* <td className="py-3 px-5 border-b border-blue-gray-50 text-sm">
                    {request.lastName}
                  </td> */}
                  <td className="py-3 px-5 border-b border-blue-gray-50 text-sm">
                    {request.email}
                  </td>
                  <td className="py-3 px-5 border-b border-blue-gray-50 text-sm">
                    {request.dob}
                  </td>
                  <td className="py-3 px-5 border-b border-blue-gray-50 text-sm">
                    {request.bio}
                  </td>
                  <td className="py-3 px-5 border-b border-blue-gray-50 text-sm ">
                    {request.location}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default AllUser