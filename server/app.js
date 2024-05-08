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

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).send({ error: 'Unauthorized' });
    }

    jwt.verify(token, jwtSecret, (err, user) => {
        if (err) {
            return res.status(403).send({ error: 'Forbidden' });
        }
        req.user = user;
        next();
    });
};

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
            username: userInfo.USERNAME,
            business_id: userInfo.BUSINESS_ID
        };

        jwt.sign(tokenPayload, jwtSecret, {}, (err, token) => {
            if (err) throw err;
            res.cookie('token', token).json(tokenPayload);
        });
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});


// INTERNAL: get all businesses
app.get('/businesses', authenticateToken, async (req, res) => {
    try {
        const businesses = await getBusinesses();
        res.send(businesses);
    } catch (error) {
        console.error('Error fetching businesses:', error);
        res.status(500).send({ error: 'Internal server error' });
    }
});

app.get("/business", async (req, res) => {
    console.log('Req', req.cookies)
    const {token} = req.cookies;
    console.log('Token', token)
    if (token) {
        jwt.verify(token, jwtSecret, {}, async (err, userData) => {
            console.log('Retrieved userData:', userData);
            if (err) throw err;
            const businessInfo = await getBusinessInfo(userData.BUSINESS_ID); 
            console.log('BusinessInfo:', businessInfo); 
            res.json(businessInfo);
        });
    } else {
        res.json(null);
    }
});

// EXTERNAL: updating specific business
app.put("/business/:business_id", authenticateToken, async (req, res) => {
    const { business_name } = req.body;
    const business_id = req.params.business_id;
    const updatedBusiness = await updateBusiness(business_id, business_name);
    res.send(updatedBusiness);
});

// EXTERNAL: delete specific business
app.delete("/business/:business_id", authenticateToken, async (req, res) => {
    const business_id = req.params.business_id;
    await deleteBusiness(business_id);
    res.status(204).send();
});


// INTERNAL: get all businesses locations
app.get("/locations", authenticateToken, async (req, res) => {
    const locations = await getLocations()
    res.send(locations)
})

// EXTERNAL: get specific business location
app.get("/location/:business_id", authenticateToken, async (req, res) => {
    const business_id = req.params.business_id;
    const location = await getLocation(business_id);
    res.send(location);
});

// EXTERNAL: insert specific business location
app.post("/location", authenticateToken, async (req, res) => {
    const { business_id, address } = req.body;
    const location = await insertLocation(business_id, address);
    res.status(201).send(location);
});

// EXTERNAL: update specific business location
app.put("/location/:business_id", authenticateToken, async (req, res) => {
    const business_id = req.params.business_id;
    const { address } = req.body;
    const updatedLocation = await updateLocation(business_id, address);
    res.send(updatedLocation);
});

// EXTERNAL: delete specific business location
app.delete("/location/:business_id", authenticateToken, async (req, res) => {
    const business_id = req.params.business_id;
    await deleteLocation(business_id);
    res.status(204).send();
});


// INTERNAL: get all businesses employees
app.get("/employees", authenticateToken, async (req, res) => {
    const employees = await getEmployees()
    res.send(employees)
})

// EXTERNAL: get all employees by business
app.get("/employees/:business_id", authenticateToken, async (req, res) => {
    const business_id = req.params.business_id;
    const employees = await getEmployeesByBusiness(business_id);
    res.send(employees);
});

// EXTERNAL: get specific employee for a business
app.get("/employee/:business_id/:employee_id", authenticateToken, async (req, res) => {
    const { business_id, employee_id } = req.params;
    const employee = await getEmployeeByBusiness(business_id, employee_id);
    res.send(employee);
});

// EXTERNAL: add specific employee for a business
app.post("/employee", authenticateToken, async (req, res) => {
    const { business_id, employee_id, first_name, last_name, email, phone, address, salary } = req.body;
    const employee = await insertEmployee(business_id, employee_id, first_name, last_name, email, phone, address, salary);
    res.status(201).send(employee);
});

// EXTERNAL: update specific employee for a business
app.put("/employee/:business_id/:employee_id", authenticateToken, async (req, res) => {
    const { business_id, employee_id } = req.params;
    const { first_name, last_name, email, phone, address, salary } = req.body;
    const updatedEmployee = await updateEmployee(business_id, employee_id, first_name, last_name, email, phone, address, salary);
    res.send(updatedEmployee);
});

// EXTERNAL: delete specific employee for a business
app.delete("/employee/:business_id/:employee_id",authenticateToken, async (req, res) => {
    const { business_id, employee_id } = req.params;
    await deleteEmployee(business_id, employee_id);
    res.status(204).send();
});


app.listen(8080, () => {
    console.log('Server is running on port 8080')
})