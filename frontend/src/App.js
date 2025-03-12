import React, { useState } from 'react';
import EmployeeList from './components/EmployeeList';
import AddEmployee from './components/AddEmployee';
import './styles/App.css';

function App() {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleEmployeeAdded = () => {
    // Increment the refresh trigger to cause the EmployeeList to refresh
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>Employee Management Dashboard</h1>
      </header>
      
      <main className="app-main">
        <div className="container">
          <AddEmployee onEmployeeAdded={handleEmployeeAdded} />
          <EmployeeList key={refreshTrigger} />
        </div>
      </main>
      
      <footer className="app-footer">
        <p>&copy; {new Date().getFullYear()} Employee Management Dashboard</p>
      </footer>
    </div>
  );
}

export default App;
