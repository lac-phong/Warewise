const app = express();
import cors from 'cors'
import express from 'express'
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';

import {
    getAccountPage,

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
    addBalance,
    subtractBalance,
    deleteBalance,

    insertProduct,
    getProductByNameandBusiness,
    getProductsByBusiness,
    getProductByBusiness,
    updateProduct,
    deleteProduct,
    getSupplierByOrder
} from './database.js'

dotenv.config();
const jwtSecret = process.env.JWT_SECRET;

app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: 'http://localhost:3000', 
    credentials: true
}));

// ------------------------------------------------------------------------------------------------------------------------------------------------//

// --------------------------------------------------------------- LOGIN --------------------------------------------------------------------------//

// EXTERNAL: insert a new business
app.post('/register', async (req, res) => {
    const { username, password, business_name, address } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    try {
        const user = await insertBusiness(username, hashedPassword, business_name, address);
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
        const userInfo = await getBusinessInfo(userId.BUSINESS_ID);
        console.log(password)
        const passwordMatch = bcrypt.compareSync(password, userInfo.PASSWORD);
        if (!passwordMatch) {
            return res.status(422).json('Password incorrect');
        }
        const tokenPayload = {
            business_id: userInfo.BUSINESS_ID,
            username: userInfo.USERNAME,
            business_name: userInfo.BUSINESS_NAME,
            address: userInfo.ADDRESS,
            creation_date: userInfo.CREATION_DATE
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

// ------------------------------------------------------------------------------------------------------------------------------------------------//

// ----------------------------------------------------------- ACCOUNT PAGE -----------------------------------------------------------------------//

// EXTERNAL: get account page
app.get('/getaccountpage', async (req, res) => {
    console.log(req.cookies)
    const {token} = req.cookies;
    if (token) {
        jwt.verify(token, jwtSecret, {}, async (err, userData) => {
            console.log('Retrieved userData:', userData);
            if (err) throw err;
            const accountPage = await getAccountPage(userData.business_id);
            console.log('accountPage:', accountPage); 
            res.json(accountPage);
        });
    } else {
        res.json(null);
    }
});

// ------------------------------------------------------------------------------------------------------------------------------------------------//

// ------------------------------------------------------------- BUSINESS -------------------------------------------------------------------------//

// EXTERNAL: get specific business information
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

// ------------------------------------------------------------------------------------------------------------------------------------------------//

// ------------------------------------------------------------ EMPLOYEES -------------------------------------------------------------------------//

// EXTERNAL: get all employees by business
app.get("/employees", async (req, res) => {
    const {token} = req.cookies
    if (token) {
        jwt.verify(token, jwtSecret, {}, async (err, userData) => {
            console.log('Retrieved userData from employee:', userData)
            if (err) throw err
            const employees = await getEmployeesByBusiness(userData.business_id);
            console.log(employees)
            res.json(employees)
        })
    } else {
        res.status(404).json(null)
    }
})

// EXTERNAL: get a specific employee by business
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

// EXTERNAL: insert a new employee
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

// EXTERNAL: update an existing employee
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

// EXTERNAL: delete an employee
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
})
// ------------------------------------------------------------------------------------------------------------------------------------------------//

// --------------------------------------------------------------- ORDERS -------------------------------------------------------------------------//

// EXTERNAL: insert multiple products in the same order
app.post('/allOrders', async (req, res) => {
    console.log("doing order")
    const {token} = req.cookies;
    const { supplier_id, products } = req.body;
    if (token) {
        jwt.verify(token, jwtSecret, {}, async (err, userData) => {
            console.log('Retrieved userData:', userData);
            if (err) throw err;
            const result = await insertMultipleProductOrder(userData.business_id, supplier_id, products);
            console.log('Inserted Order Info:', result);
            res.status(201).json(result);
            
        });
    } else {
        res.json(null);
    }
});

// EXTERNAL: get an order by its ID
app.get('/orders/:order_id', async (req, res) => {
    const {token} = req.cookies;
    const { order_id } = req.params;
    if (token) {
        jwt.verify(token, jwtSecret, {}, async (err, userData) => {
            console.log('Retrieved userData:', userData);
            if (err) throw err;
            const order = await getOrderById(userData.business_id, order_id);
            console.log('Order', order)
            res.json(order);
        });
    } else {
        res.json(null);
    }
});

// EXTERNAL: get all orders for a business
app.get('/orders', async (req, res) => {
    const {token} = req.cookies;
    if (token) {
        jwt.verify(token, jwtSecret, {}, async (err, userData) => {
            console.log('Retrieved userData:', userData);
            if (err) throw err;
            const orders = await getOrders(userData.business_id);
            console.log('Orders:', orders);
            res.json(orders);
        });
    } else {
        res.json(null);
    }
});

// EXTERNAL: get order details by order ID
app.get('/order-details/:order_id', async (req, res) => {
    const {token} = req.cookies;
    const { order_id } = req.params;
    if (token) {
        jwt.verify(token, jwtSecret, {}, async (err, userData) => {
            console.log('Retrieved userData:', userData);
            if (err) throw err;
            const orderDetails = await getOrderDetailsById(order_id, userData.business_id);
            console.log('Order details:', orders);
            res.json(orderDetails);
        });
    } else {
        res.json(null);
    }
});

// EXTERNAL: get orders by supplier
app.get('/orders-by-supplier/:supplier_id', async (req, res) => {
    const {token} = req.cookies;
    const { supplier_id } = req.params;
    if (token) {
        jwt.verify(token, jwtSecret, {}, async (err, userData) => {
            console.log('Retrieved userData:', userData);
            if (err) throw err;
            const orders = await getOrderBySupplier(userData.business_id, supplier_id);
            console.log('Orders:', orders);
            res.json(orders);
        });
    } else {
        res.json(null);
    }
});

// EXTERNAL: get orders by specific date
app.get('/orders-by-date/:order_date', async (req, res) => {
    const {token} = req.cookies;
    const { order_date } = req.params;
    if (token) {
        jwt.verify(token, jwtSecret, {}, async (err, userData) => {
            console.log('Retrieved userData:', userData);
            if (err) throw err;
            const orders = await getOrderByDate(userData.business_id, order_date);
            console.log('Orders:', orders);
            res.json(orders);
        });
    } else {
        res.json(null);
    }
});

// EXTERNAL: get order details by product name
app.get('/order-details-by-product/:product_name', async (req, res) => {
    const {token} = req.cookies;
    const { product_name } = req.params;
    if (token) {
        jwt.verify(token, jwtSecret, {}, async (err, userData) => {
            console.log('Retrieved userData:', userData);
            if (err) throw err;
            const orderDetails = await getOrderDetailsByProduct(business_id, product_name);
            console.log('Order details:', orders);
            res.json(orderDetails);
        });
    } else {
        res.json(null);
    }
});

// EXTERNAL: update order details
app.put('/update-order/:order_id', async (req, res) => {
    const {token} = req.cookies;
    const { order_id } = req.params;
    const updates = req.body;
    if (token) {
        jwt.verify(token, jwtSecret, {}, async (err, userData) => {
            console.log('Retrieved userData:', userData);
            if (err) throw err;
            const result = await updateOrderDetails(order_id, userData.business_id, updates);
            if (result.updated) {
                res.json('Order updated successfully:', result);
            } else {
                res.status(404).send('Order not found.');
            }
        });
    } else {
        res.json(null);
    }
});

// EXTERNAL: delete an order
app.delete('/delete-order/:order_id', async (req, res) => {
    const {token} = req.cookies;
    const { order_id } = req.params;
    if (token) {
        jwt.verify(token, jwtSecret, {}, async (err, userData) => {
            console.log('Retrieved userData:', userData);
            if (err) throw err;
            const result = await deleteOrder(order_id, userData.business_id);
            if (result.deleted) {
                res.json('Order deleted successfully');
            } else {
                res.status(404).send('Order not found.');
            }
        });
    } else {
        res.json(null);
    }
});

// ------------------------------------------------------------------------------------------------------------------------------------------------//

// ------------------------------------------------------------ SUPPLIERS -------------------------------------------------------------------------//

// EXTERNAL: insert a new supplier
app.post('/suppliers', async (req, res) => {
    const {token} = req.cookies;
    const { supplier_name, email, phone, address, supplier_category } = req.body;
    if (token) {
        jwt.verify(token, jwtSecret, {}, async (err, userData) => {
            console.log('Retrieved userData:', userData);
            if (err) throw err;
            const result = await insertSupplier(userData.business_id, supplier_name, email, phone, address, supplier_category);
            console.log('Inserted supplier:', result);
            res.json(result);
        });
    } else {
        res.json(null);
    }
});

// EXTERNAL: get information about a specific supplier
app.get('/suppliers/:supplier_id', async (req, res) => {
    const {token} = req.cookies;
    const { supplier_id } = req.params;
    if (token) {
        jwt.verify(token, jwtSecret, {}, async (err, userData) => {
            console.log('Retrieved userData:', userData);
            if (err) throw err;
            const result = await getSupplierInfo(userData.business_id, supplier_id);
            console.log('Supplier:', result);
            res.json(result);
        });
    } else {
        res.json(null);
    }
});
// EXTERNALl: get all suppliers for a business by categories
app.get('/suppliers/categories', async (req, res) => {
    const {token} = req.cookies;
    if (token) {
        jwt.verify(token, jwtSecret, {}, async (err, userData) => {
            console.log('Retrieved userData:', userData);
            if (err) throw err;
            const result = await getSuppliersCategories(userData.business_id);
            console.log('Supplier categories:', result);
            res.json(result);
        });
    } else {
        res.json(null);
    }
});

// EXTERNAL: get suppliers by category
app.get('/suppliers/category', async (req, res) => {
    const {token} = req.cookies;
    const { category } = req.query;
    if (token) {
        jwt.verify(token, jwtSecret, {}, async (err, userData) => {
            console.log('Retrieved userData:', userData);
            if (err) throw err;
            const result = await getSuppliersByCategory(userData.business_id, category);
            console.log('Suppliers:', result);
            res.json(result);
        });
    } else {
        res.json(null);
    }
});

// EXTERNAL: get all suppliers for a business
app.get('/suppliers', async (req, res) => {
    const {token} = req.cookies;
    if (token) {
        jwt.verify(token, jwtSecret, {}, async (err, userData) => {
            console.log('Retrieved userData:', userData);
            if (err) throw err;
            const result = await getSuppliers(userData.business_id);
            console.log('Suppliers:', result);
            res.json(result);
        });
    } else {
        res.json(null);
    }
});

// EXTERNAL: get supplier ID from business id and order id
app.get('/supplier/:order_id', async (req, res) => {
    console.log(req.params)
    console.log('getting supplier from order')
    const {token} = req.cookies;
    const { order_id } = req.params;
    if (token) {
        jwt.verify(token, jwtSecret, {}, async (err, userData) => {
            console.log('Retrieved userData:', userData);
            if (err) throw err;
            const result = await getSupplierByOrder(userData.business_id, order_id);
            console.log('Supplier ID:', result);
            res.json(result);
        });
    } else {
        res.json(null);
    }
});

// Update a supplier
app.put('/supplier/:supplier_id', async (req, res) => {
    const {token} = req.cookies;
    const { supplier_id } = req.params;
    const updates = req.body;
    if (token) {
        jwt.verify(token, jwtSecret, {}, async (err, userData) => {
            console.log('Retrieved userData:', userData);
            if (err) throw err;
            const result = await getSupplierInfo(supplier_id, userData.business_id, updates);
            console.log('Updated supplier:', result);
            res.json(result);
        });
    } else {
        res.json(null);
    }
});

// Delete a supplier
app.delete('/supplier/:supplier_id', async (req, res) => {
    const {token} = req.cookies;
    const { supplier_id } = req.params;
    if (token) {
        jwt.verify(token, jwtSecret, {}, async (err, userData) => {
            console.log('Retrieved userData:', userData);
            if (err) throw err;
            const result = await deleteSupplier(supplier_id, userData.business_id);
            console.log('Deleted supplier:', result);
            res.json(result);
        });
    } else {
        res.json(null);
    }
});

// ------------------------------------------------------------------------------------------------------------------------------------------------//

// ------------------------------------------------------------ CUSTOMERS -------------------------------------------------------------------------//

// EXTERNAL: insert a new customer
app.post('/customers', async (req, res) => {
    const {token} = req.cookies;
    const { first_name, last_name, email, phone, address } = req.body;
    if (token) {
        jwt.verify(token, jwtSecret, {}, async (err, userData) => {
            console.log('Retrieved userData:', userData);
            if (err) throw err;
            const result = await insertCustomer(userData.business_id, first_name, last_name, email, phone, address);
            console.log('Inserted customer:', result);
            res.json(result);
        });
    } else {
        res.json(null);
    }
});

// EXTERNAL: get all customers for a specific business
app.get('/customers', async (req, res) => {
    const {token} = req.cookies;
    if (token) {
        jwt.verify(token, jwtSecret, {}, async (err, userData) => {
            console.log('Retrieved userData:', userData);
            if (err) throw err;
            const result = await getCustomersByBusiness(userData.business_id);
            console.log('Customers:', result);
            res.json(result);
        });
    } else {
        res.json(null);
    }
});

// EXTERNAL: get a specific customer by business
app.get('/customer/:customer_id', async (req, res) => {
    const {token} = req.cookies;
    const { customer_id } = req.params;
    if (token) {
        jwt.verify(token, jwtSecret, {}, async (err, userData) => {
            console.log('Retrieved userData:', userData);
            if (err) throw err;
            const result = await getCustomerByBusiness(customer_id, userData.business_id);
            console.log('Customer:', result);
            res.json(result);
        });
    } else {
        res.json(null);
    }
});

// EXTERNAL: update a specific customer
app.put('/customer/:customer_id', async (req, res) => {
    const {token} = req.cookies;
    const { customer_id } = req.params;
    const updates = req.body;
    if (token) {
        jwt.verify(token, jwtSecret, {}, async (err, userData) => {
            console.log('Retrieved userData:', userData);
            if (err) throw err;
            const result = await updateCustomer(customer_id, userData.business_id, updates);
            console.log('Updated customer:', result);
            res.json(result);
        });
    } else {
        res.json(null);
    }
});

// EXTERNAL: delete a specific customer
app.delete('/customer/:customer_id', async (req, res) => {
    const {token} = req.cookies;
    const { customer_id } = req.params;
    if (token) {
        jwt.verify(token, jwtSecret, {}, async (err, userData) => {
            console.log('Retrieved userData:', userData);
            if (err) throw err;
            const result = await deleteCustomer(customer_id, userData.business_id);
            console.log('Deleted customer:', result);
            res.json(result);
        });
    } else {
        res.json(null);
    }
});

// ------------------------------------------------------------------------------------------------------------------------------------------------//

// ---------------------------------------------------------------- SALES -------------------------------------------------------------------------//

// EXTERNAL: insert a new sale
app.post('/sales', async (req, res) => {
    const {token} = req.cookies;
    const { product_id, quantity, payment_details } = req.body;
    if (token) {
        jwt.verify(token, jwtSecret, {}, async (err, userData) => {
            console.log('Retrieved userData:', userData);
            if (err) throw err;
            const result = await insertSale(userData.business_id, product_id, quantity, payment_details);
            console.log('Inserted sale:', result);
            res.json(result);
        });
    } else {
        res.json(null);
    }
});

// EXTERNAL: get all sales for a specific business
app.get('/sales', async (req, res) => {
    const {token} = req.cookies;
    if (token) {
        jwt.verify(token, jwtSecret, {}, async (err, userData) => {
            console.log('Retrieved userData:', userData);
            if (err) throw err;
            const result = await getSalesByBusiness(userData.business_id);
            console.log('Sales:', result);
            res.json(result);
        });
    } else {
        res.json(null);
    }
});

// EXTERNAL: get a specific sale by business
app.get('/sale/:sale_id', async (req, res) => {
    const {token} = req.cookies;
    const { sale_id } = req.params;
    if (token) {
        jwt.verify(token, jwtSecret, {}, async (err, userData) => {
            console.log('Retrieved userData:', userData);
            if (err) throw err;
            const result = await getSaleByBusiness(sale_id, userData.business_id);
            console.log('Sale:', result);
            res.json(result);
        });
    } else {
        res.json(null);
    }
});

// EXTERNAL: update a specific sale
app.put('/sale/:sale_id', async (req, res) => {
    const {token} = req.cookies;
    const { sale_id } = req.params;
    const updates = req.body;
    if (token) {
        jwt.verify(token, jwtSecret, {}, async (err, userData) => {
            console.log('Retrieved userData:', userData);
            if (err) throw err;
            const result = await updateSale(sale_id, userData.business_id, updates);
            console.log('Updated sale:', result);
            res.json(result);
        });
    } else {
        res.json(null);
    }
});

// EXTERNAL: delete a specific sale
app.delete('/sale/:sale_id', async (req, res) => {
    const {token} = req.cookies;
    const { sale_id } = req.params;
    if (token) {
        jwt.verify(token, jwtSecret, {}, async (err, userData) => {
            console.log('Retrieved userData:', userData);
            if (err) throw err;
            const result = await deletedBusiness(sale_id, userData.business_id);
            console.log('Deleted Sale:', result);
            res.json(result);
        });
    } else {
        res.json(null);
    }
});

// ------------------------------------------------------------------------------------------------------------------------------------------------//

// -------------------------------------------------------------- BALANCE -------------------------------------------------------------------------//

// EXTERNAL: insert a new balance
app.post('/balance', async (req, res) => {
    const {token} = req.cookies;
    const { balance } = req.body;
    if (token) {
        jwt.verify(token, jwtSecret, {}, async (err, userData) => {
            console.log('Retrieved userData:', userData);
            if (err) throw err;
            const result = await insertBalance(userData.business_id, balance);
            console.log('Inserted Balance:', result);
            res.json(result);
        });
    } else {
        res.json(null);
    }
});

// EXTERNAL: get balance records for a specific business
app.get('/balance', async (req, res) => {
    const {token} = req.cookies;
    if (token) {
        jwt.verify(token, jwtSecret, {}, async (err, userData) => {
            console.log('Retrieved userData:', userData);
            if (err) throw err;
            const result = await getBalanceByBusiness(userData.business_id);
            console.log('Balance records:', result);
            res.json(result);
        });
    } else {
        res.json(null);
    }
});
// EXTERNAL: update a specific balance record
app.put('/balance/:balance_id', async (req, res) => {
    const {token} = req.cookies;
    const { balance_id } = req.params;
    const { new_balance } = req.body;
    if (token) {
        jwt.verify(token, jwtSecret, {}, async (err, userData) => {
            console.log('Retrieved userData:', userData);
            if (err) throw err;
            const result = await updateBalance(balance_id, userData.business_id, new_balance);
            console.log('Updated balance:', result);
            res.json(result);
        });
    } else {
        res.json(null);
    }
});

// EXTERNAL: add from a specific balance record
app.put('/addbalance', async (req, res) => {
    const {token} = req.cookies;
    const { new_balance } = req.body;
    if (token) {
        jwt.verify(token, jwtSecret, {}, async (err, userData) => {
            console.log('Retrieved userData:', userData);
            if (err) throw err;
            const result = await addBalance(userData.business_id, new_balance);
            console.log('Added balance:', result);
            res.json(result);
        });
    } else {
        res.json(null);
    }
});

// EXTERNAL: subtract from a specific balance record
app.put('/subtractbalance', async (req, res) => {
    const {token} = req.cookies;
    const { new_balance } = req.body;
    if (token) {
        jwt.verify(token, jwtSecret, {}, async (err, userData) => {
            console.log('Retrieved userData:', userData);
            if (err) throw err;
            const result = await subtractBalance(userData.business_id, new_balance);
            console.log('Added balance:', result);
            res.json(result);
        });
    } else {
        res.json(null);
    }
});

// EXTERNAL: delete a specific balance record
app.delete('/balance/:balance_id', async (req, res) => {
    const {token} = req.cookies;
    const { balance_id } = req.params;
    if (token) {
        jwt.verify(token, jwtSecret, {}, async (err, userData) => {
            console.log('Retrieved userData:', userData);
            if (err) throw err;
            const result = await deleteBalance(balance_id, userData.business_id);
            console.log('Deleted balance:', result);
            res.json(result);
        });
    } else {
        res.json(null);
    }
});

// ------------------------------------------------------------------------------------------------------------------------------------------------//

// ------------------------------------------------------------- PRODUCTS -------------------------------------------------------------------------//

// EXTERNAL: insert a new product
app.post('/products', async (req, res) => {
    const {token} = req.cookies;
    const { category_name, product_name, product_description, quantity, reorder_level, reorder_quantity, price, supplier_id } = req.body;
    if (token) {
        jwt.verify(token, jwtSecret, {}, async (err, userData) => {
            console.log('Retrieved userData:', userData);
            if (err) throw err;
            const result = await insertProduct(userData.business_id, category_name, product_name, product_description, quantity, reorder_level, reorder_quantity, price, supplier_id);
            console.log('Inserted product:', result);
            res.json(result);
        });
    } else {
        res.json(null);
    }
});

// EXTERNAL: get all products for a specific business
app.get('/products', async (req, res) => {
    const {token} = req.cookies;
    if (token) {
        jwt.verify(token, jwtSecret, {}, async (err, userData) => {
            console.log('Retrieved userData:', userData);
            if (err) throw err;
            const result = await getProductsByBusiness(userData.business_id);
            console.log('Products:', result);
            res.json(result);
        });
    } else {
        res.json(null);
    }
});

// EXTERNAL: get a specific product by name within a business
app.get('/products/name/:product_name', async (req, res) => {
    const {token} = req.cookies;
    const { product_name } = req.params;
    if (token) {
        jwt.verify(token, jwtSecret, {}, async (err, userData) => {
            console.log('Retrieved userData:', userData);
            if (err) throw err;
            const result = await getProductByNameandBusiness(userData.business_id, product_name);
            console.log('Product:', result);
            res.json(result);
        });
    } else {
        res.json(null);
    }
});

// EXTERNAL: get a specific product by ID within a business
app.get('/product/:product_id', async (req, res) => {
    const {token} = req.cookies;
    const { product_id } = req.params;
    if (token) {
        jwt.verify(token, jwtSecret, {}, async (err, userData) => {
            console.log('Retrieved userData:', userData);
            if (err) throw err;
            const result = await getProductByBusiness(product_id, userData.business_id);
            console.log('Product:', result);
            res.json(result);
        });
    } else {
        res.json(null);
    }
});

// EXTERNAL: update a specific product
app.put('/product/:product_id', async (req, res) => {
    const {token} = req.cookies;
    const { product_id } = req.params;
    const updates = req.body;
    if (token) {
        jwt.verify(token, jwtSecret, {}, async (err, userData) => {
            console.log('Retrieved userData:', userData);
            if (err) throw err;
            const result = await updateProduct(product_id, userData.business_i, updates);
            console.log('Updated Product:', result);
            res.json(result);
        });
    } else {
        res.json(null);
    }
});

// EXTERNAL: delete a specific product
app.delete('/product/:product_id', async (req, res) => {
    const { product_id } = req.params;
    const {token} = req.cookies;
    if (token) {
        jwt.verify(token, jwtSecret, {}, async (err, userData) => {
            console.log('Retrieved userData:', userData);
            if (err) throw err;
            const result = await deleteProduct(product_id, userData.business_id);
            console.log('Deleted product:', result);
            res.json(result);
        });
    } else {
        res.json(null);
    }
});


app.listen(8080, () => {
    console.log('Server is running on port 8080')
})