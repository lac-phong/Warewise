import mysql from 'mysql2'
import dotenv from 'dotenv'

dotenv.config()

// pool of connections
const pool = mysql.createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE
}).promise()

export async function getBusinesses() {
    const sql = `
        SELECT * FROM Business;
    `;
    try {
        const [rows] = await pool.query(sql);
        return rows;
    } catch (error) {
        throw new Error('Failed to retrieve businesses: ' + error.message);
    }
}

export async function getBusinessId(username) {
    const sql = `
        SELECT business_id FROM Business
        WHERE username = ?;
    `;
    console.log(username)
    try {
        const [rows] = await pool.query(sql, [username]);
        if (rows.length) {
            return rows[0];
        } else {
            throw new Error('Business not found');
        }
    } catch (error) {
        throw new Error('Failed to retrieve business: ' + error.message);
    }
}

export async function getBusinessInfo(business_id) {
    const sql = `
        SELECT * FROM Business
        WHERE business_id = ?;
    `;
    try {
        const [rows] = await pool.query(sql, [business_id]);
        if (rows.length) {
            return rows[0];
        } else {
            throw new Error('Business not found');
        }
    } catch (error) {
        throw new Error('Failed to retrieve business: ' + error.message);
    }
}

export async function insertBusiness(username, password, business_name) {
    const sql = `
        INSERT INTO Business (username, password, business_name)
        VALUES (?, ?, ?);
    `;
    try {
        const [result] = await pool.query(sql, [username, password, business_name]);
        if (result.affectedRows) {
            return { username, password, business_name, inserted: true };
        } else {
            throw new Error('Insert failed, no rows affected');
        }
    } catch (error) {
        throw new Error('Failed to insert business: ' + error.message);
    }
}

export async function updateBusiness(business_id, business_name) {
    const sql = `
        UPDATE Business
        SET business_name = ?
        WHERE business_id = ?;
    `;

    try {
        const [result] = await pool.query(sql, [business_id, business_name]);
        if (result.affectedRows) {
            return { business_id, business_name };
        } else {
            throw new Error('Business not found or no update needed');
        }
    } catch (error) {
        throw new Error('Database operation failed: ' + error.message);
    }
}

export async function deleteBusiness(business_id) {
    const sql = `
        DELETE FROM Business
        WHERE business_id = ?;
    `;

    try {
        const [result] = await pool.query(sql, [business_id]);
        if (result.affectedRows) {
            return;
        } else {
            throw new Error('Business not found');
        }
    } catch (error) {
        throw new Error('Database operation failed: ' + error.message);
    }
}

// INTERNAL FUNCTION
async function checkBusinessExists(business_id) {
    const sql = `SELECT 1 FROM Business WHERE business_id = ?`;
    try {
        const [rows] = await pool.query(sql, [business_id]);
        return rows.length > 0;
    } catch (error) {
        throw new Error('Database operation failed: ' + error.message);
    }
}

export async function getLocations() {
    const sql = `
        SELECT * FROM Location;
    `;
    try {
        const [rows] = await pool.query(sql);
        return rows;
    } catch (error) {
        throw new Error('Failed to retrieve locations: ' + error.message);
    }
}

export async function getLocation(business_id) {
    const sql = `
        SELECT * FROM Location
        WHERE business_id = ?;
    `;
    try {
        const [rows] = await pool.query(sql, [business_id]);
        if (rows.length) {
            return rows[0];
        } else {
            throw new Error('No location found for the specified business');
        }
    } catch (error) {
        throw new Error('Failed to retrieve location: ' + error.message);
    }
}

export async function insertLocation(business_id, address) {
    // updated security code
    const businessExists = await checkBusinessExists(business_id);
    if (!businessExists) {
        throw new Error('Business ID does not exist');
    }

    const sql = `
        INSERT INTO Location (business_id, address)
        VALUES (?, ?);
    `;
    try {
        const [result] = await pool.query(sql, [business_id, address]);
        if (result.affectedRows) {
            return { business_id, address, inserted: true };
        } else {
            throw new Error('Failed to insert location');
        }
    } catch (error) {
        throw new Error('Database operation failed: ' + error.message);
    }
}

