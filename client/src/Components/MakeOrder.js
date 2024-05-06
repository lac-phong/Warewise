import * as React from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import MenuItem from '@mui/material/MenuItem';
import ListSubheader from '@mui/material/ListSubheader';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import InputBase from '@mui/material/InputBase';
import TextField from '@mui/material/TextField';

const BootstrapInput = styled(InputBase)(({ theme }) => ({
    'label + &': {
        marginTop: theme.spacing(3),
    },
    '& .MuiInputBase-input': {
        borderRadius: 4,
        position: 'relative',
        backgroundColor: theme.palette.background.paper,
        border: '1px solid #ced4da',
        fontSize: 16,
        padding: '10px 26px 10px 12px',
        transition: theme.transitions.create(['border-color', 'box-shadow']),
        // Use the system font instead of the default Roboto font.
        fontFamily: [
            '-apple-system',
            'BlinkMacSystemFont',
            '"Segoe UI"',
            'Roboto',
            '"Helvetica Neue"',
            'Arial',
            'sans-serif',
            '"Apple Color Emoji"',
            '"Segoe UI Emoji"',
            '"Segoe UI Symbol"',
        ].join(','),
        '&:focus': {
            borderRadius: 4,
            borderColor: '#80bdff',
            boxShadow: '0 0 0 0.2rem rgba(0,123,255,.25)',
        },
    },
}));

export default function GroupedSelect() {
    const [open, setOpen] = React.useState(false);
    const [age, setAge] = React.useState('');

    const handleChange = (event) => {
        setAge(Number(event.target.value) || '');
    };

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = (event, reason) => {
        if (reason !== 'backdropClick') {
        setOpen(false);
        }
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
                            <FormControl sx={{ m: 1, minWidth: 120 }}>
                                <InputLabel htmlFor="grouped-select">Product</InputLabel>
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
                            <TextField sx={{
                                m: 1,
                                width: 100,
                                maxWidth: '100%',
                            }} label="Quantity" id="Quantity" />
                        </div>
                        <div>
                            <p>Total: PLACEHOLDER</p>
                        </div>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button onClick={handleClose}>Place order</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}