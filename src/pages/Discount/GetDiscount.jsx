import React, { useState } from 'react';

function GetDiscount() {

  const discountData = [
    {
      id: 1,
      title: 'Modern',
      company_id: '567253868695',
      image: '/img/home-decor-1.jpeg',
      date: '2024-04-24',
    },
    {
      id: 2,
      title: 'Micle Jecson',
      company_id: '963258741965',
      image: '/img/home-decor-2.jpeg',
      date: '2024-04-22',
    },
    
    {
      id: 2,
      title: 'Micle Jecson',
      company_id: '963258741965',
      image: '/img/home-decor-2.jpeg',
      date: '2024-04-22',
    },
    
    {
      id: 2,
      title: 'Micle Jecson',
      company_id: '963258741965',
      image: '/img/home-decor-2.jpeg',
      date: '2024-04-22',
    },
  ];

  const [editingDiscount, setEditingDiscount] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleEditClick = (discount) => {
    setEditingDiscount(discount);
    setIsModalOpen(true);
  };

  const handleCancelClick = () => {
    setIsModalOpen(false);
    setEditingDiscount(null);
  };

  const handleUpdateClick = () => {
    setIsModalOpen(false);
    setEditingDiscount(null);
  };

  return (
    <div>
      <div className="pb-7">
      <div className="grid grid-cols-1 gap-10 md:grid-cols-2 xl:grid-cols-4">
        {discountData.map(discount => (
          <div key={discount.id} className="relative flex flex-col border border-blue-gray-50 shadow-md p-3 bg-clip-border rounded-xl bg-[--main-color] text-gray-700">
            <div className="relative bg-clip-border rounded-xl overflow-hidden bg-gray-900 text-white shadow-gray-900/20 shadow-lg mx-0 mt-0 mb-4 h-64 xl:h-40">
              <img src={discount.image} alt={discount.title} className="h-full w-full object-cover" />
            </div>
            <div className="p-6 py-0 px-1">
              <p className="block antialiased tracking-normal font-sans font-semibold text-sm leading-snug text-gray-900 mt-1 mb-2">Title: &nbsp;<span className='font-normal'>{discount.title}</span></p>
              <p className="block antialiased font-sans text-sm leading-normal font-semibold text-gray-900">Company ID: &nbsp;<span className='font-normal'>{discount.company_id}</span></p>
            <div className='text-sm text-gray-900 font-semibold pt-2'>Validity Date: &nbsp;<span className='font-normal'>{discount.date}</span></div>
            </div>
            <div className="p-6 mt-6 flex items-center justify-between py-0 px-1">
              <button className="bg-green-500 px-5 p-2 text-sm rounded-full text-white lg:me-5 lg:mb-0 mb-3" onClick={() => handleEditClick(discount)}>View</button>
              <button className="bg-red-500 px-5 p-2 text-sm rounded-full text-white">Delete</button>
            </div>
          </div>
        ))}
      </div>
      {isModalOpen && (
        <div className="fixed inset-0 p-3 flex justify-center items-center bg-black bg-opacity-50 z-50">
          <div className="bg-white w-[600px] max-w-2xl p-6 rounded-lg">
            <h2 className="text-2xl font-bold mb-4">Update Discount</h2>
            <form class="max-w-xl mx-auto">
        <div class="mb-5">
            <label for="text" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Discount Title</label>
            <input type="text" id="text" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="lorem ipsum" value={editingDiscount.title} required />
        </div>
        <div class="mb-5">
            <label for="text" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Company ID</label>
            <input placeholder='Lorem ipsum dolor sit...' type="text" id="text" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" value={editingDiscount.company_id} required />
        </div>
        <div class="mb-5">
            <label for="text" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Validity Date</label>
            <input placeholder='Date...' type="text" id="text" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" value={editingDiscount.date} required />
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

export default GetDiscount;