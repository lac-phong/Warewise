import Axios from "axios"
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './Pages/LoginPage.js';
import Register from './Pages/RegisterPage.js';
import Account from './Pages/AccountPage.js';
import Order from './Pages/OrderPage.js'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Account/>} />
        <Route path="/login" element={<Login/>} />
        <Route path="/register" element={<Register/>} />
        <Route path="/order" element={<Order/>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
