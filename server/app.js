import cors from 'cors'
import express from 'express'

import {
    getAccountPage,
  
    getBusiness,
    getBusinesses,
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

const app = express()

app.use(express.json())
app.use(cors())

app.post('/register', async (req, res) => {
    const { username, password } = req.body
    const user = await insertAccount( username, password )
    res.status(201).send(user)
})

app.post('/login', async (req, res) => {
    const { username, password } = req.body
    const user = await getAccount( username, password )
    res.send(user)
})


// INTERNAL: get all businesses
app.get("/businesses", async (req, res) => {
    const businesses = await getBusinesses()
    res.send(businesses)
})

// EXTERNAL: get specific business account page
app.get("/account_page/:business_id", async (req, res) => {
    const id = req.params.business_id
    const account_page = await getAccountPage(id)
    res.send(account_page)
})

// EXTERNAL: get specific business
app.get("/business/:business_id", async (req, res) => {
    const id = req.params.business_id
    const business = await getBusiness(id)
    res.send(business)
})

// EXTERNAL: insert specific business
app.post("/business", async (req, res) => {
    const { username, password, business_name } = req.body
    const business = await insertBusiness(username, password, business_name)
    res.status(201).send(business)
})

// EXTERNAL: updating specific business
app.put("/business/:business_id", async (req, res) => {
    const { account_id, business_name } = req.body;
    const business_id = req.params.business_id;
    const updatedBusiness = await updateBusiness(business_id, account_id, business_name);
    res.send(updatedBusiness);
});

// EXTERNAL: delete specific business
app.delete("/business/:business_id", async (req, res) => {
    const business_id = req.params.business_id;
    await deleteBusiness(business_id);
    res.status(204).send();
});


// INTERNAL: get all businesses locations
app.get("/locations", async (req, res) => {
    const locations = await getLocations()
    res.send(locations)
})

// EXTERNAL: get specific business location
app.get("/location/:business_id", async (req, res) => {
    const business_id = req.params.business_id;
    const location = await getLocation(business_id);
    res.send(location);
});

// EXTERNAL: insert specific business location
app.post("/location", async (req, res) => {
    const { business_id, address } = req.body;
    const location = await insertLocation(business_id, address);
    res.status(201).send(location);
});

// EXTERNAL: update specific business location
app.put("/location/:business_id", async (req, res) => {
    const business_id = req.params.business_id;
    const { address } = req.body;
    const updatedLocation = await updateLocation(business_id, address);
    res.send(updatedLocation);
});

// EXTERNAL: delete specific business location
app.delete("/location/:business_id", async (req, res) => {
    const business_id = req.params.business_id;
    await deleteLocation(business_id);
    res.status(204).send();
});


// INTERNAL: get all businesses employees
app.get("/employees", async (req, res) => {
    const employees = await getEmployees()
    res.send(employees)
})

// EXTERNAL: get all employees by business
app.get("/employees/:business_id", async (req, res) => {
    const business_id = req.params.business_id;
    const employees = await getEmployeesByBusiness(business_id);
    res.send(employees);
});

// EXTERNAL: get specific employee for a business
app.get("/employee/:business_id/:employee_id", async (req, res) => {
    const { business_id, employee_id } = req.params;
    const employee = await getEmployeeByBusiness(business_id, employee_id);
    res.send(employee);
});

// EXTERNAL: add specific employee for a business
app.post("/employee", async (req, res) => {
    const { business_id, first_name, last_name, email, phone, address, salary } = req.body;
    try {
        const employee = await insertEmployee(business_id, first_name, last_name, email, phone, address, salary);
        res.status(201).send(employee);
    } catch (error) {
        res.status(400).send({ message: error.message });
    }
});

// EXTERNAL: update specific employee for a business
app.put("/employee/:business_id/:employee_id", async (req, res) => {
    const { business_id, employee_id } = req.params;
    const { first_name, last_name, email, phone, address, salary } = req.body;
    try {
        const updatedEmployee = await updateEmployee(business_id, employee_id, first_name, last_name, email, phone, address, salary);
        res.send(updatedEmployee);
    } catch (error) {
        res.status(400).send({ message: error.message });
    }
});

// EXTERNAL: delete specific employee for a business
app.delete("/employee/:business_id/:employee_id", async (req, res) => {
    const { business_id, employee_id } = req.params;
    try {
        await deleteEmployee(business_id, employee_id);
        res.status(204).send();
    } catch (error) {
        res.status(404).send({ message: error.message });
    }
});


app.listen(8080, () => {
    console.log('Server is running on port 8080')
})