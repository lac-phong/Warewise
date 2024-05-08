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

export default function AddEmployee() {
    const [open, setOpen] = React.useState(false);
    const business_id = 1;
    const [firstName, setFirstName] = useState();
    const [lastName, setLastName] = useState();
    const [email, setEmail] = useState();
    const [phone, setPhone] = useState();
    const [address, setAddress] = useState();
    const [salary, setSalary] = useState();

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = (reason) => {
        if (reason !== 'backdropClick') {
        setOpen(false);
        }
    };

    const handleAddEmployee = (e) => {
        e.preventDefault()
        Axios.post('http://localhost:8080/employee', {
            business_id: business_id, first_name: firstName, last_name: lastName, email: email, phone: phone, address: address, salary: salary
        }).then((response) => {
          console.log(response);
        })
    }

    return (
        <div>
            <Button onClick={handleClickOpen}>Add employee</Button>
            <Dialog disableEscapeKeyDown open={open} onClose={handleClose}>
                <DialogTitle>Add Employee</DialogTitle>
                <DialogContent>
                    <Box component="form" sx={{ display: 'flex', flexDirection: 'column' }}>
                        <div>
                            <TextField
                                sx={{ m: 1, width: 200, maxWidth: '100%' }}
                                label="First Name"
                                onChange={(e) => setFirstName(e.target.value)}
                            />
                            <TextField
                                sx={{ m: 1, width: 200, maxWidth: '100%' }}
                                label="Last Name"
                                onChange={(e) => setLastName(e.target.value)}
                            />
                            <TextField
                                sx={{ m: 1, width: 250, maxWidth: '100%' }}
                                label="Email"
                                onChange={(e) => setEmail(e.target.value)}
                            />
                            <TextField
                                sx={{ m: 1, width: 200, maxWidth: '100%' }}
                                label="Phone"
                                onChange={(e) => setPhone(e.target.value)}
                            />
                            <TextField
                                sx={{ m: 1, width: 450, maxWidth: '100%' }}
                                label="Address"
                                onChange={(e) => setAddress(e.target.value)}
                            />
                            <TextField
                                sx={{ m: 1, width: 200, maxWidth: '100%' }}
                                label="Salary"
                                onChange={(e) => setSalary(e.target.value)}
                            />
                        </div>
                    </Box>
                </DialogContent>
                <DialogActions sx={{ m: 1 }}>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button onClick={handleAddEmployee}>Add employee</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}