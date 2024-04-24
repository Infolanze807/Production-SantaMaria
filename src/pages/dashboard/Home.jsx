import React from "react";
import { HiOutlineDotsVertical } from "react-icons/hi";

export function Home() {
  return (
   <div className="">
    <div className="bg-clip-border rounded-xl bg-white text-gray-700 border border-blue-gray-100 mt-9 shadow-sm">
    <div className="p-6">
      <div className="flex items-center justify-between bg-[--main-color] p-3 py-5 rounded-lg">
        <div className="text-sm ps-2 text-gray-800">Users Requests</div>
        <div><HiOutlineDotsVertical /></div>
      </div>
      </div>
      <div className="pt-7 pb-7 overflow-x-scroll">
        <table className="w-full min-w-[640px] table-auto">
          <thead className="">
            <tr>
              <th className="border-b border-blue-gray-50 py-3 px-6 text-left"><p className="block antialiased font-sans text-sm text-blue-gray-400 uppercase">User</p></th>
              <th className="border-b border-blue-gray-50 py-3 px-6 text-left"><p className="block antialiased font-sans text-sm text-blue-gray-400 uppercase">Mobile No.</p></th>
              <th className="border-b border-blue-gray-50 py-3 px-6 text-left"><p className="block antialiased font-sans text-sm text-blue-gray-400 uppercase">Email</p></th>
              <th className="border-b border-blue-gray-50 py-3 px-6 text-left"><p className="block antialiased font-sans text-sm text-blue-gray-400 uppercase">Password</p></th>
              <th className="border-b border-blue-gray-50 py-3 px-6 text-center"><p className="block antialiased font-sans text-sm text-blue-gray-400 uppercase">Action</p></th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="py-3 px-5 border-b border-blue-gray-50 text-sm text-blue-gray-900 font-bold">Jone Deo</td>
              <td className="py-3 px-5 border-b border-blue-gray-50 text-sm">9632587410</td>
              <td className="py-3 px-5 border-b border-blue-gray-50 text-sm">jone@gmail.com</td>
              <td className="py-3 px-5 border-b border-blue-gray-50 text-sm">******</td>
              <td className="py-3 px-5 border-b border-blue-gray-50 text-sm text-center"><button className="bg-green-500 px-5 p-2 rounded-full text-white lg:me-5 lg:mb-0 mb-3">Accept</button><button className="bg-red-500 px-5 p-2 rounded-full text-white">Reject</button></td>
            </tr>
            <tr>
              <td className="py-3 px-5 border-b border-blue-gray-50 text-sm text-blue-gray-900 font-bold">spider</td>
              <td className="py-3 px-5 border-b border-blue-gray-50 text-sm">96325874100</td>
              <td className="py-3 px-5 border-b border-blue-gray-50 text-sm">spider@gmail.com</td>
              <td className="py-3 px-5 border-b border-blue-gray-50 text-sm">***********</td>
              <td className="py-3 px-5 border-b border-blue-gray-50 text-sm text-center"><button className="bg-green-500 px-5 p-2 rounded-full text-white lg:me-5 lg:mb-0 mb-3">Accept</button><button className="bg-red-500 px-5 p-2 rounded-full text-white">Reject</button></td>
            </tr>
            <tr>
              <td className="py-3 px-5 border-b border-blue-gray-50 text-sm text-blue-gray-900 font-bold">Michle</td>
              <td className="py-3 px-5 border-b border-blue-gray-50 text-sm">96325874102</td>
              <td className="py-3 px-5 border-b border-blue-gray-50 text-sm">micher@gmail.com</td>
              <td className="py-3 px-5 border-b border-blue-gray-50 text-sm">*********</td>
              <td className="py-3 px-5 border-b border-blue-gray-50 text-sm text-center"><button className="bg-green-500 px-5 p-2 rounded-full text-white lg:me-5 lg:mb-0 mb-3">Accept</button><button className="bg-red-500 px-5 p-2 rounded-full text-white">Reject</button></td>
            </tr>
            <tr>
              <td className="py-3 px-5 border-b border-blue-gray-50 text-sm text-blue-gray-900 font-bold">spider</td>
              <td className="py-3 px-5 border-b border-blue-gray-50 text-sm">96325874100</td>
              <td className="py-3 px-5 border-b border-blue-gray-50 text-sm">spider@gmail.com</td>
              <td className="py-3 px-5 border-b border-blue-gray-50 text-sm">***********</td>
              <td className="py-3 px-5 border-b border-blue-gray-50 text-sm text-center"><button className="bg-green-500 px-5 p-2 rounded-full text-white lg:me-5 lg:mb-0 mb-3">Accept</button><button className="bg-red-500 px-5 p-2 rounded-full text-white">Reject</button></td>
            </tr>
            <tr>
              <td className="py-3 px-5 border-b border-blue-gray-50 text-sm text-blue-gray-900 font-bold">Jone Deo</td>
              <td className="py-3 px-5 border-b border-blue-gray-50 text-sm">9632587410</td>
              <td className="py-3 px-5 border-b border-blue-gray-50 text-sm">jone@gmail.com</td>
              <td className="py-3 px-5 border-b border-blue-gray-50 text-sm">******</td>
              <td className="py-3 px-5 border-b border-blue-gray-50 text-sm text-center"><button className="bg-green-500 px-5 p-2 rounded-full text-white lg:me-5 lg:mb-0 mb-3">Accept</button><button className="bg-red-500 px-5 p-2 rounded-full text-white">Reject</button></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
   </div>
  );
}

export default Home;
