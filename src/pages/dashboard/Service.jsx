import React, {useState} from 'react'
import GetService from '../Service/GetService';
import AddService from '../Service/AddService';

function Service() {

  const [activeTab, setActiveTab] = useState(0);

  const handleTabClick = (index) => {
    setActiveTab(index);
  };

  return (
    <div className="">
    <div className="bg-clip-border rounded-xl bg-white text-gray-700 border border-blue-gray-100 mt-9 shadow-sm">
    <div className="p-6">
      <div className="flex items-center justify-between bg-[--main-color] p-3 py-4 rounded-lg">
        <div><button className={activeTab === 0 ? "bg-[--second-color] text-white px-7 py-2 shadow-md rounded-lg text-sm" : "bg-white px-7 py-2 rounded-lg text-sm  border shadow-md border-blue-gray-50"} onClick={() => handleTabClick(0)}>Get Service</button></div>
        <div><button className={activeTab === 1 ? "bg-[--second-color] text-white px-7 py-2 shadow-md rounded-lg text-sm" : "bg-white px-7 py-2 rounded-lg text-sm border shadow-md border-blue-gray-50"} onClick={() => handleTabClick(1)}>Add Service</button></div>
      </div>
      </div>
      <div className="px-6">
      {activeTab === 0 && <div><GetService /></div>}
      {activeTab === 1 && <div><AddService /></div>}
      </div>
    </div>
   </div>
  )
}

export default Service;