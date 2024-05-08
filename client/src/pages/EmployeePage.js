import React, { useEffect, useState } from 'react'
import Axios from 'axios'
import AddEmployee from '../components/AddEmployee';
import Button from '@mui/material/Button';
import DeleteIcon from '@mui/icons-material/Delete';

const EmployeePage = () => {
    const [id, setId] = useState(null);
    const [employees, setEmployees] = useState([]);
    const employee_id = 1;
    const business_id = 1;
    
    const handleRemoveEmployee = (e) => {
        e.preventDefault()
        Axios.delete('http://localhost:8080/employee/:business_id/:employee_id', {
            business_id: business_id, employee_id: employee_id
        }).then((response) => {
          console.log(response);
        })
    }

    useEffect(() => {
        const storedId = JSON.parse(localStorage.getItem("id"));
        if (storedId && storedId.business_id) {
            setId(storedId.business_id);
    
            Axios.get(`http://localhost:8080/employees/${storedId.business_id}`)
                .then(({data}) => {
                    setEmployees(data);
                    console.log(employees)
                })
                .catch(error => {
                    console.error('Error fetching business data:', error);
                });
        }
    }, []);
    return (
        <div className="container mx-auto">
        <h1 className="text-4xl flex justify-center font-bold mb-12">Employee Information</h1>
        <div className="overflow-x-auto">
            <AddEmployee />
            <div className="min-w-full overflow-y-auto">
                <table className="table-auto border-collapse ">
                    <thead>
                        <tr className='bg-blue-300 bg-opacity-50'>
                            <th className="px-8 py-2">Employee ID</th>
                            <th className="px-8 py-2">First Name</th>
                            <th className="px-8 py-2">Last Name</th>
                            <th className="px-8 py-2">Email</th>
                            <th className="px-8 py-2">Phone</th>
                            <th className="px-8 py-2">Address</th>
                            <th className="px-8 py-2">Salary</th>
                        </tr>
                    </thead>
                    <tbody>
                        {employees.map(employee => (
                            <tr key={employee.EMPLOYEE_ID}>
                                <td className="px-8 py-2">{employee.EMPLOYEE_ID}</td>
                                <td className="px-8 py-2">{employee.FIRST_NAME}</td>
                                <td className="px-8 py-2">{employee.LAST_NAME}</td>
                                <td className="px-8 py-2">{employee.EMAIL}</td>
                                <td className="px-8 py-2">{employee.PHONE}</td>
                                <td className="px-8 py-2">{employee.ADDRESS}</td>
                                <td className="px-8 py-2">{employee.SALARY}</td>
                            </tr>
                        ))}
                        <Button variant="outlined" startIcon={<DeleteIcon />} onClick={() => handleRemoveEmployee()}>
                            Remove
                        </Button>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
    )
}

export default EmployeePage