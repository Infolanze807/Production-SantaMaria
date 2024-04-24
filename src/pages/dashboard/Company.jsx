import React, {useState} from "react";
import AddCompany from "../Company/AddCompany";
import GetCompany from "../Company/GetCompany";

export function Company() {

  const [activeTab, setActiveTab] = useState(0);

  const handleTabClick = (index) => {
    setActiveTab(index);
  };

  return (
    <>
       <div className="">
    <div className="bg-clip-border rounded-xl bg-white text-gray-700 border border-blue-gray-100 mt-9 shadow-sm">
    <div className="p-6">
      <div className="flex items-center justify-between bg-[--main-color] p-3 py-4 rounded-lg">
        <div><button className={activeTab === 0 ? "bg-[--second-color] text-white px-7 py-2 shadow-md rounded-lg text-sm" : "bg-white px-7 py-2 rounded-lg text-sm border shadow-md border-blue-gray-50"} onClick={() => handleTabClick(0)}>Add Company</button></div>
        <div><button className={activeTab === 1 ? "bg-[--second-color] text-white px-7 py-2 shadow-md rounded-lg text-sm" : "bg-white px-7 py-2 rounded-lg text-sm  border shadow-md border-blue-gray-50"} onClick={() => handleTabClick(1)}>Get Company</button></div>
      </div>
      </div>
      <div className="px-6">
      {activeTab === 0 && <div><AddCompany /></div>}
      {activeTab === 1 && <div><GetCompany /></div>}
      </div>
    </div>
   </div>
    </>
  );
}

export default Company;
