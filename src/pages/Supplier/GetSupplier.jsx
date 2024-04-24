import React, {useState} from 'react'

function GetSupplier() {

    const supplierData = [
        {
            id: 1,
            name: 'Modern',
            bio: 'As Uber works through a huge amount of internal management turmoil.',
            profile_img: '/img/home-decor-1.jpeg',
            cover_img: '/img/home-decor-2.jpeg',
            number: "1234567890",
            service: "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Eum, repellendus."
        },
        {
            id: 2,
            name: 'Modern',
            bio: 'As Uber works through a huge amount of internal management turmoil.',
            profile_img: '/img/home-decor-4.jpeg',
            cover_img: '/img/home-decor-3.jpeg',
            number: "1234567890",
            service: "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Eum, repellendus."
        },
    ];

    const [selectedSupplier, setSelectedSupplier] = useState(null);

    const handleViewClick = (supplier) => {
        setSelectedSupplier(supplier);
    };

    const handleCloseClick = () => {
        setSelectedSupplier(null);
    };

  return (
    <div>
        {supplierData.map(supplier => (
                <div key={supplier.id} className="grid lg:grid-cols-6 grid-cols-1 items-center border rounded-lg p-5 bg-[--main-color] mb-5">
                    <div className='col-span-2 relative'>
                        <div className='pt-11 lg:w-72'>
                            <img className='-z-10 w-full object-cover rounded-lg' src={supplier.cover_img} alt="" />
                        </div>
                        <div className=''>
                            <img className='absolute w-24 h-24 rounded-full object-cover left-6 top-0' src={supplier.profile_img} alt="" />
                        </div>
                    </div>
                    <div className='col-span-3 text-gray-900 font-semibold text-sm leading-relaxed'>
                        <div>Name: &nbsp;<span className='font-normal'>{supplier.name}</span></div>
                        <div>Bio: &nbsp;<span className='font-normal'>{supplier.bio}</span></div>
                        <div>Number: &nbsp;<span className='font-normal'>{supplier.number}</span></div>
                        <div>Service: &nbsp;<span className='font-normal'>{supplier.service}</span></div>
                    </div>
                    <div className='lg:flex lg:flex-col mx-auto gap-2'>
                        <button className="bg-green-500 px-8 w-max p-2 text-sm rounded-full text-white lg:me-5 lg:mb-0 mb-3" onClick={() => handleViewClick(supplier)}>View</button>
                        <button className="bg-red-500 px-7 p-2 w-max text-sm rounded-full text-white">Delete</button>
                    </div>
                </div>
            ))}
            {selectedSupplier && (
                <div className="fixed p-3 inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50 overflow-y-auto">
                    <div className="bg-white w-[600px] max-w-2xl p-6 rounded-lg">
                        <h2 className="text-2xl font-bold mb-4">Update Supplier</h2>
                        <form class="max-w-xl mx-auto">
                            <div class="mb-4">
                                <label for="text" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Supplier Name</label>
                                <input value={selectedSupplier.name} type="text" id="text" class="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Supplier Name..." required />
                            </div>
                            <div class="mb-4">
                                <label for="text" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Supplier Bio</label>
                                <textarea value={selectedSupplier.bio} placeholder='Supplier Bio...' type="text" id="text" class="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required />
                            </div>
                            <div class="mb-4">
                                <label for="tel" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Contact Number</label>
                                <input value={selectedSupplier.number} placeholder='Number...' type="tel" id="text" class="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required />
                            </div>
                            <div className='mb-4'>
                            <label class="block mb-2 text-sm font-medium text-gray-900 dark:text-white" for="user_avatar">Profile Image</label>
                            <input class="block w-full p-2 text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-white dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400" aria-describedby="user_avatar_help" id="user_avatar" type="file" />
                            </div>
                            <div className='mb-4'>
                            <label class="block mb-2 text-sm font-medium text-gray-900 dark:text-white" for="user_avatar">Cover Image</label>
                            <input class="block w-full p-2 text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-white dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400" aria-describedby="user_avatar_help" id="user_avatar" type="file" />
                            </div>
                            <div class="mb-4">
                                <label for="text" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Services</label>
                                <input value={selectedSupplier.service} type="text" id="text" class="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Services..." required />
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
  )
}

export default GetSupplier;