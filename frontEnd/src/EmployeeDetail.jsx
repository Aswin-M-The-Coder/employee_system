import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'

function EmployeeDetail() {
    const {id} = useParams();
    const navigate = useNavigate()
    const [employee, setEmployee] = useState([])
    useEffect(()=> {
        axios.get('https://employee-system-8l7x.onrender.com/get/'+id)
        .then(res => setEmployee(res.data.Result[0]))
        .catch(err => console.log(err));
    })
    const handleLogout = () => {
		axios.get('https://employee-system-8l7x.onrender.com/logout')
		.then(res => {
			navigate('/start')
		}).catch(err => console.log(err));
	}
  return (
    <div>
        <div className='d-flex justify-content-center flex-column align-items-center mt-3'>
            {/* <img src={`https://employee-system-8l7x.onrender.com/images/`+employee.image} alt="" className='empImg'/> */}
            <div className='d-flex align-items-center flex-column mt-5'>
                <h3>Name: {employee.name}</h3>
                <h3>Email: {employee.email}</h3>
                <h3>Salary: {employee.salary}</h3>
            </div>
            <div>
                <Link to={`/EditEmployee/${employee.id}`} className='btn btn-primary btn-sm me-2'>edit</Link>
                <button className='btn btn-danger' onClick={handleLogout}>Logout</button>
            </div>
        </div>
    </div>
  )
}

export default EmployeeDetail