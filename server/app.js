import cors from 'cors'
import express from 'express'

import { 
    getBusinesses,
    getBusinessId,
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

    getOrders,
    getOrderDetailsById,
    getOrderBySupplier,
    getOrderByDate,
    getOrderBeforeDate,
    getOrderAfterDate,
    getOrderBetweenDates,
    getOrderDetailsByProduct,
    getOrderDetailsByPrice,
    getOrderBelowPrice,
    getOrderAbovePrice,
    getOrderBetweenPrices,
    insertOrderWithDetails,
    updateOrderDetails,
    deleteOrder,

    getSuppliers,
    getSupplier,
    getSupplierInfo,
    insertSupplier,
    updateSupplier,
    deleteSupplier

} from './database.js'

const app = express()

app.use(express.json())
app.use(cors())

app.post('/register', async (req, res) => {
    const { username, password, business_name } = req.body
    const user = await insertBusiness( username, password, business_name )
    res.status(201).send(user)
})

app.post('/login', async (req, res) => {
    const { username, password } = req.body
    const user = await getBusinessId( username, password )
    res.send(user)
})


// INTERNAL: get all businesses
app.get("/businesses", async (req, res) => {
    const businesses = await getBusinesses()
    res.send(businesses)
})

// EXTERNAL: updating specific business
app.put("/business/:business_id", async (req, res) => {
    const { business_name } = req.body;
    const business_id = req.params.business_id;
    const updatedBusiness = await updateBusiness(business_id, business_name);
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
    const { business_id, employee_id, first_name, last_name, email, phone, address, salary } = req.body;
    const employee = await insertEmployee(business_id, employee_id, first_name, last_name, email, phone, address, salary);
    res.status(201).send(employee);
});

// EXTERNAL: update specific employee for a business
app.put("/employee/:business_id/:employee_id", async (req, res) => {
    const { business_id, employee_id } = req.params;
    const { first_name, last_name, email, phone, address, salary } = req.body;
    const updatedEmployee = await updateEmployee(business_id, employee_id, first_name, last_name, email, phone, address, salary);
    res.send(updatedEmployee);
});

// EXTERNAL: delete specific employee for a business
app.delete("/employee/:business_id/:employee_id", async (req, res) => {
    const { business_id, employee_id } = req.params;
    await deleteEmployee(business_id, employee_id);
    res.status(204).send();
});

app.get("/orders/:business_id", async (req, res) => {
    const business_id = req.params.business_id;
    const orders = await getOrders(business_id);
    res.send(orders);
});

app.get("/orders/:business_id/:order_id", async (req, res) => {
    const { order_id, business_id } = req.params;
    const orders = await getOrderDetailsById(order_id, business_id);
    res.send(orders);
});

app.get("/orders/:business_id/:supplier_id", async (req, res) => {
    const { business_id, supplier_id } = req.params;
    const orders = await getOrderBySupplier(business_id, supplier_id);
    res.status(201).send(orders);
});

app.get("/orders/:business_id/:order_date", async (req, res) => {
    const { business_id, order_date } = req.params;
    const orders = await getOrderByDate(business_id, order_date);
    res.send(orders);
});

app.get("/orders/:business_id/:order_date", async (req, res) => {
    const { business_id, order_date } = req.params;
    const orders = await getOrderBeforeDate(business_id, order_date);
    res.send(orders);
});

app.get("/orders/:business_id/:order_date", async (req, res) => {
    const { business_id, order_date } = req.params;
    const orders = await getOrderAfterDate(business_id, order_date);
    res.send(orders);
});

app.get("/orders/:business_id/:order_date", async (req, res) => {
    const { business_id, order_date } = req.params;
    const orders = await getOrderBetweenDates(business_id, order_date);
    res.send(orders);
});

app.get("/orders/:business_id/:product_id", async (req, res) => {
    const { business_id, product_id } = req.params;
    const orders = await getOrderDetailsByProduct(business_id, product_id);
    res.send(orders);
});

app.get("/orders/:business_id/:price", async (req, res) => {
    const { business_id, price } = req.params;
    const orders = await getOrderDetailsByPrice(business_id, price);
    res.send(orders);
});

app.get("/orders/:business_id/:price", async (req, res) => {
    const { business_id, price } = req.params;
    const orders = await getOrderBelowPrice(business_id, price);
    res.send(orders);
});

app.get("/orders/:business_id/:price", async (req, res) => {
    const { business_id, price } = req.params;
    const orders = await getOrderAbovePrice(business_id, price);
    res.send(orders);
});

app.get("/orders/:business_id/:price", async (req, res) => {
    const { business_id, price } = req.params;
    const orders = await getOrderBetweenPrices(business_id, price);
    res.send(orders);
});

app.post("/orders/:business_id/:supplier_id/:product_id/:quantity/:price", async (req, res) => {
    const { business_id, supplier_id, product_id, quantity, price } = req.params;
    const orders = await insertOrderWithDetails(business_id, supplier_id, product_id, quantity, price);
    res.status(201).send(orders);
});

app.put("/orders/:business_id/:order_id/:product_id/:quantity/:price", async (req, res) => {
    const { business_id, supplier_id, product_id, quantity, price } = req.params;
    const orders = await updateOrderDetails(business_id, supplier_id, product_id, quantity, price);
    res.send(orders);
});

// EXTERNAL: delete specific employee for a business
app.delete("/orders/:business_id/:order_id", async (req, res) => {
    const { business_id, order_id } = req.params;
    await deleteOrder(business_id, order_id);
    res.status(204).send();
});

app.get("/suppliers/:business_id", async (req, res) => {
    const business_id = req.params.business_id;
    const suppliers = await getSuppliers(business_id);
    res.send(suppliers);
});

// EXTERNAL: get specific employee for a business
app.get("/suppliers/:business_id/:supplier_id", async (req, res) => {
    const { business_id, supplier_id } = req.params;
    const supplier = await getSupplier(business_id, supplier_id);
    res.send(supplier);
});

app.get("/suppliers/:business_id/:supplier_id", async (req, res) => {
    const { business_id, supplier_id } = req.params;
    const supplier = await getSupplierInfo(business_id, supplier_id);
    res.send(supplier);
});

// EXTERNAL: add specific employee for a business
app.post("/suppliers/:business_id", async (req, res) => {
    const { business_id, supplier_name, supplier_email, supplier_phone, supplier_address, supplier_category } = req.body;
    const supplier = await insertSupplier(business_id, supplier_name, supplier_email, supplier_phone, supplier_address, supplier_category);
    res.status(201).send(supplier);
});

// EXTERNAL: update specific employee for a business
app.put("/suppliers/:business_id/:supplier_id", async (req, res) => {
    const { business_id, supplier_id } = req.params;
    const { supplier_name, supplier_email, supplier_phone, supplier_address, supplier_category } = req.body;
    const updatedSupplier = await updateEmployee(business_id, supplier_id, supplier_name, supplier_email, supplier_phone, supplier_address, supplier_category);
    res.send(updatedSupplier);
});

// EXTERNAL: delete specific employee for a business
app.delete("/suppliers/:business_id/:supplier_id", async (req, res) => {
    const { business_id, supplier_id } = req.params;
    await deleteSupplier(business_id, supplier_id);
    res.status(204).send();
});

app.listen(8080, () => {
    console.log('Server is running on port 8080')
})