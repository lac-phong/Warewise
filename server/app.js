import cors from 'cors'
import express from 'express'

import {
    getBusinessId,
    getBusinessInfo,
    insertBusiness,
    updateBusiness,
    deleteBusiness,

    getEmployeesByBusiness,
    getEmployeeByBusiness,
    insertEmployee,
    updateEmployee,
    deleteEmployee,

    insertMultipleProductOrder,
    getOrderById,
    getOrders,
    getOrderDetailsById,
    getOrderBySupplier,
    getOrderByDate,
    getOrderDetailsByProduct,
    updateOrderDetails,
    deleteOrder,

    insertSupplier, 
    getSupplierInfo, 
    getSuppliersCategories, 
    getSuppliersByCategory, 
    getSuppliers,  
    getSupplier, 
    updateSupplier, 
    deleteSupplier,

    insertCustomer,
    getCustomersByBusiness,
    getCustomerByBusiness,
    updateCustomer,
    deleteCustomer,

    insertSale,
    getSalesByBusiness,
    getSaleByBusiness,
    updateSale,
    deleteSale,

    insertBalance,
    getBalanceByBusiness,
    updateBalance,
    deleteBalance,

    insertProduct,
    getProductByNameandBusiness,
    getProductsByBusiness,
    getProductByBusiness,
    updateProduct,
    deleteProduct
} from './database.js'

const app = express()

app.use(express.json())
app.use(cors())

// ------------------------------------------------------------------------------------------------------------------------------------------------//

// --------------------------------------------------------------- LOGIN --------------------------------------------------------------------------//

