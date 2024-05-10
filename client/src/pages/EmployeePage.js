import React, { useState } from 'react';
import axios from 'axios';
import AddEmployee from '../components/AddEmployee';
import Button from '@mui/material/Button';
import DeleteIcon from '@mui/icons-material/Delete';

const EmployeePage = () => {
  const [employees, setEmployees] = useState([]);

  const fetchEmployees = async () => {
    try {
      const response = await axios.get('http://localhost:8080/employees', { withCredentials: true });
      setEmployees(response.data);
    } catch (error) {
      console.error('Error fetching employee data:', error);
    }
  };

  const handleAddEmployee = async (employee) => {
    try {
      const response = await axios.post('http://localhost:8080/employee', employee, { withCredentials: true });
      setEmployees([...employees, response.data]);
      fetchEmployees();
    } catch (error) {
      console.error('Error adding employee:', error);
    }
  };

  const handleRemoveEmployee = async (employeeId) => {
    try {
      await axios.delete(`http://localhost:8080/employee/${employeeId}`, { withCredentials: true });
      setEmployees(employees.filter((employee) => employee.EMPLOYEE_ID !== employeeId));
    } catch (error) {
      console.error('Error removing employee:', error);
    }
  };

  React.useEffect(() => {
    fetchEmployees();
  }, []);

  return (
    <div className="container mx-auto pt-4 flex flex-col items-center">
      <h1 className="text-4xl flex justify-center font-bold mb-12">Employee Information</h1>
      <div className="overflow-x-auto">
        <AddEmployee onAddEmployee={handleAddEmployee} />
        <div className="min-w-full overflow-y-auto">
          <table className="table-auto border-collapse ">
            <thead>
              <tr className="bg-blue-300 bg-opacity-50">
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
              {employees.map((employee) => (
                <tr key={employee.EMPLOYEE_ID}>
                  <td className="px-8 py-2">{employee.EMPLOYEE_ID}</td>
                  <td className="px-8 py-2">{employee.FIRST_NAME}</td>
                  <td className="px-8 py-2">{employee.LAST_NAME}</td>
                  <td className="px-8 py-2">{employee.EMAIL}</td>
                  <td className="px-8 py-2">{employee.PHONE}</td>
                  <td className="px-8 py-2">{employee.ADDRESS}</td>
                  <td className="px-8 py-2">{employee.SALARY}</td>
                  <td>
                    <Button
                      variant="outlined"
                      startIcon={<DeleteIcon />}
                      onClick={() => handleRemoveEmployee(employee.EMPLOYEE_ID)}
                    >
                      Remove
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default EmployeePage;