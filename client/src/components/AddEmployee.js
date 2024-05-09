import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import Axios from 'axios';
import * as React from 'react';
import { useContext, useState } from 'react';
import { UserContext } from '../UserContext.js';

export default function AddEmployee({ onAddEmployee }) {
    const [open, setOpen] = React.useState(false);
    const [firstName, setFirstName] = useState();
    const [lastName, setLastName] = useState();
    const [email, setEmail] = useState();
    const [phone, setPhone] = useState();
    const [address, setAddress] = useState();
    const [salary, setSalary] = useState();
    const { businessId } = useContext(UserContext);

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
        
        //error handling
        const errors = [];

        if (!firstName || !lastName || !email || !phone || !address || !salary) {
            errors.push('Please fill in all fields.');
        }
        else {
            const parsedSalary = parseFloat(salary);
            if (isNaN(parsedSalary) || parsedSalary < 0) {
                errors.push('Please enter a valid number for Salary.');
            }
            const phoneRegex = /^\d{10}$/; 
            if (!phoneRegex.test(phone)) {
                errors.push('Please enter a valid 10-digit phone number.');
            }
        }
        if (errors.length > 0) {
            alert(errors.join('\n'));
            return;
        }

        const employee = {
            business_id: businessId, 
            first_name: firstName, 
            last_name: lastName, 
            email: email, 
            phone: phone, 
            address: address, 
            salary: parseFloat(salary)
        }
        onAddEmployee(employee);
        handleClose();
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