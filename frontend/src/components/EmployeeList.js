import React, { useState, useEffect } from 'react';
import api from '../services/api';
import EmployeeDetails from './EmployeeDetails';
import '../styles/EmployeeList.css';

const EmployeeList = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const data = await api.getAllEmployees();
      setEmployees(data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch employees. Please try again later.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = async (id) => {
    try {
      const employee = await api.getEmployeeById(id);
      setSelectedEmployee(employee);
      setShowModal(true);
    } catch (err) {
      console.error('Error fetching employee details:', err);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedEmployee(null);
  };

  const handleDeleteEmployee = async (id) => {
    if (window.confirm('Are you sure you want to delete this employee?')) {
      try {
        await api.deleteEmployee(id);
        fetchEmployees(); // Refresh the list
      } catch (err) {
        console.error('Error deleting employee:', err);
      }
    }
  };

  if (loading) {
    return <div className="loading">Loading employees...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="employee-list-container">
      <h2>Employee List</h2>
      {employees.length === 0 ? (
        <p>No employees found.</p>
      ) : (
        <div className="employee-list">
          {employees.map((employee) => (
            <div key={employee.id} className="employee-card">
              <h3>{employee.name}</h3>
              <p><strong>Position:</strong> {employee.position}</p>
              <div className="employee-actions">
                <button 
                  className="view-details-btn"
                  onClick={() => handleViewDetails(employee.id)}
                >
                  View Details
                </button>
                <button 
                  className="delete-btn"
                  onClick={() => handleDeleteEmployee(employee.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && selectedEmployee && (
        <EmployeeDetails 
          employee={selectedEmployee} 
          onClose={handleCloseModal}
          onEmployeeUpdated={fetchEmployees}
        />
      )}
    </div>
  );
};

export default EmployeeList; 