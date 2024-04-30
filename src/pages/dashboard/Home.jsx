import React, {useEffect, useState} from 'react'
import UserRequest from '../User/UserRequest';
import AllUser from '../User/AllUser';
import axios from 'axios';


function Home() {
  const [users, setUsers] = useState([]);
  const [activeTab, setActiveTab] = useState(0);
  const [approvedUsers, setApprovedUsers] = useState([]);
  const [pendingUsers, setPendingUsers] = useState([]);

  const handleTabClick = (index) => {
    setActiveTab(index);
  };
  const handleDataChange = () => {
    fetchUserData()  
};
  const fetchUserData = async () => {
  
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            throw new Error('No token found. Please login again.');
        }

        const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/admin/user`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        if (response.status === 200) {
          // Set users and filter users from response data
          setUsers(response.data.data.data);
          filterUsers(response.data.data.data);
          console.log(response.data.data.data);
      } 
        
    } catch (error) {
        console.error('Error fetching company data:', error);
          // Check if error response is due to JWT expiration
          if (error.response && error.response.data && error.response.data.code === 500) {
            // If token has expired, redirect to the login page
            window.alert(error.response.data.message)
            window.location.href = '/login';
        } else {
            // Optionally, set error message in state to display in the UI
            // setError('Error fetching user data. Please try again.');
        }

        //setError('Error fetching company data. Please try again.');
    }
};

const filterUsers = (users) => {
  const approved = users.filter(user => user.isApproved === true);
  const pending = users.filter(user => user.isApproved === false);
  setApprovedUsers(approved);
  setPendingUsers(pending);
console.log(approved,"approved")
console.log(pending,"pending")
};
    useEffect(() => {
      fetchUserData();
    }, []);

  return (
    <div className="">
    <div className="bg-clip-border rounded-xl bg-white text-gray-700 border border-blue-gray-100 mt-9 shadow-sm">
    <div className="p-6">
      <div className="flex items-center justify-between bg-[--main-color] p-3 py-4 rounded-lg">
        <div><button className={activeTab === 0 ? "bg-[--second-color] text-white px-7 py-2 shadow-md rounded-lg text-sm" : "bg-white px-7 py-2 rounded-lg text-sm  border shadow-md border-blue-gray-50"} onClick={() => handleTabClick(0)}>User Requests</button></div>
        <div><button className={activeTab === 1 ? "bg-[--second-color] text-white px-7 py-2 shadow-md rounded-lg text-sm" : "bg-white px-7 py-2 rounded-lg text-sm border shadow-md border-blue-gray-50"} onClick={() => handleTabClick(1)}>Approved Users</button></div>
      </div>
      </div>
      <div className="px-6">
      {activeTab === 0 && <div><UserRequest users={pendingUsers} onDataChange={handleDataChange}/></div>}
      {activeTab === 1 && <div><AllUser users={approvedUsers}  /></div>}
      </div>
    </div>
   </div>
  )
}

export default Home;