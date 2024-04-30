import React, {useState} from "react";
import AddEvent from "../Events/AddEvent";
import AllEvent from "../Events/AllEvent";

export function Events() {
  const [activeTab, setActiveTab] = useState(1);

  const handleTabClick = (index) => {
    setActiveTab(index);
  };
  return (
    <>
      <div className="">
    <div className="bg-clip-border rounded-xl bg-white text-gray-700 border border-blue-gray-100 mt-9 shadow-sm">
    <div className="p-6">
      <div className="flex items-center justify-between bg-[--main-color] p-3 py-4 rounded-lg">
        <div><button className={activeTab === 1 ? "bg-[--second-color] text-white px-7 py-2 shadow-md rounded-lg text-sm" : "bg-white px-7 py-2 rounded-lg text-sm  border shadow-md border-blue-gray-50"} onClick={() => handleTabClick(1)}>All News & Event</button></div>
        <div><button className={activeTab === 0 ? "bg-[--second-color] text-white px-7 py-2 shadow-md rounded-lg text-sm" : "bg-white px-7 py-2 rounded-lg text-sm border shadow-md border-blue-gray-50"} onClick={() => handleTabClick(0)}>Add News & Event</button></div>
      </div>
      </div>
      <div className="px-6">
      {activeTab === 0 && <div><AddEvent /></div>}
      {activeTab === 1 && <div><AllEvent /></div>}
      </div>
    </div>
   </div>
    </>
  );
}

export default Events;