// EXTERNAL: insert a new business
app.post('/register', async (req, res) => {
    const { username, password, business_name, address } = req.body;
    try {
        const newBusiness = await insertBusiness(username, password, business_name, address);
        res.status(201).json(newBusiness);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.post('/login', async (req, res) => {
    const { username, password } = req.body
    const user = await getBusinessId( username, password )
    res.send(user)
})

// ------------------------------------------------------------------------------------------------------------------------------------------------//

// ------------------------------------------------------------- BUSINESS -------------------------------------------------------------------------//

// EXTERNAL: get specific business information
app.get('/business/:business_id', async (req, res) => {
    const { business_id } = req.params;
    try {
        const businessInfo = await getBusinessInfo(business_id);
        res.json(businessInfo);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
});

// EXTERNAL: update an existing business
app.put('/business/:business_id', async (req, res) => {
    const { business_id } = req.params;
    const { username, password, business_name, address } = req.body;
    try {
        const updatedBusiness = await updateBusiness(business_id, username, password, business_name, address);
        res.json(updatedBusiness);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// EXTERNAL: delete a business
app.delete('/business/:business_id', async (req, res) => {
    const { business_id } = req.params;
    try {
        await deleteBusiness(business_id);
        res.status(204).send();
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
});

// ------------------------------------------------------------------------------------------------------------------------------------------------//

// ------------------------------------------------------------ EMPLOYEES -------------------------------------------------------------------------//

// EXTERNAL: get all employees by business
app.get('/employees/:business_id', async (req, res) => {
    const { business_id } = req.params;
    try {
        const employees = await getEmployeesByBusiness(business_id);
        res.json(employees);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// EXTERNAL: get a specific employee by business
app.get('/employee/:business_id/:employee_id', async (req, res) => {
    const { business_id, employee_id } = req.params;
    try {
        const employee = await getEmployeeByBusiness(business_id, employee_id);
        if (employee) {
            res.json(employee);
        } else {
            res.status(404).send('Employee not found');
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// EXTERNAL: insert a new employee
app.post('/employee', async (req, res) => {
    const { business_id, first_name, last_name, email, phone, address, salary } = req.body;
    try {
        const newEmployee = await insertEmployee(business_id, first_name, last_name, email, phone, address, salary);
        res.status(201).json(newEmployee);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// EXTERNAL: update an existing employee
app.put('/employee/:business_id/:employee_id', async (req, res) => {
    const { business_id, employee_id } = req.params;
    const { first_name, last_name, email, phone, address, salary } = req.body;
    try {
        const updatedEmployee = await updateEmployee(business_id, employee_id, first_name, last_name, email, phone, address, salary);
        res.json(updatedEmployee);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// EXTERNAL: delete an employee
app.delete('/employee/:business_id/:employee_id', async (req, res) => {
    const { business_id, employee_id } = req.params;
    try {
        const deletionResult = await deleteEmployee(business_id, employee_id);
        if (deletionResult.deleted) {
            res.status(204).send();
        } else {
            res.status(404).send('Employee not found to delete');
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// ------------------------------------------------------------------------------------------------------------------------------------------------//

// --------------------------------------------------------------- ORDERS -------------------------------------------------------------------------//

// EXTERNAL: insert multiple products in the same order
app.post('/allOrders', async (req, res) => {
    const { business_id, supplier_id, products } = req.body;
    try {
        const result = await insertMultipleProductOrder(business_id, supplier_id, products);
        res.status(201).json(result);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// EXTERNAL: get an order by its ID
app.get('/orders/:business_id/:order_id', async (req, res) => {
    try {
        const { business_id, order_id } = req.params;
        const order = await getOrderById(business_id, order_id);
        res.json(order);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

// EXTERNAL: get all orders for a business
app.get('/orders/:business_id', async (req, res) => {
    try {
        const { business_id } = req.params;
        const orders = await getOrders(business_id);
        res.json(orders);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

// EXTERNAL: get order details by order ID
app.get('/order-details/:business_id/:order_id', async (req, res) => {
    try {
        const { business_id, order_id } = req.params;
        const orderDetails = await getOrderDetailsById(order_id, business_id);
        res.json(orderDetails);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

// EXTERNAL: get orders by supplier
app.get('/orders-by-supplier/:business_id/:supplier_id', async (req, res) => {
    try {
        const { business_id, supplier_id } = req.params;
        const orders = await getOrderBySupplier(business_id, supplier_id);
        res.json(orders);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

// EXTERNAL: get orders by specific date
app.get('/orders-by-date/:business_id/:order_date', async (req, res) => {
    try {
        const { business_id, order_date } = req.params;
        const orders = await getOrderByDate(business_id, order_date);
        res.json(orders);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

// EXTERNAL: get order details by product name
app.get('/order-details-by-product/:business_id/:product_name', async (req, res) => {
    try {
        const { business_id, product_name } = req.params;
        const orderDetails = await getOrderDetailsByProduct(business_id, product_name);
        res.json(orderDetails);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

// EXTERNAL: update order details
app.put('/update-order/:business_id/:order_id', async (req, res) => {
    try {
        const { business_id, order_id } = req.params;
        const updates = req.body;
        const result = await updateOrderDetails(order_id, business_id, updates);
        if (result.updated) {
            res.send('Order updated successfully.');
        } else {
            res.status(404).send('Order not found.');
        }
    } catch (error) {
        res.status(500).send(error.message);
    }
});

// EXTERNAL: delete an order
app.delete('/delete-order/:business_id/:order_id', async (req, res) => {
    try {
        const { business_id, order_id } = req.params;
        const result = await deleteOrder(order_id, business_id);
        if (result.deleted) {
            res.send('Order deleted successfully.');
        } else {
            res.status(404).send('Order not found.');
        }
    } catch (error) {
        res.status(500).send(error.message);
    }
});

// ------------------------------------------------------------------------------------------------------------------------------------------------//

// ------------------------------------------------------------ SUPPLIERS -------------------------------------------------------------------------//

// EXTERNAL: insert a new supplier
app.post('/suppliers/:business_id', async (req, res) => {
    try {
        const { business_id } = req.params;
        const { supplier_name, email, phone, address, supplier_category } = req.body;
        const result = await insertSupplier(business_id, supplier_name, email, phone, address, supplier_category);
        res.status(201).send(result);
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});

// EXTERNAL: get information about a specific supplier
app.get('/suppliers/:business_id/:supplier_id', async (req, res) => {
    try {
        const { business_id, supplier_id } = req.params;
        const result = await getSupplierInfo(business_id, supplier_id);
        res.send(result);
    } catch (error) {
        res.status(404).send({ error: error.message });
    }
});

// EXTERNALl: get all suppliers for a business by categories
app.get('/suppliers/categories/:business_id', async (req, res) => {
    try {
        const { business_id } = req.params;
        const result = await getSuppliersCategories(business_id);
        res.send(result);
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});

// EXTERNAL: get suppliers by category
app.get('/suppliers/:business_id/category', async (req, res) => {
    try {
        const { business_id } = req.params;
        const { category } = req.query;
        const result = await getSuppliersByCategory(business_id, category);
        res.send(result);
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});

// EXTERNAL: get all suppliers for a business
app.get('/suppliers/:business_id', async (req, res) => {
    try {
        const { business_id } = req.params;
        const result = await getSuppliers(business_id);
        res.send(result);
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});

// EXTERNAL: get detailed information about a specific supplier
app.get('/supplier/:business_id/:supplier_id', async (req, res) => {
    try {
        const { business_id, supplier_id } = req.params;
        const result = await getSupplier(supplier_id, business_id);
        res.send(result);
    } catch (error) {
        res.status(404).send({ error: error.message });
    }
});

// Update a supplier
app.put('/supplier/:business_id/:supplier_id', async (req, res) => {
    try {
        const { business_id, supplier_id } = req.params;
        const updates = req.body;
        const result = await updateSupplier(supplier_id, business_id, updates);
        res.send(result);
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});

// Delete a supplier
app.delete('/supplier/:business_id/:supplier_id', async (req, res) => {
    try {
        const { business_id, supplier_id } = req.params;
        const result = await deleteSupplier(supplier_id, business_id);
        res.status(204).send(result);
    } catch (error) {
        res.status(404).send({ error: error.message });
    }
});

// ------------------------------------------------------------------------------------------------------------------------------------------------//

// ------------------------------------------------------------ CUSTOMERS -------------------------------------------------------------------------//

// EXTERNAL: insert a new customer
app.post('/customers/:business_id', async (req, res) => {
    const { business_id } = req.params;
    const { first_name, last_name, email, phone, address } = req.body;
    try {
        const result = await insertCustomer(business_id, first_name, last_name, email, phone, address);
        res.status(201).send(result);
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});

// EXTERNAL: get all customers for a specific business
app.get('/customers/:business_id', async (req, res) => {
    const { business_id } = req.params;
    try {
        const customers = await getCustomersByBusiness(business_id);
        res.send(customers);
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});

// EXTERNAL: get a specific customer by business
app.get('/customer/:business_id/:customer_id', async (req, res) => {
    const { business_id, customer_id } = req.params;
    try {
        const customer = await getCustomerByBusiness(customer_id, business_id);
        res.send(customer);
    } catch (error) {
        res.status(404).send({ error: error.message });
    }
});

// EXTERNAL: update a specific customer
app.put('/customer/:business_id/:customer_id', async (req, res) => {
    const { business_id, customer_id } = req.params;
    const updates = req.body;
    try {
        const result = await updateCustomer(customer_id, business_id, updates);
        res.send(result);
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});

// EXTERNAL: delete a specific customer
app.delete('/customer/:business_id/:customer_id', async (req, res) => {
    const { business_id, customer_id } = req.params;
    try {
        const result = await deleteCustomer(customer_id, business_id);
        if (result.deleted) {
            res.status(204).send({});
        } else {
            res.status(404).send({ error: 'No customer found to delete' });
        }
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});

// ------------------------------------------------------------------------------------------------------------------------------------------------//

// ---------------------------------------------------------------- SALES -------------------------------------------------------------------------//

// EXTERNAL: insert a new sale
app.post('/sales/:business_id', async (req, res) => {
    const { business_id } = req.params;
    const { product_id, quantity, order_date, payment_details } = req.body;
    try {
        const result = await insertSale(business_id, product_id, quantity, order_date, payment_details);
        res.status(201).send(result);
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});

// EXTERNAL: get all sales for a specific business
app.get('/sales/:business_id', async (req, res) => {
    const { business_id } = req.params;
    try {
        const sales = await getSalesByBusiness(business_id);
        res.send(sales);
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});

// EXTERNAL: get a specific sale by business
app.get('/sale/:business_id/:sale_id', async (req, res) => {
    const { business_id, sale_id } = req.params;
    try {
        const sale = await getSaleByBusiness(sale_id, business_id);
        res.send(sale);
    } catch (error) {
        res.status(404).send({ error: error.message });
    }
});

// EXTERNAL: update a specific sale
app.put('/sale/:business_id/:sale_id', async (req, res) => {
    const { business_id, sale_id } = req.params;
    const updates = req.body;
    try {
        const result = await updateSale(sale_id, business_id, updates);
        if (result.updated) {
            res.send(result);
        } else {
            res.status(404).send({ message: 'No sale found for update' });
        }
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});

// EXTERNAL: delete a specific sale
app.delete('/sale/:business_id/:sale_id', async (req, res) => {
    const { business_id, sale_id } = req.params;
    try {
        const result = await deleteSale(sale_id, business_id);
        if (result.deleted) {
            res.status(204).send({});
        } else {
            res.status(404).send({ message: 'No sale found to delete' });
        }
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});

// ------------------------------------------------------------------------------------------------------------------------------------------------//

// -------------------------------------------------------------- BALANCE -------------------------------------------------------------------------//

// EXTERNAL: insert a new balance
app.post('/balance/:business_id', async (req, res) => {
    const { business_id } = req.params;
    const { balance } = req.body;
    try {
        const result = await insertBalance(business_id, balance);
        res.status(201).send(result);
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});

// EXTERNAL: get balance records for a specific business
app.get('/balance/:business_id', async (req, res) => {
    const { business_id } = req.params;
    try {
        const balances = await getBalanceByBusiness(business_id);
        res.send(balances);
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});

// EXTERNAL: update a specific balance record
app.put('/balance/:business_id/:balance_id', async (req, res) => {
    const { balance_id, business_id } = req.params;
    const { new_balance } = req.body;
    try {
        const result = await updateBalance(balance_id, business_id, new_balance);
        if (result.updated) {
            res.send(result);
        } else {
            res.status(404).send({ message: 'No balance record found for update' });
        }
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});

// EXTERNAL: delete a specific balance record
app.delete('/balance/:business_id/:balance_id', async (req, res) => {
    const { balance_id, business_id } = req.params;
    try {
        const result = await deleteBalance(balance_id, business_id);
        if (result.deleted) {
            res.status(204).send({});
        } else {
            res.status(404).send({ message: 'No balance record found to delete' });
        }
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});

// ------------------------------------------------------------------------------------------------------------------------------------------------//

// ------------------------------------------------------------- PRODUCTS -------------------------------------------------------------------------//

// EXTERNAL: insert a new product
app.post('/products/:business_id', async (req, res) => {
    const { business_id } = req.params;
    const { category_name, product_name, product_description, quantity, reorder_level, reorder_quantity, price, supplier_id } = req.body;
    try {
        const result = await insertProduct(business_id, category_name, product_name, product_description, quantity, reorder_level, reorder_quantity, price, supplier_id);
        res.status(201).send(result);
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});

// EXTERNAL: get all products for a specific business
app.get('/products/:business_id', async (req, res) => {
    const { business_id } = req.params;
    try {
        const products = await getProductsByBusiness(business_id);
        res.send(products);
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});

// EXTERNAL: get a specific product by name within a business
app.get('/products/:business_id/name/:product_name', async (req, res) => {
    const { business_id, product_name } = req.params;
    try {
        const product = await getProductByNameandBusiness(business_id, product_name);
        res.send(product);
    } catch (error) {
        res.status(404).send({ error: error.message });
    }
});

// EXTERNAL: get a specific product by ID within a business
app.get('/product/:business_id/:product_id', async (req, res) => {
    const { business_id, product_id } = req.params;
    try {
        const product = await getProductByBusiness(product_id, business_id);
        res.send(product);
    } catch (error) {
        res.status(404).send({ error: error.message });
    }
});

// EXTERNAL: update a specific product
app.put('/product/:business_id/:product_id', async (req, res) => {
    const { business_id, product_id } = req.params;
    const updates = req.body;
    try {
        const result = await updateProduct(product_id, business_id, updates);
        if (result.updated) {
            res.send(result);
        } else {
            res.status(404).send({ message: 'No product found for update' });
        }
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});

// EXTERNAL: delete a specific product
app.delete('/product/:business_id/:product_id', async (req, res) => {
    const { business_id, product_id } = req.params;
    try {
        const result = await deleteProduct(product_id, business_id);
        if (result.deleted) {
            res.status(204).send({});
        } else {
            res.status(404).send({ message: 'No product found to delete' });
        }
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});

// ------------------------------------------------------------------------------------------------------------------------------------------------//

app.listen(8080, () => {
    console.log('Server is running on port 8080')
})