const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Data file path
const dataFilePath = path.join(__dirname, 'data', 'employees.json');

// Ensure data directory exists
if (!fs.existsSync(path.join(__dirname, 'data'))) {
  fs.mkdirSync(path.join(__dirname, 'data'));
}

// Initialize employees data if it doesn't exist
if (!fs.existsSync(dataFilePath)) {
  const initialData = {
    employees: [
      {
        id: 1,
        name: 'John Doe',
        position: 'Software Engineer',
        department: 'Engineering',
        email: 'john.doe@example.com',
        phone: '123-456-7890'
      },
      {
        id: 2,
        name: 'Jane Smith',
        position: 'Product Manager',
        department: 'Product',
        email: 'jane.smith@example.com',
        phone: '098-765-4321'
      }
    ]
  };
  fs.writeFileSync(dataFilePath, JSON.stringify(initialData, null, 2));
}

// Helper functions for data operations
const readData = () => {
  const data = fs.readFileSync(dataFilePath, 'utf8');
  return JSON.parse(data);
};

const writeData = (data) => {
  fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2));
};

// API Routes

// GET all employees
app.get('/employees', (req, res) => {
  const data = readData();
  res.json(data.employees);
});

// GET employee by ID
app.get('/employees/:id', (req, res) => {
  const data = readData();
  const employee = data.employees.find(emp => emp.id === parseInt(req.params.id));
  
  if (!employee) {
    return res.status(404).json({ message: 'Employee not found' });
  }
  
  res.json(employee);
});

// POST new employee
app.post('/employees', (req, res) => {
  const data = readData();
  const newEmployee = req.body;
  
  // Generate new ID (max ID + 1)
  const maxId = data.employees.length > 0 
    ? Math.max(...data.employees.map(emp => emp.id)) 
    : 0;
  newEmployee.id = maxId + 1;
  
  data.employees.push(newEmployee);
  writeData(data);
  
  res.status(201).json(newEmployee);
});

// PUT update employee
app.put('/employees/:id', (req, res) => {
  const data = readData();
  const id = parseInt(req.params.id);
  const updatedEmployee = req.body;
  
  const index = data.employees.findIndex(emp => emp.id === id);
  
  if (index === -1) {
    return res.status(404).json({ message: 'Employee not found' });
  }
  
  // Preserve the ID
  updatedEmployee.id = id;
  data.employees[index] = updatedEmployee;
  
  writeData(data);
  
  res.json(updatedEmployee);
});

// DELETE employee
app.delete('/employees/:id', (req, res) => {
  const data = readData();
  const id = parseInt(req.params.id);
  
  const index = data.employees.findIndex(emp => emp.id === id);
  
  if (index === -1) {
    return res.status(404).json({ message: 'Employee not found' });
  }
  
  const deletedEmployee = data.employees[index];
  data.employees.splice(index, 1);
  
  writeData(data);
  
  res.json(deletedEmployee);
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 