export async function updateLocation(business_id, address) {
    const sql = `
        UPDATE Location
        SET address = ?
        WHERE business_id = ?;
    `;
    try {
        const [result] = await pool.query(sql, [address, business_id]);
        if (result.affectedRows) {
            return { business_id, address, updated: true };
        } else {
            throw new Error('No location found for the specified business or no update was needed');
        }
    } catch (error) {
        throw new Error('Failed to update location: ' + error.message);
    }
}

export async function deleteLocation(business_id) {
    const sql = `
        DELETE FROM Location
        WHERE business_id = ?;
    `;
    try {
        const [result] = await pool.query(sql, [business_id]);
        if (result.affectedRows) {
            return { business_id, deleted: true };
        } else {
            throw new Error('No location found for the specified business');
        }
    } catch (error) {
        throw new Error('Failed to delete location: ' + error.message);
    }
}


export async function getEmployees() {
    const sql = `SELECT * FROM Employees;`;
    try {
        const [rows] = await pool.query(sql);
        return rows;
    } catch (error) {
        throw new Error('Failed to retrieve all employees: ' + error.message);
    }
}

export async function getEmployeesByBusiness(business_id) {
    const sql = `
        SELECT * FROM Employees
        WHERE business_id = ?;
    `;
    try {
        const [rows] = await pool.query(sql, [business_id]);
        return rows;
    } catch (error) {
        throw new Error('Failed to retrieve employees for business: ' + error.message);
    }
}

export async function getEmployeeByBusiness(business_id, employee_id) {
    const sql = `
        SELECT * FROM Employees
        WHERE business_id = ? AND employee_id = ?;
    `;
    try {
        const [rows] = await pool.query(sql, [business_id, employee_id]);
        if (rows.length) {
            return rows[0];
        } else {
            throw new Error('Employee not found');
        }
    } catch (error) {
        throw new Error('Failed to retrieve employee: ' + error.message);
    }
}

export async function insertEmployee(business_id, employee_id, first_name, last_name, email, phone, address, salary) {
    const sql = `
        INSERT INTO Employees (business_id, employee_id, first_name, last_name, email, phone, address, salary)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?);
    `;
    try {
        const [result] = await pool.query(sql, [business_id, employee_id, first_name, last_name, email, phone, address, salary]);
        if (result.affectedRows) {
            return { business_id, employee_id, first_name, last_name, email, phone, address, salary, inserted: true };
        } else {
            throw new Error('Failed to insert employee');
        }
    } catch (error) {
        throw new Error('Database operation failed: ' + error.message);
    }
}

export async function updateEmployee(business_id, employee_id, first_name, last_name, email, phone, address, salary) {
    const sql = `
        UPDATE Employees
        SET first_name = ?, last_name = ?, email = ?, phone = ?, address = ?, salary = ?
        WHERE business_id = ? AND employee_id = ?;
    `;
    try {
        const [result] = await pool.query(sql, [first_name, last_name, email, phone, address, salary, business_id, employee_id]);
        if (result.affectedRows) {
            return { business_id, employee_id, first_name, last_name, email, phone, address, salary, updated: true };
        } else {
            throw new Error('No employee found for update');
        }
    } catch (error) {
        throw new Error('Failed to update employee: ' + error.message);
    }
}

export async function deleteEmployee(business_id, employee_id) {
    const sql = `
        DELETE FROM Employees
        WHERE business_id = ? AND employee_id = ?;
    `;
    try {
        const [result] = await pool.query(sql, [business_id, employee_id]);
        if (result.affectedRows) {
            return { business_id, employee_id, deleted: true };
        } else {
            throw new Error('No employee found to delete');
        }
    } catch (error) {
        throw new Error('Failed to delete employee: ' + error.message);
    }
}

