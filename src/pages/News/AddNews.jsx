import React from 'react'

function AddNews() {
  return (
    <div>
        <div className='p-4 py-8 mb-7 bg-[--main-color] bg-clip-border rounded-xl'>
        <form class="max-w-xl mx-auto">
        <div class="mb-5">
            <label for="text" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">News Title</label>
            <input type="text" id="text" class="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="lorem ipsum" required />
        </div>
        <div class="mb-5">
            <label for="text" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">News Discription</label>
            <textarea placeholder='Lorem ipsum dolor sit...' type="text" id="text" class="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required />
        </div>
        <div class="mb-5">
            <label for="text" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">News Date</label>
            <input placeholder='Date...' type="text" id="text" class="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required />
        </div>
        <div className='mb-5'>
        <label class="block mb-2 text-sm font-medium text-gray-900 dark:text-white" for="user_avatar">Upload Image</label>
        <input class="block w-full p-2 text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-white dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400" aria-describedby="user_avatar_help" id="user_avatar" type="file" />
        </div>
        <div class="flex items-center mb-5">
            <input id="default-checkbox" type="checkbox" value="" class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
            <label for="default-checkbox" class="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">Show on top</label>
        </div>
        <div className=''>
        <button type="submit" class="text-white bg-[--second-color] font-medium rounded-lg text-sm w-full px-5 py-2.5 text-center">Submit</button>
            </div>
        </form>
    </div>
    </div>
  )
}

export default AddNews