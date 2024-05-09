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
      <div className="search">
        <TextField
          sx={{ m: 1}}
          id="outlined-basic"
          variant="outlined"
          fullWidth
          label="Search for a specific order by date, product, supplier..."
        />
        <FormControl sx={{ m: 1, minWidth: 150 }}>
          <InputLabel htmlFor="grouped-select">Select filter</InputLabel>
          <Select defaultValue="" id="grouped-select" label="Grouping">
            <MenuItem value=""><em>None</em></MenuItem>
            <MenuItem value={1}>Date</MenuItem>
            <MenuItem value={2}>Product</MenuItem>
            <MenuItem value={3}>Supplier</MenuItem>
          </Select>
        </FormControl>
      </div>
      <OrderList />
    </div>
  );
}

export default OrderPage;

