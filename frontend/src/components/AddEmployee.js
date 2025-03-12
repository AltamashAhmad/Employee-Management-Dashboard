import React, { useState } from 'react';
import api from '../services/api';
import '../styles/AddEmployee.css';

const AddEmployee = ({ onEmployeeAdded }) => {
  const initialFormState = {
    name: '',
    position: '',
    department: '',
    email: '',
    phone: ''
  };

  const [formData, setFormData] = useState(initialFormState);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!formData.position.trim()) {
      newErrors.position = 'Position is required';
    }
    
    if (!formData.department.trim()) {
      newErrors.department = 'Department is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      await api.addEmployee(formData);
      setSuccessMessage('Employee added successfully!');
      setFormData(initialFormState); // Reset form
      
      if (onEmployeeAdded) {
        onEmployeeAdded(); // Refresh employee list
      }
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage('');
      }, 3000);
    } catch (err) {
      console.error('Error adding employee:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="add-employee-container">
      <h2>Add New Employee</h2>
      
      {successMessage && (
        <div className="success-message">
          {successMessage}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="add-name">Name</label>
          <input
            type="text"
            id="add-name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className={errors.name ? 'error' : ''}
            placeholder="Enter employee name"
          />
          {errors.name && <span className="error-message">{errors.name}</span>}
        </div>
        
        <div className="form-group">
          <label htmlFor="add-position">Position</label>
          <input
            type="text"
            id="add-position"
            name="position"
            value={formData.position}
            onChange={handleChange}
            className={errors.position ? 'error' : ''}
            placeholder="Enter employee position"
          />
          {errors.position && <span className="error-message">{errors.position}</span>}
        </div>
        
        <div className="form-group">
          <label htmlFor="add-department">Department</label>
          <input
            type="text"
            id="add-department"
            name="department"
            value={formData.department}
            onChange={handleChange}
            className={errors.department ? 'error' : ''}
            placeholder="Enter employee department"
          />
          {errors.department && <span className="error-message">{errors.department}</span>}
        </div>
        
        <div className="form-group">
          <label htmlFor="add-email">Email</label>
          <input
            type="email"
            id="add-email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={errors.email ? 'error' : ''}
            placeholder="Enter employee email"
          />
          {errors.email && <span className="error-message">{errors.email}</span>}
        </div>
        
        <div className="form-group">
          <label htmlFor="add-phone">Phone Number</label>
          <input
            type="text"
            id="add-phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className={errors.phone ? 'error' : ''}
            placeholder="Enter employee phone number"
          />
          {errors.phone && <span className="error-message">{errors.phone}</span>}
        </div>
        
        <button 
          type="submit" 
          className="submit-btn" 
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Adding...' : 'Add Employee'}
        </button>
      </form>
    </div>
  );
};

export default AddEmployee; 