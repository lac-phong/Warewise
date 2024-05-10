import React from 'react'
import TextField from "@mui/material/TextField";
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import OrderList from "../components/OrderList"
import MakeOrder from '../components/MakeOrder';
import "../Styling/OrderPage.css";

function OrderPage() {
  return (
    <div className="main">
      <h1>Your Orders</h1>
      <div>
        <MakeOrder />
      </div>
      <div>
        <OrderList />
      </div>
    </div>
  );
}

export default OrderPage;

