import axios from 'axios'
import React, { useEffect, useState } from 'react'

function Home() {
  const [adminCount, setAdminCount] = useState()
  const [employeeCount, setEmployeeCount] = useState()
  const [salary, setSalary] = useState()
  const [admins, setAdmins] = useState([]);

  useEffect(() => {
    axios.get('https://employee-system-8l7x.onrender.com/adminCount')
		.then(res => {
			setAdminCount(res.data[0].admin)
		}).catch(err => console.log(err));

    axios.get('https://employee-system-8l7x.onrender.com/employeeCount')
		.then(res => {
			setEmployeeCount(res.data[0].employee)
		}).catch(err => console.log(err));

    axios.get('https://employee-system-8l7x.onrender.com/salary')
		.then(res => {
			setSalary(res.data[0].sumOfSalary)
		}).catch(err => console.log(err));

    axios.get('https://employee-system-8l7x.onrender.com/admins')
        .then(res => {
          setAdmins(res.data);
        })
        .catch(err => console.log(err));
  }, [])
  return (
    <div>
      <div className='p-3 d-flex justify-content-around mt-3'>
        <div className='px-3 pt-2 pb-3 border shadow-sm w-25'>
          <div className='text-center pb-1'>
            <h4>Admin</h4>
          </div>
          <hr />
          <div className=''>
            <h5>Total: {adminCount}</h5>
          </div>
        </div>
        <div className='px-3 pt-2 pb-3 border shadow-sm w-25'>
          <div className='text-center pb-1'>
            <h4>Employee</h4>
          </div>
          <hr />
          <div className=''>
            <h5>Total: {employeeCount}</h5>
          </div>
        </div>
        <div className='px-3 pt-2 pb-3 border shadow-sm w-25'>
          <div className='text-center pb-1'>
            <h4>Salary</h4>
          </div>
          <hr />
          <div className=''>
            <h5>Total: {salary}</h5>
          </div>
        </div>
      </div>

      {/* List of admin  */}
      <div className='mt-4 px-5 pt-3'>
        <h3>List of Admins</h3>
        <table className='table'>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
            </tr>
          </thead>
          <tbody>
          {admins.map((admin, index) => (
              <tr key={index}>
                <td>{admin.name}</td>
                <td>{admin.email}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default Home