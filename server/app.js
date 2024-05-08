const app = express();
import cors from 'cors'
import express from 'express'
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';

import { 
    getBusinesses,
    getBusinessId,
    getBusinessInfo,
    insertBusiness,
    updateBusiness,
    deleteBusiness,

    getLocations,
    getLocation,
    updateLocation,
    deleteLocation,

    getEmployees,
    getEmployeesByBusiness,
    getEmployeeByBusiness,
    insertEmployee,
    updateEmployee,
    deleteEmployee,

} from './database.js'

dotenv.config();
const jwtSecret = process.env.JWT_SECRET;

app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: 'http://localhost:3000', 
    credentials: true
}));

app.post('/register', async (req, res) => {
    const { username, password, business_name } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    try {
        const user = await insertBusiness(username, hashedPassword, business_name);
        res.json(user);
    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).send({ error: err.message });
    }
});

app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const userId = await getBusinessId(username);
        if (!userId) {
            return res.status(422).json('Account not found');
        }
        const userInfo = await getBusinessInfo(userId.business_id);
        console.log(password)
        const passwordMatch = bcrypt.compareSync(password, userInfo.PASSWORD);
        if (!passwordMatch) {
            return res.status(422).json('Password incorrect');
        }
        const tokenPayload = {
            business_id: userInfo.BUSINESS_ID
        };

        jwt.sign(tokenPayload, jwtSecret, {}, (err, token) => {
            if (err) throw err;
            res.cookie('token', token).json(tokenPayload);
            console.log('Token info,', tokenPayload)
        });
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});


// INTERNAL: get all businesses
app.get('/businesses', async (req, res) => {
    try {
        const businesses = await getBusinesses();
        res.send(businesses);
    } catch (error) {
        console.error('Error fetching businesses:', error);
        res.status(500).send({ error: 'Internal server error' });
    }
});

app.get("/business", async (req, res) => {
    const {token} = req.cookies;
    if (token) {
        jwt.verify(token, jwtSecret, {}, async (err, userData) => {
            console.log('Retrieved userData:', userData);
            if (err) throw err;
            const businessInfo = await getBusinessInfo(userData.business_id); 
            console.log('BusinessInfo:', businessInfo); 
            res.json(businessInfo);
        });
    } else {
        res.json(null);
    }
});

// EXTERNAL: updating specific business
app.put("/business", async (req, res) => {
    const {token} = req.cookies
    const { business_name } = req.body;
    if (token) {
        jwt.verify(token, jwtSecret, {}, async (err, userData) => {
            console.log('Retrieved userData:', userData)
            if (err) throw err
            const updatedBusiness = await updateBusiness(userData.business_id, business_name);
            res.json(updatedBusiness)
        })
    } else {
        res.status(404).json(null)
    }
});

// EXTERNAL: delete specific business
app.delete("/business/:business_id", async (req, res) => {
    const {token} = req.cookies
    if (token) {
        jwt.verify(token, jwtSecret, {}, async (err, userData) => {
            console.log('Retrieved userData:', userData)
            if (err) throw err
            const deletedBusiness = await deleteBusiness(userData.business_id);
            res.json(deletedBusiness)
        })
    } else {
        res.status(404).json(null)
    }
});

// INTERNAL: get all businesses employees
app.get("/employees", async (req, res) => {
    const {token} = req.cookies
    if (token) {
        jwt.verify(token, jwtSecret, {}, async (err, userData) => {
            console.log('Retrieved userData:', userData)
            if (err) throw err
            const employees = await getEmployeesByBusiness(userData.business_id);
            res.json(employees)
        })
    } else {
        res.status(404).json(null)
    }
})

// EXTERNAL: get specific employee for a business
app.get("/employee/:employee_id", async (req, res) => {
    const { employee_id } = req.params;
    const {token} = req.cookies
    if (token) {
        jwt.verify(token, jwtSecret, {}, async (err, userData) => {
            console.log('Retrieved userData:', userData)
            if (err) throw err
            const employee = await getEmployeeByBusiness(userData.business_id, employee_id);
            res.json(employee)
        })
    } else {
        res.status(404).json(null)
    }
});

// EXTERNAL: add specific employee for a business
app.post("/employee", async (req, res) => {
    const { first_name, last_name, email, phone, address, salary } = req.body;
    const {token} = req.cookies
    if (token) {
        jwt.verify(token, jwtSecret, {}, async (err, userData) => {
            console.log('Retrieved userData:', userData)
            if (err) throw err
            const employee = await insertEmployee(userData.business_id, first_name, last_name, email, phone, address, salary);
            res.json(employee)
        })
    } else {
        res.status(404).json(null)
    }
});

// EXTERNAL: update specific employee for a business
app.put("/employee/:employee_id", async (req, res) => {
    const { employee_id } = req.params;
    const { first_name, last_name, email, phone, address, salary } = req.body;
    const {token} = req.cookies
    if (token) {
        jwt.verify(token, jwtSecret, {}, async (err, userData) => {
            console.log('Retrieved userData:', userData)
            if (err) throw err
            const updatedEmployee = await updateEmployee(userData.business_id, employee_id, first_name, last_name, email, phone, address, salary);
            res.json(updatedEmployee)
        })
    } else {
        res.status(404).json(null)
    }
});

// EXTERNAL: delete specific employee for a business
app.delete("/employee/:employee_id", async (req, res) => {
    const { employee_id } = req.params;
    const {token} = req.cookies
    if (token) {
        jwt.verify(token, jwtSecret, {}, async (err, userData) => {
            console.log('Retrieved userData:', userData)
            if (err) throw err
            await deleteEmployee(userData.business_id, employee_id);
            res.status(204).json(null)
        })
    } else {
        res.status(404).json(null)
    }
});


app.listen(8080, () => {
    console.log('Server is running on port 8080')
})