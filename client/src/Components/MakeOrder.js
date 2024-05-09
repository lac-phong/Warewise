import * as React from 'react';
import { useState } from 'react';
import Axios from 'axios';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/AddCircle';
import Stack from '@mui/material/Stack';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import ListSubheader from '@mui/material/ListSubheader';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import TextField from '@mui/material/TextField';

export default function MakeOrder() {
    const [open, setOpen] = React.useState(false);
    const [products, setProducts] = useState([{ product: '', quantity: '' }]);
    const [businessId, setBusinessId] = useState();
    const [supplierId, setSupplierId] = useState();
    const [productId, setProductId] = useState();
    const [quantity, setQuantity] = useState();
    const [price, setPrice] = useState();

    const handleAddProduct = () => {
        setProducts([...products, { product: '', quantity: '' }]);
    };

    const handleRemoveProduct = (index) => {
        const updatedProducts = [...products];
        updatedProducts.splice(index, 1);
        setProducts(updatedProducts);
    };

    const handleProductChange = (index, event) => {
        const updatedProducts = [...products];
        updatedProducts[index].product = event.target.value;
        setProducts(updatedProducts);
    };

    const handleQuantityChange = (index, event) => {
        const updatedProducts = [...products];
        updatedProducts[index].quantity = event.target.value;
        setProducts(updatedProducts);
    };

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = (event, reason) => {
        if (reason !== 'backdropClick') {
        setOpen(false);
        }
    };

    const handleOrder = (e) => {
        e.preventDefault();
        Axios.post('http://localhost:8080/orders/:business_id/:supplier_id/:product_id/:quantity/:price', {
          business_id: businessId, supplier_id: supplierId, product_id: productId, quantity: quantity, price: price 
        }).then((response) => {
          console.log(response);
        })
        setOpen(false);
    };

    return (
        <div>
            <Button onClick={handleClickOpen}>Make a new order!</Button>
            <Dialog disableEscapeKeyDown open={open} onClose={handleClose}>
                <DialogTitle>Order</DialogTitle>
                <DialogContent>
                    <Box component="form" sx={{ display: 'flex', flexDirection: 'column' }}>
                        <div>
                            <FormControl sx={{ m: 1, minWidth: 120 }}>
                                <InputLabel htmlFor="grouped-select">Supplier</InputLabel>
                                <Select defaultValue="" id="grouped-select" label="Grouping">
                                    <MenuItem value="">
                                        <em>None</em>
                                    </MenuItem>
                                    <ListSubheader>Category 1</ListSubheader>
                                    <MenuItem value={1}>Option 1</MenuItem>
                                    <MenuItem value={2}>Option 2</MenuItem>
                                    <ListSubheader>Category 2</ListSubheader>
                                    <MenuItem value={3}>Option 3</MenuItem>
                                    <MenuItem value={4}>Option 4</MenuItem>
                                </Select>
                            </FormControl>
                        </div>
                        <div>
                            {products.map((product, index) => (
                                <div key={index} style={{ display: 'flex', alignItems: 'center' }}>
                                    <FormControl sx={{ m: 1, minWidth: 120 }}>
                                        <InputLabel htmlFor={`product-select-${index}`}>Product</InputLabel>
                                        <Select
                                            value={product.product}
                                            onChange={(e) => handleProductChange(index, e)}
                                            id={`product-select-${index}`}
                                            label="Grouping"
                                        >
                                            <MenuItem value="">
                                                <em>None</em>
                                            </MenuItem>
                                            <ListSubheader>Category 1</ListSubheader>
                                            <MenuItem value={1}>Option 1</MenuItem>
                                            <MenuItem value={2}>Option 2</MenuItem>
                                            <ListSubheader>Category 2</ListSubheader>
                                            <MenuItem value={3}>Option 3</MenuItem>
                                            <MenuItem value={4}>Option 4</MenuItem>
                                        </Select>
                                    </FormControl>
                                    <TextField
                                        sx={{ m: 1, width: 100, maxWidth: '100%' }}
                                        label="Quantity"
                                        value={product.quantity}
                                        onChange={(e) => handleQuantityChange(index, e)}
                                        id={`quantity-${index}`}
                                    />
                                    <Stack sx={{ m: 1, minWidth: 120 }} direction="row" spacing={2}>
                                        <Button variant="outlined" startIcon={<AddIcon />} onClick={handleAddProduct}>
                                            Add
                                        </Button>
                                        {products.length > 1 && (
                                            <Button variant="outlined" startIcon={<DeleteIcon />} onClick={() => handleRemoveProduct(index)}>
                                                Remove
                                            </Button>
                                        )}
                                    </Stack>
                                </div>
                            ))}
                        </div>
                        <div style={{ marginTop: '10px', marginLeft: '10px' }}>
                            <p>Total: PLACEHOLDER</p>
                        </div>
                    </Box>
                </DialogContent>
                <DialogActions sx={{ m: 1 }}>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button onClick={handleOrder}>Place order</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}