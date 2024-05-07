import Axios from 'axios';
import React from 'react'
import { useState, useEffect } from 'react'
import { Navigate } from 'react-router-dom';

function AccountPage() {
  const [id, setId] = useState(null);
  const [user, setUser] = useState(null);
  const [redirect, setRedirect] = useState(false);

  useEffect(() => {
    const storedId = JSON.parse(localStorage.getItem("id"));
    if (storedId && storedId.business_id) {
        setId(storedId.business_id);
        console.log('registered', storedId.business_id);

        Axios.get(`http://localhost:8080/business/${storedId.business_id}`)
            .then(({data}) => {
                setUser(data);
            })
            .catch(error => {
                console.error('Error fetching business data:', error);
            });
    }
}, []);

  if (!user) {
    return <div>Loading...</div>;
  }

  const handleLogout = () => {
    localStorage.removeItem("id");
    setRedirect(true);
  };

  if (redirect) {
    return <Navigate to="/" />;
  }

  return (
    <div className="mx-4 font mt-12 h-screen">
        <div className="mb-8 text-center">
          <h1 className="text-5xl">Welcome to <span className="text-blue-300">Warewise</span>, {user.USERNAME}!</h1>
        </div>
       
      <div className="text-left m-4 max-w-md p-8 border border-blue-300 rounded">
        <h2 className="text-4xl underline">Account Information</h2>
        <p className="mt-4 text-xl">Business ID: {user.BUSINESS_ID}</p>
        <p className="mt-4 text-xl">Username: {user.USERNAME}</p>
        <p className="mt-4 text-xl">Business Name: {user.BUSINESS_NAME}</p>
        <p className="mt-4 text-xl">Creation Date: {user.CREATION_DATE.split('T')[0]}</p>
      </div>
      <div className="flex justify-center">
          <button onClick={handleLogout} className="px-12 py-2 bg-blue-300 text-white rounded-full hover:bg-red-600">Log Out</button>
        </div>
    </div>
  );
}

export default AccountPage;

