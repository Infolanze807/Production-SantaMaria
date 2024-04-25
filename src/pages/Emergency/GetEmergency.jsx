import React, { useState } from 'react'

function GetEmergency() {

  const emergencyData = [
    {
      id: 1,
      name: 'Infolanze',
      number: "9638527410",
      profile_img: '/img/home-decor-1.jpeg',
      cover_img: '/img/home-decor-2.jpeg',
    },
    {
      id: 2,
      name: 'Infolanze Tech',
      number: "7410852963",
      profile_img: '/img/home-decor-4.jpeg',
      cover_img: '/img/home-decor-3.jpeg',
    },
  ];

  const [selectedEmergency, setSelectedEmergency] = useState(null);

    const handleViewClick = (emergency) => {
        setSelectedEmergency(emergency);
    };

    const handleCloseClick = () => {
        setSelectedEmergency(null);
    };

  return (
    <div>
      <div className="pb-7">
      <div className="grid grid-cols-1 gap-10 md:grid-cols-2 xl:grid-cols-4">
        {emergencyData.map(emergency => (
          <div key={emergency.id} className="relative flex flex-col border border-blue-gray-50 shadow-md p-3 bg-clip-border rounded-xl bg-[--main-color] text-gray-700">
          <div className='relative'>
            <div className='pt-11'>
                <img className='-z-10 w-full object-cover rounded-lg' src={emergency.cover_img} alt="" />
            </div>
            <div className='absolute border-2 border-white rounded-full left-1/2 transform -translate-x-1/2 top-0'>
                <img className='w-20 h-20 rounded-full object-cover' src={emergency.profile_img} alt="" />
            </div>
        </div>
            <div className="p-6 py-0 px-1 pt-5">
              <p className="block antialiased font-sans text-sm text-gray-900 font-semibold">Name: &nbsp;<span className='font-normal'>{emergency.name}</span></p>
            <div className='text-sm pt-1 text-gray-900 font-semibold'>Number: &nbsp;<span className='font-normal'>{emergency.number}</span></div>
            </div>
            <div className="p-6 mt-6 flex items-center justify-between py-0 px-1">
              <button className="bg-green-500 px-5 p-2 text-sm rounded-full text-white lg:me-5 lg:mb-0 mb-3" onClick={() => handleViewClick(emergency)}>View</button>
              <button className="bg-red-500 px-5 p-2 text-sm rounded-full text-white">Delete</button>
            </div>
          </div>
        ))}
      </div>
      {selectedEmergency && (
        <div className="fixed inset-0 p-3 flex justify-center items-center bg-black bg-opacity-50 z-50">
          <div className="bg-white w-[600px] max-w-2xl p-6 rounded-lg">
            <h2 className="text-2xl font-bold mb-4">Update Emergency</h2>
            <form class="max-w-xl mx-auto">
        <div class="mb-5">
            <label for="text" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Emergency Contact Name</label>
            <input value={selectedEmergency.name} type="text" id="text" class="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Emergency Contact Name..." required />
        </div>
        <div class="mb-5">
            <label for="tel" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Emergency Contact Number</label>
            <input value={selectedEmergency.number} placeholder='Emergency Contact Number...' type="tel" id="text" class="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required />
        </div>
        <div className='mb-5'>
            <label class="block mb-2 text-sm font-medium text-gray-900 dark:text-white" for="user_avatar">Emergency Profile Image</label>
            <input class="block w-full p-2 text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-white dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400" aria-describedby="user_avatar_help" id="user_avatar" type="file" />
        </div>
        <div className='mb-5'>
            <label class="block mb-2 text-sm font-medium text-gray-900 dark:text-white" for="user_avatar">Emergency Cover Image</label>
            <input class="block w-full p-2 text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-white dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400" aria-describedby="user_avatar_help" id="user_avatar" type="file" />
        </div>
        <div className="flex justify-between mt-4">
            <button type='submit' className="bg-green-500 text-white px-4 py-2 rounded mr-4">Update</button>
            <button className="bg-red-500 text-white px-4 py-2 rounded" onClick={handleCloseClick}>Cancel</button>
        </div>
        </form>
          </div>
        </div>
      )}
    </div>
    </div>
  )
}

export default GetEmergency