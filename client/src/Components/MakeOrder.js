import * as React from 'react';
import { useState, useEffect } from 'react';
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
    const [user, setUser] = useState([])
    const [open, setOpen] = React.useState(false);
    const [suppliers, setSuppliers] = useState([])
    const [products, setProducts] = useState([{ product_name: '', category_name: '', product_description: '',  quantity: '', price: '' }]);
    const [selectedSupplier, setSelectedSupplier] = useState([]);

    useEffect(() => {
        Axios.get(`http://localhost:8080/business`, {withCredentials: true}).then(({data}) => {
          setUser(data);
        });
        fetchSuppliers()
      }, []);

    const fetchSuppliers = async () => {
        try {
            const response = await Axios.get('http://localhost:8080/suppliers', { withCredentials: true })
            setSuppliers(response.data)
        } catch (error) {
            console.log('Error fetching supplier data:',error)
        }
    }

    const handleAddProduct = () => {
        setProducts([...products, { product_name: '', category_name: '', product_description: '',  quantity: '', price: '' }]);
    };
    
    const handleSupplierSelect = (event) => {
        const s = event.target.value;
        setSelectedSupplier(s);
    };
       

    const handleRemoveProduct = (index) => {
        const updatedProducts = [...products];
        updatedProducts.splice(index, 1);
        setProducts(updatedProducts);
    };

    const handleProductChange = (index, event) => {
        const updatedProducts = [...products];
        updatedProducts[index].product_name = event.target.value;
        setProducts(updatedProducts);
    };

    const handleQuantityChange = (index, event) => {
        const updatedProducts = [...products];
        updatedProducts[index].quantity = event.target.value;
        setProducts(updatedProducts);
    };

    const handleCategoryChange = (index, event) => {
        const updatedProducts = [...products];
        updatedProducts[index].category_name = event.target.value;
        setProducts(updatedProducts);
    };

    const handleDescriptionChange = (index, event) => {
        const updatedProducts = [...products];
        updatedProducts[index].product_description = event.target.value;
        setProducts(updatedProducts);
    };

    const handlePriceChange = (index, event) => {
        const updatedProducts = [...products];
        updatedProducts[index].price = event.target.value;
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
        try {
            Axios.post('http://localhost:8080/allOrders', {
            supplier_id: selectedSupplier, products: products
            }, {withCredentials: true}).then((response) => {
            console.log(response);
            })
        } catch(error) {
            console.log('Error creating order:',error)
        }
        
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
                                <Select
                                    defaultValue=""
                                    id="grouped-select"
                                    label="Grouping"
                                    value={selectedSupplier.SUPPLIER_ID}
                                    onChange={(e) => handleSupplierSelect(e)} // Pass the function directly without invoking it
                                >
                                    {suppliers.map((supplier) => (
                                        <MenuItem key={supplier.SUPPLIER_ID} value={supplier.SUPPLIER_ID}>{supplier.SUPPLIER_NAME}</MenuItem>
                                    ))}
                                </Select>

                            </FormControl>
                        </div>
                        <div>
                            {products.map((product, index) => (
                                <div key={index}>
                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                    <TextField
                                    sx={{ m: 1, width: 200, maxWidth: '100%' }}
                                    label="Product"
                                    value={product.product_name}
                                    onChange={(e) => handleProductChange(index, e)}
                                    id={`product-name-${index}`}
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
                                <TextField
                                    sx={{ m: 1, width: 200, maxWidth: '100%' }}
                                    label="Category"
                                    value={product.category_name}
                                    onChange={(e) => handleCategoryChange(index, e)}
                                    id={`product-category-${index}`}
                                />
                                <TextField
                                    sx={{ m: 1, width: 200, maxWidth: '100%' }}
                                    label="Description"
                                    value={product.product_description}
                                    onChange={(e) => handleDescriptionChange(index, e)}
                                    id={`product-description-${index}`}
                                />
                                <TextField
                                    sx={{ m: 1, width: 200, maxWidth: '100%' }}
                                    label="Quantity"
                                    value={product.quantity}
                                    onChange={(e) => handleQuantityChange(index, e)}
                                    id={`quantity-${index}`}
                                />
                                <TextField
                                    sx={{ m: 1, width: 200, maxWidth: '100%' }}
                                    label="Price"
                                    value={product.price}
                                    onChange={(e) => handlePriceChange(index, e)}
                                    id={`price-${index}`}
                                />
                                </div>
                            ))}
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