// example for sale
export async function insertSale(salesDetails) {
    const { business_id, product_id, quantity, payment_details } = salesDetails;

    // checking to see if product exists
    const productExists = await checkProductExists(business_id, product_id);
    if (!productExists) {
        throw new Error('Product does not exist.');
    }

    const sql = `
        INSERT INTO Sales (business_id, product_id, quantity, payment_details)
        VALUES (?, ?, ?, ?);
    `;
    try {
        const [result] = await pool.query(sql, [business_id, product_id, quantity, payment_details]);
        if (result.affectedRows) {
            return { inserted: true, details: salesDetails };
        } else {
            throw new Error('Failed to insert sale');
        }
    } catch (error) {
        throw new Error('Database operation failed: ' + error.message);
    }
}

async function checkProductExists(business_id, product_id) {
    const sql = `SELECT 1 FROM Products WHERE business_id = ? AND product_id = ?`;
    const [rows] = await pool.query(sql, [business_id, product_id]);
    return rows.length > 0;
}

export async function getOrders(business_id) {
    const sql = `
        SELECT * FROM Orders
        WHERE business_id = ?;
    `;
    try {
        const [rows] = await pool.query(sql, [business_id]);
        return rows;
    } catch (error) {
        throw new Error('Failed to retrieve orders for business: ' + error.message);
    }
}

export async function getOrder(order_id, business_id) {
    const sql = `
        SELECT * FROM Orders
        WHERE business_id = ? AND order_id;
    `;
    try {
        const [rows] = await pool.query(sql, [business_id, order_id]);
        if (rows.length) {
            return rows[0];
        } else {
            throw new Error('No order found for the specified business');
        }
    } catch (error) {
        throw new Error('Failed to retrieve order: ' + error.message);
    }
}

export async function insertOrder(business_id) {
    // updated security code
    const businessExists = await checkBusinessExists(business_id);
    if (!businessExists) {
        throw new Error('Business ID does not exist');
    }

    const sql = `
        INSERT INTO Orders (business_id)
        VALUES (?);
    `;

    try {
        const [result] = await pool.query(sql, [business_id]);
        if (result.affectedRows) {
            return { business_id, inserted: true };
        } else {
            throw new Error('Failed to insert order');
        }
    } catch (error) {
        throw new Error('Database operation failed: ' + error.message);
    }
}

export async function insertOrderDetails(business_id, order_id, supplier_id, product_id, quantity, price) {
    // updated security code
    const businessExists = await checkBusinessExists(business_id);
    if (!businessExists) {
        throw new Error('Business ID does not exist');
    }
    const orderExists = await checkOrderExists(order_id);
    if (!orderExists) {
        throw new Error('Order ID does not exist');
    }

    const sql = `
        INSERT INTO ORDER_DETAILS (business_id, order_id, supplier_id, product_id, quantity, price)
        VALUES (?, ?, ?, ?, ?, ?);
    `;

    try {
        const [result] = await pool.query(sql, [business_id, order_id, supplier_id, product_id, quantity, price]);
        if (result.affectedRows) {
            return { business_id, order_id, supplier_id, product_id, quantity, price, inserted: true };
        } else {
            throw new Error('Failed to insert order details');
        }
    } catch (error) {
        throw new Error('Database operation failed: ' + error.message);
    }
}

export async function updateOrder(business_id, order_id, supplier_id, product_id, quantity, price) {
    const sql = `
        UPDATE ORDER_DETAILS
        SET quantity = ?, price = ?
        WHERE business_id = ? AND order_id = ? AND supplier_id = ? AND product_id = ?;
    `;
    try {
        const [result] = await pool.query(sql, [quantity, price, business_id, order_id, supplier_id, product_id]);
        if (result.affectedRows) {
            return { business_id, order_id, supplier_id, product_id, quantity, price, updated: true };
        } else {
            throw new Error('No order found for the specified business or no update was needed');
        }
    } catch (error) {
        throw new Error('Failed to update order: ' + error.message);
    }
}

export async function deleteOrder(business_id, order_id) {
    const sql = `
        DELETE FROM ORDERS
        WHERE business_id = ? AND order_id = ?;
    `;
    try {
        const [result] = await pool.query(sql, [business_id, order_id]);
        if (result.affectedRows) {
            return { business_id, order_id, deleted: true };
        } else {
            throw new Error('No order found for the specified business');
        }
    } catch (error) {
        throw new Error('Failed to delete order: ' + error.message);
    }
}