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

export async function getBusinessId(username, password) {
    const sql = `
        SELECT business_id FROM Business
        WHERE username = ? AND password = ?;
    `;
    try {
        const [rows] = await pool.query(sql, [username, password]);
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
        SELECT 
            O.ORDER_DATE,
            S.SUPPLIER_NAME,
            P.PRODUCT_NAME,
            OD.QUANTITY,
            OD.PRICE
        FROM 
            ORDERS O
        JOIN 
            ORDER_DETAILS OD ON O.BUSINESS_ID = OD.BUSINESS_ID AND O.ORDER_ID = OD.ORDER_ID
        JOIN 
            PRODUCTS P ON OD.PRODUCT_ID = P.PRODUCT_ID
        JOIN 
            SUPPLIERS S ON O.SUPPLIER_ID = S.SUPPLIER_ID;
        WHERE
            O.BUSINESS_ID = ?;
        ORDER BY 
            O.ORDER_ID;
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
        WHERE business_id = ? AND order_id = ?;
    `;
    try {
        const [rows] = await pool.query(sql, [business_id, order_id]);
        if (rows.length) {
            return rows;
        } else {
            throw new Error('No order found for the specified business');
        }
    } catch (error) {
        throw new Error('Failed to retrieve order: ' + error.message);
    }
}

export async function getOrderDetailsById(order_id, business_id) {
    const sql = `
        SELECT 
            O.ORDER_DATE,
            S.SUPPLIER_NAME,
            P.PRODUCT_NAME,
            OD.QUANTITY,
            OD.PRICE
        FROM 
            ORDERS O
        JOIN 
            ORDER_DETAILS OD ON O.BUSINESS_ID = OD.BUSINESS_ID AND O.ORDER_ID = OD.ORDER_ID
        JOIN 
            PRODUCTS P ON OD.PRODUCT_ID = P.PRODUCT_ID
        JOIN 
            SUPPLIERS S ON O.SUPPLIER_ID = S.SUPPLIER_ID;
        WHERE O.business_id = ?, O.order_id = ?;
        ORDER BY 
            O.ORDER_ID;
    `;
    try {
        const [rows] = await pool.query(sql, [business_id, order_id]);
        if (rows.length) {
            return rows;
        } else {
            throw new Error('No order found for the specified business');
        }
    } catch (error) {
        throw new Error('Failed to retrieve order: ' + error.message);
    }
}

export async function getOrderBySupplier(business_id, supplier_id) {
    const sql = `
        SELECT 
            O.ORDER_DATE,
            S.SUPPLIER_NAME,
            P.PRODUCT_NAME,
            OD.QUANTITY,
            OD.PRICE
        FROM 
            ORDERS O
        JOIN 
            ORDER_DETAILS OD ON O.BUSINESS_ID = OD.BUSINESS_ID AND O.ORDER_ID = OD.ORDER_ID
        JOIN 
            PRODUCTS P ON OD.PRODUCT_ID = P.PRODUCT_ID
        JOIN 
            SUPPLIERS S ON O.SUPPLIER_ID = S.SUPPLIER_ID;
        WHERE
            O.BUSINESS_ID = ? AND 
            O.SUPPLIER_ID = ?
        ORDER BY 
            O.ORDER_ID;
    `;
    try {
        const [rows] = await pool.query(sql, [business_id, supplier_id]);
        if (rows.length) {
            return rows;
        } else {
            throw new Error('No order found for the specified business');
        }
    } catch (error) {
        throw new Error('Failed to retrieve order: ' + error.message);
    }
}

export async function getOrderByDate(business_id, order_date) {
    const sql = `
        SELECT 
            O.ORDER_DATE,
            S.SUPPLIER_NAME,
            P.PRODUCT_NAME,
            OD.QUANTITY,
            OD.PRICE
        FROM 
            ORDERS O
        JOIN 
            ORDER_DETAILS OD ON O.BUSINESS_ID = OD.BUSINESS_ID AND O.ORDER_ID = OD.ORDER_ID
        JOIN 
            PRODUCTS P ON OD.PRODUCT_ID = P.PRODUCT_ID
        JOIN 
            SUPPLIERS S ON O.SUPPLIER_ID = S.SUPPLIER_ID;
        WHERE
            O.BUSINESS_ID = ? AND 
            O.ORDER_DATE = ?
        ORDER BY 
            O.ORDER_ID;
    `;
    try {
        const [rows] = await pool.query(sql, [business_id, order_id, order_date]);
        if (rows.length) {
            return rows;
        } else {
            throw new Error('No order found on date for the specified business');
        }
    } catch (error) {
        throw new Error('Failed to retrieve order: ' + error.message);
    }
}

export async function getOrderBeforeDate(business_id, order_date) {
    const sql = `
        SELECT 
            O.ORDER_DATE,
            S.SUPPLIER_NAME,
            P.PRODUCT_NAME,
            OD.QUANTITY,
            OD.PRICE
        FROM 
            ORDERS O
        JOIN 
            ORDER_DETAILS OD ON O.BUSINESS_ID = OD.BUSINESS_ID AND O.ORDER_ID = OD.ORDER_ID
        JOIN 
            PRODUCTS P ON OD.PRODUCT_ID = P.PRODUCT_ID
        JOIN 
            SUPPLIERS S ON O.SUPPLIER_ID = S.SUPPLIER_ID;
        WHERE
            O.BUSINESS_ID = ? AND 
            O.ORDER_DATE <= ?
        ORDER BY 
            O.ORDER_ID;
    `;
    try {
        const [rows] = await pool.query(sql, [business_id, order_date]);
        if (rows.length) {
            return rows;
        } else {
            throw new Error('No order found before date for the specified business');
        }
    } catch (error) {
        throw new Error('Failed to retrieve order: ' + error.message);
    }
}

export async function getOrderAfterDate(business_id, order_date) {
    const sql = `
        SELECT 
            O.ORDER_DATE,
            S.SUPPLIER_NAME,
            P.PRODUCT_NAME,
            OD.QUANTITY,
            OD.PRICE
        FROM 
            ORDERS O
        JOIN 
            ORDER_DETAILS OD ON O.BUSINESS_ID = OD.BUSINESS_ID AND O.ORDER_ID = OD.ORDER_ID
        JOIN 
            PRODUCTS P ON OD.PRODUCT_ID = P.PRODUCT_ID
        JOIN 
            SUPPLIERS S ON O.SUPPLIER_ID = S.SUPPLIER_ID;
        WHERE
            O.BUSINESS_ID = ? AND 
            O.ORDER_DATE >= ?
        ORDER BY 
            O.ORDER_ID;
    `;
    try {
        const [rows] = await pool.query(sql, [business_id, order_date]);
        if (rows.length) {
            return rows;
        } else {
            throw new Error('No order found after date for the specified business');
        }
    } catch (error) {
        throw new Error('Failed to retrieve order: ' + error.message);
    }
}

export async function getOrderBetweenDates(business_id, order_date_1, order_date_2) {
    const sql = `
        SELECT 
            O.ORDER_DATE,
            S.SUPPLIER_NAME,
            P.PRODUCT_NAME,
            OD.QUANTITY,
            OD.PRICE
        FROM 
            ORDERS O
        JOIN 
            ORDER_DETAILS OD ON O.BUSINESS_ID = OD.BUSINESS_ID AND O.ORDER_ID = OD.ORDER_ID
        JOIN 
            PRODUCTS P ON OD.PRODUCT_ID = P.PRODUCT_ID
        JOIN 
            SUPPLIERS S ON O.SUPPLIER_ID = S.SUPPLIER_ID;
        WHERE 
            O.BUSINESS_ID = ? AND
            O.ORDER_DATE BETWEEN ? AND ?
        ORDER BY 
            O.ORDER_ID;
    `;
    try {
        const [rows] = await pool.query(sql, [business_id, order_date_1, order_date_2]);
        if (rows.length) {
            return rows;
        } else {
            throw new Error('No order found after date for the specified business');
        }
    } catch (error) {
        throw new Error('Failed to retrieve order: ' + error.message);
    }
}

export async function getOrderDetailsByProduct(business_id, product_id) {
    const sql = `
        SELECT 
            O.ORDER_DATE,
            S.SUPPLIER_NAME,
            P.PRODUCT_NAME,
            OD.QUANTITY,
            OD.PRICE
        FROM 
            ORDERS O
        JOIN 
            ORDER_DETAILS OD ON O.BUSINESS_ID = OD.BUSINESS_ID AND O.ORDER_ID = OD.ORDER_ID
        JOIN 
            PRODUCTS P ON OD.PRODUCT_ID = P.PRODUCT_ID
        JOIN 
            SUPPLIERS S ON O.SUPPLIER_ID = S.SUPPLIER_ID;
        WHERE
            O.BUSINESS_ID = ? AND 
            OD.PRODUCT_ID = ?
        ORDER BY 
            O.ORDER_ID;
    `;
    try {
        const [rows] = await pool.query(sql, [business_id, product_id]);
        if (rows.length) {
            return rows;
        } else {
            throw new Error('No order found with product for the specified business');
        }
    } catch (error) {
        throw new Error('Failed to retrieve order: ' + error.message);
    }
}

export async function getOrderDetailsByPrice(business_id, price) {
    const sql = `
        SELECT 
            O.ORDER_DATE,
            S.SUPPLIER_NAME,
            P.PRODUCT_NAME,
            OD.QUANTITY,
            OD.PRICE
        FROM 
            ORDERS O
        JOIN 
            ORDER_DETAILS OD ON O.BUSINESS_ID = OD.BUSINESS_ID AND O.ORDER_ID = OD.ORDER_ID
        JOIN 
            PRODUCTS P ON OD.PRODUCT_ID = P.PRODUCT_ID
        JOIN 
            SUPPLIERS S ON O.SUPPLIER_ID = S.SUPPLIER_ID;
        WHERE
            O.BUSINESS_ID = ? AND 
            OD.PRICE = ?
        ORDER BY 
            O.ORDER_ID;
    `;
    try {
        const [rows] = await pool.query(sql, [business_id, price]);
        if (rows.length) {
            return rows;
        } else {
            throw new Error('No order found with price for the specified business');
        }
    } catch (error) {
        throw new Error('Failed to retrieve order: ' + error.message);
    }
}

export async function getOrderBelowPrice(business_id, price) {
    const sql = `
        SELECT 
            O.ORDER_DATE,
            S.SUPPLIER_NAME,
            P.PRODUCT_NAME,
            OD.QUANTITY,
            OD.PRICE
        FROM 
            ORDERS O
        JOIN 
            ORDER_DETAILS OD ON O.BUSINESS_ID = OD.BUSINESS_ID AND O.ORDER_ID = OD.ORDER_ID
        JOIN 
            PRODUCTS P ON OD.PRODUCT_ID = P.PRODUCT_ID
        JOIN 
            SUPPLIERS S ON O.SUPPLIER_ID = S.SUPPLIER_ID;
        WHERE
            O.BUSINESS_ID = ? AND 
            OD.PRICE <= ?
        ORDER BY 
            O.ORDER_ID;
    `;
    try {
        const [rows] = await pool.query(sql, [business_id, price]);
        if (rows.length) {
            return rows;
        } else {
            throw new Error('No order found with prices lower than given for the specified business');
        }
    } catch (error) {
        throw new Error('Failed to retrieve order: ' + error.message);
    }
}

export async function getOrderAbovePrice(business_id, price) {
    const sql = `
        SELECT 
            O.ORDER_DATE,
            S.SUPPLIER_NAME,
            P.PRODUCT_NAME,
            OD.QUANTITY,
            OD.PRICE
        FROM 
            ORDERS O
        JOIN 
            ORDER_DETAILS OD ON O.BUSINESS_ID = OD.BUSINESS_ID AND O.ORDER_ID = OD.ORDER_ID
        JOIN 
            PRODUCTS P ON OD.PRODUCT_ID = P.PRODUCT_ID
        JOIN 
            SUPPLIERS S ON O.SUPPLIER_ID = S.SUPPLIER_ID;
        WHERE
            O.BUSINESS_ID = ? AND 
            OD.PRICE >= ?
        ORDER BY 
            O.ORDER_ID;
    `;
    try {
        const [rows] = await pool.query(sql, [business_id, price]);
        if (rows.length) {
            return rows;
        } else {
            throw new Error('No order found with prices higher than given for the specified business');
        }
    } catch (error) {
        throw new Error('Failed to retrieve order: ' + error.message);
    }
}

export async function getOrderBetweenPrices(business_id, price_1, price_2) {
    const sql = `
        SELECT 
            O.ORDER_DATE,
            S.SUPPLIER_NAME,
            P.PRODUCT_NAME,
            OD.QUANTITY,
            OD.PRICE
        FROM 
            ORDERS O
        JOIN 
            ORDER_DETAILS OD ON O.BUSINESS_ID = OD.BUSINESS_ID AND O.ORDER_ID = OD.ORDER_ID
        JOIN 
            PRODUCTS P ON OD.PRODUCT_ID = P.PRODUCT_ID
        JOIN 
            SUPPLIERS S ON O.SUPPLIER_ID = S.SUPPLIER_ID;
        WHERE 
            O.BUSINESS_ID = ? AND
            OD.PRICE BETWEEN ? AND ?
        ORDER BY 
            O.ORDER_ID;
    `;
    try {
        const [rows] = await pool.query(sql, [business_id, price_1, price_2]);
        if (rows.length) {
            return rows;
        } else {
            throw new Error('No order found with prices between given for the specified business');
        }
    } catch (error) {
        throw new Error('Failed to retrieve order: ' + error.message);
    }
}

export async function insertOrderWithDetails(business_id, supplier_id, product_id, quantity, price) {
    try {
        // Start a transaction
        await pool.query('START TRANSACTION');

        // Insert into ORDERS table
        const sqlInsertOrder = `
            INSERT INTO Orders (business_id, supplier_id)
            VALUES (?, ?);
        `;
        const [resultOrder] = await pool.query(sqlInsertOrder, [business_id, supplier_id]);
        if (!resultOrder.affectedRows) {
            throw new Error('Failed to insert order');
        }

        // Get the last inserted order ID
        const order_id = resultOrder.insertId;

        // Insert into ORDER_DETAILS table
        const sqlInsertOrderDetails = `
            INSERT INTO ORDER_DETAILS (business_id, order_id, product_id, quantity, price)
            VALUES (?, ?, ?, ?, ?);
        `;
        const [resultOrderDetails] = await pool.query(sqlInsertOrderDetails, [business_id, order_id, product_id, quantity, price]);
        if (!resultOrderDetails.affectedRows) {
            throw new Error('Failed to insert order details');
        }

        // Commit the transaction
        await pool.query('COMMIT');

        return { business_id, order_id, product_id, quantity, price, inserted: true };
    } catch (error) {
        // Rollback the transaction if an error occurs
        await pool.query('ROLLBACK');
        throw new Error('Database operation failed to insert order: ' + error.message);
    }
}


export async function updateOrderDetails(business_id, order_id, product_id, quantity, price) {
    const sql = `
        UPDATE ORDER_DETAILS
        SET quantity = ?, price = ?
        WHERE business_id = ? AND order_id = ? AND product_id = ?;
    `;
    try {
        const [result] = await pool.query(sql, [quantity, price, business_id, order_id, product_id]);
        if (result.affectedRows) {
            return { business_id, order_id, product_id, quantity, price, updated: true };
        } else {
            throw new Error('No order found for the specified business or no update was needed');
        }
    } catch (error) {
        throw new Error('Failed to update order: ' + error.message);
    }
}

export async function deleteOrder(business_id, order_id) {
    try {
        // Start a transaction
        await pool.query('START TRANSACTION');

        // Delete from ORDER_DETAILS table
        const sqlDeleteOrderDetails = `
            DELETE FROM ORDER_DETAILS
            WHERE BUSINESS_ID = ? AND ORDER_ID = ?;
        `;
        const [resultOrderDetails] = await pool.query(sqlDeleteOrderDetails, [business_id, order_id]);

        // Delete from ORDERS table
        const sqlDeleteOrder = `
            DELETE FROM ORDERS
            WHERE BUSINESS_ID = ? AND ORDER_ID = ?;
        `;
        const [resultOrder] = await pool.query(sqlDeleteOrder, [business_id, order_id]);

        // Check if any rows were affected in both tables
        if (resultOrderDetails.affectedRows && resultOrder.affectedRows) {
            // Commit the transaction if both deletes were successful
            await pool.query('COMMIT');
            return { business_id, order_id, deleted: true };
        } else {
            // Rollback the transaction if either delete failed
            await pool.query('ROLLBACK');
            throw new Error('No order found for the specified business');
        }
    } catch (error) {
        throw new Error('Failed to delete order: ' + error.message);
    }
}

export async function getSuppliers(business_id) {
    const sql = `
        SELECT * FROM Suppliers
        WHERE business_id = ?;
    `;
    try {
        const [rows] = await pool.query(sql, [business_id]);
        return rows;
    } catch (error) {
        throw new Error('Failed to retrieve suppliers for business: ' + error.message);
    }
}

export async function getSupplier(business_id, supplier_id) {
    const sql = `
        SELECT * FROM Suppliers
        WHERE business_id = ? AND supplier_id = ?;
    `;
    try {
        const [rows] = await pool.query(sql, [business_id, supplier_id]);
        if (rows.length) {
            return rows[0];
        } else {
            throw new Error('Supplier not found');
        }
    } catch (error) {
        throw new Error('Failed to retrieve supplier for business: ' + error.message);
    }
}

export async function getSupplierInfo(business_id, supplier_id) {
    const sql = `
        SELECT SUPPLIER_NAME, EMAIL, PHONE, ADDRESS, SUPPLIER_CATEGORY 
        FROM Suppliers
        WHERE business_id = ? AND supplier_id = ?;
    `;
    try {
        const [rows] = await pool.query(sql, [business_id, supplier_id]);
        if (rows.length) {
            return rows[0];
        } else {
            throw new Error('Supplier not found');
        }
    } catch (error) {
        throw new Error('Failed to retrieve supplier info: ' + error.message);
    }
}

export async function insertSupplier(business_id, supplier_name, supplier_email, supplier_phone, supplier_address, supplier_category) {
    const sql = `
        INSERT INTO Supplieres (business_id, supplier_name, email, phone, address, supplier_category)
        VALUES (?, ?, ?, ?, ?, ?);
    `;
    try {
        const [result] = await pool.query(sql, [business_id, supplier_name, supplier_email, supplier_phone, supplier_address, supplier_category]);
        if (result.affectedRows) {
            return { business_id, supplier_name, supplier_email, supplier_phone, supplier_address, supplier_category, inserted: true };
        } else {
            throw new Error('Insert failed, no rows affected');
        }
    } catch (error) {
        throw new Error('Failed to insert supplier: ' + error.message);
    }
}

export async function updateSupplier(business_id, supplier_id, supplier_name, supplier_email, supplier_phone, supplier_address, supplier_category) {
    const sql = `
        UPDATE Suppliers
        SET supplier_name = ?,
            email = ?,
            phone = ?,
            address = ?
            supplier_category = ?
        WHERE business_id = ? AND supplier_id = ?;
    `;

    try {
        const [result] = await pool.query(sql, [supplier_name, supplier_email, supplier_phone, supplier_address, supplier_category, business_id, supplier_id ]);
        if (result.affectedRows) {
            return { business_id, supplier_id, supplier_name, supplier_email, supplier_phone, supplier_address, supplier_category };
        } else {
            throw new Error('Supplier not found or no update needed');
        }
    } catch (error) {
        throw new Error('Database operation failed to update supplier: ' + error.message);
    }
}

export async function deleteSupplier(business_id, supplier_id) {
    const sql = `
        DELETE FROM Suppliers
        WHERE business_id = ? AND supplier_id = ?;
    `;

    try {
        const [result] = await pool.query(sql, [business_id, supplier_id]);
        if (result.affectedRows) {
            return;
        } else {
            throw new Error('Supplier not found');
        }
    } catch (error) {
        throw new Error('Database operation failed to delete supplier: ' + error.message);
    }
}