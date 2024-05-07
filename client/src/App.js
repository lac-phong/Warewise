import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/LoginPage.js';
import Register from './pages/RegisterPage.js';
import Account from './pages/AccountPage.js';
import Employee from './pages/EmployeePage.js';
import Layout from './components/Layout.js';
import AddSupplier from './pages/AddSupplier.js';
import Inventory from './pages/Inventory.js';
import Order from './pages/OrderPage.js';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Layout/>}>
          <Route path="/" element={<Login/>} />
          <Route path="/register" element={<Register/>} />
          <Route path="/account" element={<Account/>} />
          <Route path="/employee" element={<Employee/>} />
          <Route path="/addsupplier" element={<AddSupplier/>} />
          <Route path="/inventory" element={<Inventory/>} />
          <Route path="/order" element={<Order/>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
