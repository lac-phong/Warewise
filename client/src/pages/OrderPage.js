import React from 'react'
import TextField from "@mui/material/TextField";
import OrderList from "../Components/OrderList.js"
import "../Styling/OrderPage.css";

function OrderPage() {
  return (
    <div className="main">
      <h1>Your Orders</h1>
      <div>
        <button>thing1</button>
        <button>thing2</button>
      </div>
      <div className="search">
        <TextField
          id="outlined-basic"
          variant="outlined"
          fullWidth
          label="Search for a specific order by date, product, supplier..."
        />
      </div>
      <OrderList />
    </div>
  );
}

export default OrderPage;

