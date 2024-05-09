import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/LoginPage.js';
import Register from './pages/RegisterPage.js';
import Account from './pages/AccountPage.js';
import Employee from './pages/EmployeePage.js';
import Layout from './components/Layout.js';
import AddSupplier from './pages/AddSupplier.js';
import Inventory from './pages/Inventory.js';
import Order from './pages/OrderPage.js';
import Transaction from './pages/TransactionPage.js';
import { UserContextProvider } from './UserContext';

function App() {
  return (
    <Router>
      <UserContextProvider>
        <Routes>
          <Route path="/" element={<Layout />} >
            <Route index element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/account" element={<Account />} />
            <Route path="/employee" element={<Employee />} />
            <Route path="/addSupplier" element={<AddSupplier />} />
            <Route path="/inventory" element={<Inventory />} />
            <Route path="/order" element={<Order />} />
            <Route path="/transaction" element={<Transaction />} />
          </Route>
        </Routes>
      </UserContextProvider>
    </Router>
  );
}

export default App;