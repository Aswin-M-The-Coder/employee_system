import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Profile() {
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    // Fetch user data from the server
    axios.get('https://employee-system-8l7x.onrender.com/userProfile')
      .then(res => {
        // Assuming the server returns user data in JSON format
        setUserData(res.data);
      })
      .catch(err => {
        console.error('Error fetching user data:', err);
      });
  }, []);

  return (
    <div>
      <h2>My Profile</h2>
      {userData ? (
        <div>
          <p><strong>Name:</strong> {userData.name}</p>
          <p><strong>Email:</strong> {userData.email}</p>
          <p><strong>Salary:</strong> {userData.salary}</p>
          <p><strong>Role:</strong> {userData.role}</p>
        </div>
      ) : (
        <p>Loading user data...</p>
      )}
    </div>
  );
}

export default Profile;
