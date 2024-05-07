import Axios from "axios"
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/LoginPage.js';
import Register from './pages/RegisterPage.js';
import Account from './pages/AccountPage.js';
import AddSupplier from "./pages/AddSupplier.js";

function App() {
  return (
    <BrowserRouter>
      <Routes>
      <Route path="/" element={<Login/>} />
        <Route path="/register" element={<Register/>} />
        <Route path="/account" element={<Account/>} />
        <Route path="/register" element={<Register/>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
