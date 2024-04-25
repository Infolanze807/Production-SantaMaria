import React, { useState } from 'react';

function GetBanner() {

  const bannerData = [
    {
      id: 1,
      title: 'Modern',
      description: "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Beatae, ut.",
      image: '/img/home-decor-1.jpeg',
    },
    {
      id: 2,
      title: 'Micle Jecson',
      description: "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Beatae, ut.",
      image: '/img/home-decor-2.jpeg',
    },
  ];

  const [editingBanner, setEditingBanner] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleEditClick = (banner) => {
    setEditingBanner(banner);
    setIsModalOpen(true);
  };

  const handleCancelClick = () => {
    setIsModalOpen(false);
    setEditingBanner(null);
  };

  const handleUpdateClick = () => {
    setIsModalOpen(false);
    setEditingBanner(null);
  };

  return (
    <div>
      <div className="pb-7">
      <div className="grid grid-cols-1 gap-10 md:grid-cols-2 xl:grid-cols-4">
        {bannerData.map(banner => (
          <div key={banner.id} className="relative flex flex-col border border-blue-gray-50 shadow-md p-3 bg-clip-border rounded-xl bg-[--main-color] text-gray-700">
            <div className="relative bg-clip-border rounded-xl overflow-hidden bg-gray-900 text-white shadow-gray-900/20 shadow-lg mx-0 mt-0 mb-4 h-64 xl:h-40">
              <img src={banner.image} alt={banner.title} className="h-full w-full object-cover" />
            </div>
            <div className="p-6 py-0 px-1">
              <p className="block antialiased tracking-normal font-sans font-semibold text-sm leading-snug text-gray-900 mt-1 mb-2">Title: &nbsp;<span className='font-normal'>{banner.title}</span></p>
              <p className="block antialiased font-sans text-sm leading-normal font-semibold text-gray-900">Description: &nbsp;<span className='font-normal'>{banner.description}</span></p>
            </div>
            <div className="p-6 mt-6 flex items-center justify-between py-0 px-1">
              <button className="bg-green-500 px-5 p-2 text-sm rounded-full text-white lg:me-5 lg:mb-0 mb-3" onClick={() => handleEditClick(banner)}>View</button>
              <button className="bg-red-500 px-5 p-2 text-sm rounded-full text-white">Delete</button>
            </div>
          </div>
        ))}
      </div>
      {isModalOpen && (
        <div className="fixed inset-0 p-3 flex justify-center items-center bg-black bg-opacity-50 z-50">
          <div className="bg-white w-[600px] max-w-2xl p-6 rounded-lg">
            <h2 className="text-2xl font-bold mb-4">Update Banner</h2>
            <form class="max-w-xl mx-auto">
        <div class="mb-5">
            <label for="text" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Banner Title</label>
            <input type="text" id="text" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="lorem ipsum" value={editingBanner.title} required />
        </div>
        <div class="mb-5">
            <label for="text" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Banner Discription</label>
            <textarea placeholder='Lorem ipsum dolor sit...' type="text" id="text" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" value={editingBanner.description} required />
        </div>
        <div className='mb-5'>
            <label class="block mb-2 text-sm font-medium text-gray-900 dark:text-white" for="user_avatar">Upload Image</label>
            <input class="block w-full p-2 text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400" aria-describedby="user_avatar_help" id="user_avatar" type="file" />
        </div>
            <div className="flex justify-between mt-4">
              <button type='submit' className="bg-green-500 text-white px-4 py-2 rounded mr-4" onClick={handleUpdateClick}>Update</button>
              <button className="bg-red-500 text-white px-4 py-2 rounded" onClick={handleCancelClick}>Cancel</button>
            </div>
        </form>
          </div>
        </div>
      )}
    </div>
    </div>
  )
}

export default GetBanner