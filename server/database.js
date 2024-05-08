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

export async function getAccountPage(business_id) {
    const sql = `
        SELECT BUS.BUSINESS_ID, BUS.BUSINESS_NAME, BAL.BALANCE
        FROM BUSINESS BUS
        JOIN BALANCE BAL ON BUS.BUSINESS_ID = BAL.BUSINESS_ID
        WHERE BUS.BUSINESS_ID = ?;
    `;
    try {
        const [rows] = await pool.query(sql, [business_id]);
        if (rows.length) {
            return rows[0];
        } else {
            throw new Error('Business account page not found');
        }
    } catch (error) {
        throw new Error('Failed to retrieve business account page: ' + error.message);
    }
}

// ------------------------------------------------------------------------------------------------------------------------------------------------//

// ------------------------------------------------------------- BUSINESS -------------------------------------------------------------------------//

export async function getBusinesses() {
    const sql = `
        SELECT * FROM BUSINESS;
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
        SELECT BUSINESS_ID FROM BUSINESS
        WHERE USERNAME = ? AND PASSWORD = ?;
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
        SELECT * FROM BUSINESS
        WHERE BUSINESS_ID = ?;
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

export async function insertBusiness(username, password, business_name, address) {
    const sql = `
        INSERT INTO BUSINESS (USERNAME, PASSWORD, BUSINESS_NAME, ADDRESS)
        VALUES (?, ?, ?, ?);
    `;
    try {
        const [result] = await pool.query(sql, [username, password, business_name, address]);
        if (result.affectedRows) {
            return { username, password, business_name, inserted: true };
        } else {
            throw new Error('Insert failed, no rows affected');
        }
    } catch (error) {
        throw new Error('Failed to insert business: ' + error.message);
    }
}

// TO DO: update
export async function updateBusiness(business_id, username, password, business_name, address) {
    const sql = `
        UPDATE BUSINESS
        SET USERNAME = ?, BUSINESS_NAME = ?, ADDRESS = ?
        WHERE BUSINESS_ID = ?;
    `;

    try {
        const [result] = await pool.query(sql, [business_id, username, password, business_name, address]);
        if (result.affectedRows) {
            return { business_id, username, password, business_name };
        } else {
            throw new Error('Business not found or no update needed');
        }
    } catch (error) {
        throw new Error('Database operation failed: ' + error.message);
    }
}

export async function deleteBusiness(business_id) {
    const sql = `
        DELETE FROM BUSINESS
        WHERE BUSINESS_ID = ?;
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
    const sql = `
        SELECT 1 FROM BUSINESS 
        WHERE BUSINESS_ID = ?
    `;
    try {
        const [rows] = await pool.query(sql, [business_id]);
        return rows.length > 0;
    } catch (error) {
        throw new Error('Database operation failed: ' + error.message);
    }
}

// ------------------------------------------------------------------------------------------------------------------------------------------------//

// ------------------------------------------------------------ EMPLOYEES -------------------------------------------------------------------------//

export async function getEmployees() {
    const sql = `
        SELECT * FROM EMPLOYEES;
    `;
    try {
        const [rows] = await pool.query(sql);
        return rows;
    } catch (error) {
        throw new Error('Failed to retrieve all employees: ' + error.message);
    }
}

export async function getEmployeesByBusiness(business_id) {
    const sql = `
        SELECT * FROM EMPLOYEES
        WHERE BUSINESS_ID = ?;
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
        SELECT * FROM EMPLOYEES
        WHERE EMPLOYEE_ID = ? AND BUSINESS_ID = ?;
    `;
    try {
        const [rows] = await pool.query(sql, [employee_id, business_id]);
        if (rows.length) {
            return rows[0];
        } else {
            throw new Error('Employee not found');
        }
    } catch (error) {
        throw new Error('Failed to retrieve employee: ' + error.message);
    }
}

export async function insertEmployee(business_id, first_name, last_name, email, phone, address, salary) {
    const sql = `
        INSERT INTO EMPLOYEES (BUSINESS_ID, FIRST_NAME, LAST_NAME, EMAIL, PHONE, ADDRESS, SALARY)
        VALUES (?, ?, ?, ?, ?, ?, ?);
    `;
    try {
        const [result] = await pool.query(sql, [business_id, first_name, last_name, email, phone, address, salary]);
        if (result.affectedRows) {
            return { business_id, first_name, last_name, email, phone, address, salary, inserted: true };
        } else {
            throw new Error('Failed to insert employee');
        }
    } catch (error) {
        throw new Error('Database operation failed: ' + error.message);
    }
}

export async function updateEmployee(business_id, employee_id, first_name, last_name, email, phone, address, salary) {
    const sql = `
        UPDATE EMPLOYEES
        SET FIRST_NAME = ?, LAST_NAME = ?, EMAIL = ?, PHONE = ?, ADDRESS = ?, SALARY = ?
        WHERE EMPLOYEE_ID = ? AND BUSINESS_ID = ?;
    `;
    try {
        const [result] = await pool.query(sql, [first_name, last_name, email, phone, address, salary, employee_id, business_id]);
        if (result.affectedRows) {
            return { employee_id, business_id, first_name, last_name, email, phone, address, salary, updated: true };
        } else {
            throw new Error('No employee found for update');
        }
    } catch (error) {
        throw new Error('Failed to update employee: ' + error.message);
    }
}

export async function deleteEmployee(business_id, employee_id) {
    const sql = `
        DELETE FROM EMPLOYEES
        WHERE EMPLOYEE_ID = ? AND BUSINESS_ID = ?;
    `;
    try {
        const [result] = await pool.query(sql, [employee_id, business_id]);
        if (result.affectedRows) {
            return { employee_id, business_id, deleted: true };
        } else {
            throw new Error('No employee found to delete');
        }
    } catch (error) {
        throw new Error('Failed to delete employee: ' + error.message);
    }
}

// ------------------------------------------------------------------------------------------------------------------------------------------------//

// ------------------------------------------------------------- PRODUCTS -------------------------------------------------------------------------//

export async function insertProduct(business_id, category_name, product_name, product_description, quantity, reorder_level, reorder_quantity, price, supplier_id) {
    const sqlProduct = `
        INSERT INTO PRODUCTS (BUSINESS_ID, CATEGORY_NAME, PRODUCT_NAME, PRODUCT_DESCRIPTION, QUANTITY, REORDER_LEVEL, REORDER_QUANTITY, PRICE)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?);
    `;
    try {
        // Check if the business exists
        const checkBusiness = await checkBusinessExists(business_id);
        if (!checkBusiness) {
            throw new Error('Business does not exist.');
        }

        // Insert the product
        const [result] = await pool.query(sqlProduct, [business_id, category_name, product_name, product_description, quantity, reorder_level, reorder_quantity, price]);
        const product_id = result.insertId;

        // Handle supplier_id, assuming it's provided
        if (supplier_id) {
            const sqlJunction = `
                INSERT INTO business_product_supplier (business_id, product_id, supplier_id)
                VALUES (?, ?, ?);
            `;

            // Optionally, check if the supplier exists
            const checkSupplier = await checkSupplierExists(supplier_id, business_id);
            if (!checkSupplier) {
                throw new Error(`Supplier with ID ${supplier_id} does not exist in this business.`);
            }
            await pool.query(sqlJunction, [business_id, product_id, supplier_id]);
        }

        return { product_id, inserted: true };
    } catch (error) {
        throw new Error('Failed to insert product: ' + error.message);
    }
}

export async function getProductNameByBusiness(business_id, product_name) {
    const sql = `
        SELECT * FROM PRODUCTS 
        WHERE BUSINESS_ID = ? AND PRODUCT_NAME = ?;
    `;
    try {
        // Check if the business exists
        const checkBusiness = await checkBusinessExists(business_id);
        if (!checkBusiness) {
            throw new Error('Business does not exist.');
        }

        const [rows] = await pool.query(sql, [business_id, product_name]);
        return rows;
    } catch (error) {
        throw new Error('Failed to retrieve products: ' + error.message);
    }
}

export async function getProductsByBusiness(business_id) {
    const sql = `
        SELECT * FROM PRODUCTS 
        WHERE BUSINESS_ID = ?;
    `;
    try {
        // Check if the business exists
        const checkBusiness = await checkBusinessExists(business_id);
        if (!checkBusiness) {
            throw new Error('Business does not exist.');
        }

        const [rows] = await pool.query(sql, [business_id]);
        return rows;
    } catch (error) {
        throw new Error('Failed to retrieve products: ' + error.message);
    }
}

export async function getProductByBusiness(product_id, business_id) {
    const sql = `
        SELECT * FROM PRODUCTS 
        WHERE PRODUCT_ID = ? AND BUSINESS_ID = ?;
    `;
    try {
        // Check if the product exists for the business
        const checkProduct = await checkProductExists(product_id, business_id);
        if (!checkProduct) {
            throw new Error('Product does not exist for this business.');
        }

        const [rows] = await pool.query(sql, [product_id, business_id]);
        return rows;
    } catch (error) {
        throw new Error('Failed to retrieve products: ' + error.message);
    }
}

export async function updateProduct(product_id, business_id, updates) {
    const { category_name, product_name, product_description, quantity, reorder_level, reorder_quantity, price } = updates;
    const sql = `
        UPDATE PRODUCTS
        SET CATEGORY_NAME = ?, PRODUCT_NAME = ?, PRODUCT_DESCRIPTION = ?, QUANTITY = ?, REORDER_LEVEL = ?, REORDER_QUANTITY = ?, PRICE = ?
        WHERE PRODUCT_ID = ? AND BUSINESS_ID = ?;
    `;
    try {
        // Check if the product exists for the business
        const checkProduct = await checkProductExists(product_id, business_id);
        if (!checkProduct) {
            throw new Error('Product does not exist for this business.');
        }

        const [result] = await pool.query(sql, [category_name, product_name, product_description, quantity, reorder_level, reorder_quantity, price, product_id, business_id]);
        if (result.affectedRows) {
            return { updated: true };
        } else {
            throw new Error('No product found for update');
        }
    } catch (error) {
        throw new Error('Failed to update product: ' + error.message);
    }
}

export async function deleteProduct(product_id, business_id) {
    const sqlDeleteProduct = `
        DELETE FROM PRODUCTS 
        WHERE PRODUCT_ID = ? AND BUSINESS_ID = ?;
    `;
    const sqlDeleteRelationships = `
        DELETE FROM business_product_supplier
        WHERE product_id = ? AND business_id = ?;
    `;
    try {
        const checkProduct = await checkProductExists(product_id, business_id);
        if (!checkProduct) {
            throw new Error('Product does not exist for this business.');
        }

        // First, remove relationships from junction table
        await pool.query(sqlDeleteRelationships, [product_id, business_id]);

        // Then, delete the product
        const [result] = await pool.query(sqlDeleteProduct, [product_id, business_id]);
        return { deleted: true };
    } catch (error) {
        throw new Error('Failed to delete product: ' + error.message);
    }
}

async function checkProductExists(business_id, product_id) {
    const sql = `
        SELECT 1 FROM PRODUCTS 
        WHERE PRODUCT_ID = ? AND BUSINESS_ID = ?;
    `;
    try {
        const [rows] = await pool.query(sql, [product_id, business_id]);
        return rows.length > 0;
    } catch (error) {
        throw new Error('Database operation failed: ' + error.message);
    }
}

// ------------------------------------------------------------------------------------------------------------------------------------------------//

// ------------------------------------------------------------ SUPPLIERS -------------------------------------------------------------------------//

export async function insertSupplier(business_id, supplier_name, email, phone, address, supplier_category) {
    const sql = `
        INSERT INTO SUPPLIERS (BUSINESS_ID, SUPPLIER_NAME, EMAIL, PHONE, ADDRESS, SUPPLIER_CATEGORY)
        VALUES (?, ?, ?, ?, ?, ?);
    `;
    try {
        // Check if the business exists
        const checkBusiness = await checkBusinessExists(business_id);
        if (!checkBusiness) {
            throw new Error('Business does not exist.');
        }

        const [result] = await pool.query(sql, [business_id, supplier_name, email, phone, address, supplier_category]);
        return { supplier_id: result.insertId, inserted: true };
    } catch (error) {
        throw new Error('Failed to insert supplier: ' + error.message);
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

export async function getSuppliersByBusiness(business_id) {
    const sql = `
        SELECT * FROM SUPPLIERS 
        WHERE BUSINESS_ID = ?;
    `;
    try {
        // Check if the business exists
        const checkBusiness = await checkBusinessExists(business_id);
        if (!checkBusiness) {
            throw new Error('Business does not exist.');
        }

        const [rows] = await pool.query(sql, [business_id]);
        return rows;
    } catch (error) {
        throw new Error('Failed to retrieve suppliers: ' + error.message);
    }
}

export async function getSupplier(supplier_id, business_id) {
    const sql = `
        SELECT * FROM SUPPLIERS 
        WHERE SUPPLIER_ID = ? AND BUSINESS_ID = ?;
    `;
    try {
        // Check if the supplier exists for the business
        const checkSupplier = await checkSupplierExists(supplier_id, business_id);
        if (!checkSupplier) {
            throw new Error('Supplier does not exist for this business.');
        }

        const [rows] = await pool.query(sql, [supplier_id, business_id]);
        return rows[0];
    } catch (error) {
        throw new Error('Failed to retrieve supplier: ' + error.message);
    }
}

export async function updateSupplier(supplier_id, business_id, updates) {
    const { supplier_name, email, phone, address, supplier_category } = updates;
    const sql = `
        UPDATE SUPPLIERS
        SET SUPPLIER_NAME = ?, EMAIL = ?, PHONE = ?, ADDRESS = ?, SUPPLIER_CATEGORY = ?
        WHERE SUPPLIER_ID = ? AND BUSINESS_ID = ?;
    `;
    try {
        // Check if the supplier exists for the business
        const checkSupplier = await checkSupplierExists(supplier_id, business_id);
        if (!checkSupplier) {
            throw new Error('Supplier does not exist for this business.');
        }

        const [result] = await pool.query(sql, [supplier_name, email, phone, address, supplier_category, supplier_id, business_id]);
        if (result.affectedRows) {
            return { updated: true };
        } else {
            throw new Error('No supplier found for update');
        }
    } catch (error) {
        throw new Error('Failed to update supplier: ' + error.message);
    }
}

export async function deleteSupplier(supplier_id, business_id) {
    const sql = `
        DELETE FROM SUPPLIERS 
        WHERE SUPPLIER_ID = ? AND BUSINESS_ID = ?;
    `;
    try {
        // Check if the supplier exists for the business
        const checkSupplier = await checkSupplierExists(supplier_id, business_id);
        if (!checkSupplier) {
            throw new Error('Supplier does not exist for this business.');
        }

        const [result] = await pool.query(sql, [supplier_id, business_id]);
        if (result.affectedRows) {
            return { deleted: true };
        } else {
            throw new Error('No supplier found to delete');
        }
    } catch (error) {
        throw new Error('Failed to delete supplier: ' + error.message);
    }
}

async function checkSupplierExists(supplier_id, business_id) {
    const sql = `
        SELECT 1 FROM SUPPLIERS 
        WHERE SUPPLIER_ID = ? AND BUSINESS_ID = ?;
    `;
    try {
        const [rows] = await pool.query(sql, [supplier_id, business_id]);
        return rows.length > 0;
    } catch (error) {
        throw new Error('Database operation failed: ' + error.message);
    }
}

// ------------------------------------------------------------------------------------------------------------------------------------------------//

// ------------------------------------------------------------ CUSTOMERS -------------------------------------------------------------------------//

export async function insertCustomer(business_id, first_name, last_name, email, phone, address) {
    const sql = `
        INSERT INTO CUSTOMERS (BUSINESS_ID, FIRST_NAME, LAST_NAME, EMAIL, PHONE, ADDRESS)
        VALUES (?, ?, ?, ?, ?, ?);
    `;
    try {
        // Check if the business exists
        const checkBusiness = await checkBusinessExists(business_id);
        if (!checkBusiness) {
            throw new Error('Business does not exist.');
        }

        const [result] = await pool.query(sql, [business_id, first_name, last_name, email, phone, address]);
        return { customer_id: result.insertId, inserted: true };
    } catch (error) {
        throw new Error('Failed to insert customer: ' + error.message);
    }
}

export async function getCustomersByBusiness(business_id) {
    const sql = `
        SELECT * FROM CUSTOMERS 
        WHERE BUSINESS_ID = ?;
    `;
    try {
        // Check if the business exists
        const checkBusiness = await checkBusinessExists(business_id);
        if (!checkBusiness) {
            throw new Error('Business does not exist.');
        }

        const [rows] = await pool.query(sql, [business_id]);
        return rows;
    } catch (error) {
        throw new Error('Failed to retrieve customers: ' + error.message);
    }
}

export async function getCustomerByBusiness(customer_id, business_id) {
    const sql = `
        SELECT * FROM CUSTOMERS 
        WHERE CUSTOMER_ID = ? AND BUSINESS_ID = ?;
    `;
    try {
        // Check if the customer exists for the business
        const checkCustomer = await checkCustomerExists(customer_id, business_id);
        if (!checkCustomer) {
            throw new Error('Customer does not exist for this business.');
        }

        const [rows] = await pool.query(sql, [customer_id, business_id]);
        return rows[0];
    } catch (error) {
        throw new Error('Failed to retrieve customer: ' + error.message);
    }
}

export async function updateCustomer(customer_id, business_id, updates) {
    const { first_name, last_name, email, phone, address } = updates;
    const sql = `
        UPDATE CUSTOMERS
        SET FIRST_NAME = ?, LAST_NAME = ?, EMAIL = ?, PHONE = ?, ADDRESS = ?
        WHERE CUSTOMER_ID = ? AND BUSINESS_ID = ?;
    `;
    try {
        // Check if the customer exists for the business
        const checkCustomer = await checkCustomerExists(customer_id, business_id);
        if (!checkCustomer) {
            throw new Error('Customer does not exist for this business.');
        }

        const [result] = await pool.query(sql, [first_name, last_name, email, phone, address, customer_id, business_id]);
        if (result.affectedRows) {
            return { updated: true };
        } else {
            throw new Error('No customer found for update');
        }
    } catch (error) {
        throw new Error('Failed to update customer: ' + error.message);
    }
}

export async function deleteCustomer(customer_id, business_id) {
    const sql = `
        DELETE FROM CUSTOMERS 
        WHERE CUSTOMER_ID = ? AND BUSINESS_ID = ?;
    `;
    try {
        // Check if the customer exists for the business
        const checkCustomer = await checkCustomerExists(customer_id, business_id);
        if (!checkCustomer) {
            throw new Error('Customer does not exist for this business.');
        }

        const [result] = await pool.query(sql, [customer_id, business_id]);
        if (result.affectedRows) {
            return { deleted: true };
        } else {
            throw new Error('No customer found to delete');
        }
    } catch (error) {
        throw new Error('Failed to delete customer: ' + error.message);
    }
}

async function checkCustomerExists(customer_id, business_id) {
    const sql = `
        SELECT 1 FROM CUSTOMERS 
        WHERE CUSTOMER_ID = ? AND BUSINESS_ID = ?;
    `;
    try {
        const [rows] = await pool.query(sql, [customer_id, business_id]);
        return rows.length > 0;
    } catch (error) {
        throw new Error('Database operation failed: ' + error.message);
    }
}

// ------------------------------------------------------------------------------------------------------------------------------------------------//

// ---------------------------------------------------------------- SALES -------------------------------------------------------------------------//

export async function insertSale(business_id, product_id, quantity, payment_details, price) {
    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();

        const checkBusiness = await checkBusinessExists(business_id, connection);
        if (!checkBusiness) {
            throw new Error('Business does not exist.');
        }

        const productSql = `
            SELECT QUANTITY FROM PRODUCTS 
            WHERE PRODUCT_ID = ? AND BUSINESS_ID = ?
        `;
        const [product] = await connection.query(productSql, [product_id, business_id]);
        if (product.length === 0) {
            throw new Error('Product does not exist.');
        }
        if (product[0].QUANTITY < quantity) {
            throw new Error('Not enough stock.');
        }

        const newQuantity = product[0].QUANTITY - quantity;
        const updateProductSql = `
            UPDATE PRODUCTS SET QUANTITY = ? 
            WHERE PRODUCT_ID = ? AND BUSINESS_ID = ?
        `;
        await connection.query(updateProductSql, [newQuantity, product_id, business_id]);

        const sql = `
            INSERT INTO SALES (BUSINESS_ID, PRODUCT_ID, QUANTITY, PAYMENT_DETAILS, PRICE)
            VALUES (?, ?, ?, ?, ?);
        `;
        const [result] = await connection.query(sql, [business_id, product_id, quantity, order_date, payment_details, price]);

        const balanceSql = `
            UPDATE BALANCE 
            SET BALANCE = BALANCE + ? 
            WHERE BUSINESS_ID = ?
        `;
        await connection.query(balanceSql, [price * quantity, business_id]);

        await connection.commit();
        return { sale_id: result.insertId, inserted: true };
    } catch (error) {
        await connection.rollback();
        throw new Error('Failed to insert sale: ' + error.message);
    } finally {
        connection.release();
    }
}

export async function getSalesByBusiness(business_id) {
    const sql = `
        SELECT * FROM SALES 
        WHERE BUSINESS_ID = ?;
    `;
    try {
        // Check if the business exists
        const checkBusiness = await checkBusinessExists(business_id);
        if (!checkBusiness) {
            throw new Error('Business does not exist.');
        }

        const [rows] = await pool.query(sql, [business_id]);
        return rows;
    } catch (error) {
        throw new Error('Failed to retrieve sales: ' + error.message);
    }
}

export async function getSaleByBusiness(sale_id, business_id) {
    const sql = `
        SELECT * FROM SALES 
        WHERE SALE_ID = ? AND BUSINESS_ID = ?;
    `;
    try {
        // Check if the sale exists for the business
        const checkSale = await checkSaleExists(sale_id, business_id);
        if (!checkSale) {
            throw new Error('Sale does not exist for this business.');
        }

        const [rows] = await pool.query(sql, [sale_id, business_id]);
        return rows[0];
    } catch (error) {
        throw new Error('Failed to retrieve sale: ' + error.message);
    }
}

export async function updateSale(sale_id, business_id, updates) {
    const { product_id, quantity, order_date, payment_details, price } = updates;
    const sql = `
        UPDATE SALES
        SET PRODUCT_ID = ?, QUANTITY = ?, ORDER_DATE = ?, PAYMENT_DETAILS = ?, PRICE = ?
        WHERE SALE_ID = ? AND BUSINESS_ID = ?;
    `;
    try {
        // Check if the sale exists for the business
        const checkSale = await checkSaleExists(sale_id, business_id);
        if (!checkSale) {
            throw new Error('Sale does not exist for this business.');
        }

        const [result] = await pool.query(sql, [product_id, quantity, order_date, payment_details, price, sale_id, business_id]);
        if (result.affectedRows) {
            return { updated: true };
        } else {
            throw new Error('No sale found for update');
        }
    } catch (error) {
        throw new Error('Failed to update sale: ' + error.message);
    }
}

export async function deleteSale(sale_id, business_id) {
    const sql = `
        DELETE FROM SALES 
        WHERE SALE_ID = ? AND BUSINESS_ID = ?;
    `;
    try {
        // Check if the sale exists for the business
        const checkSale = await checkSaleExists(sale_id, business_id);
        if (!checkSale) {
            throw new Error('Sale does not exist for this business.');
        }

        const [result] = await pool.query(sql, [sale_id, business_id]);
        if (result.affectedRows) {
            return { deleted: true };
        } else {
            throw new Error('No sale found to delete');
        }
    } catch (error) {
        throw new Error('Failed to delete sale: ' + error.message);
    }
}

async function checkSaleExists(sale_id, business_id) {
    const sql = `
        SELECT 1 FROM SALES 
        WHERE SALE_ID = ? AND BUSINESS_ID = ?;
    `;
    try {
        const [rows] = await pool.query(sql, [sale_id, business_id]);
        return rows.length > 0;
    } catch (error) {
        throw new Error('Database operation failed: ' + error.message);
    }
}

// ------------------------------------------------------------------------------------------------------------------------------------------------//

// -------------------------------------------------------------- BALANCE -------------------------------------------------------------------------//

export async function insertBalance(business_id, balance) {
    const sql = `
        INSERT INTO BALANCE (BUSINESS_ID, BALANCE)
        VALUES (?, ?);
    `;
    try {
        // Check if the business exists
        const checkBusiness = await checkBusinessExists(business_id);
        if (!checkBusiness) {
            throw new Error('Business does not exist.');
        }

        const [result] = await pool.query(sql, [business_id, balance]);
        return { balance_id: result.insertId, inserted: true };
    } catch (error) {
        throw new Error('Failed to insert balance: ' + error.message);
    }
}

export async function getBalanceByBusiness(business_id) {
    const sql = `
        SELECT * FROM BALANCE 
        WHERE BUSINESS_ID = ?;
    `;
    try {
        // Check if the business exists
        const checkBusiness = await checkBusinessExists(business_id);
        if (!checkBusiness) {
            throw new Error('Business does not exist.');
        }

        const [rows] = await pool.query(sql, [business_id]);
        return rows;
    } catch (error) {
        throw new Error('Failed to retrieve balance: ' + error.message);
    }
}

export async function updateBalance(balance_id, business_id, new_balance) {
    const sql = `
        UPDATE BALANCE
        SET BALANCE = ?
        WHERE BALANCE_ID = ? AND BUSINESS_ID = ?;
    `;
    try {
        // Check if the balance exists for the business
        const checkBalance = await checkBalanceExists(balance_id, business_id);
        if (!checkBalance) {
            throw new Error('Balance record does not exist for this business.');
        }

        const [result] = await pool.query(sql, [new_balance, balance_id, business_id]);
        if (result.affectedRows) {
            return { updated: true };
        } else {
            throw new Error('No balance record found for update');
        }
    } catch (error) {
        throw new Error('Failed to update balance: ' + error.message);
    }
}

export async function deleteBalance(balance_id, business_id) {
    const sql = `
        DELETE FROM BALANCE 
        WHERE BALANCE_ID = ? AND BUSINESS_ID = ?;
    `;
    try {
        // Check if the balance exists for the business
        const checkBalance = await checkBalanceExists(balance_id, business_id);
        if (!checkBalance) {
            throw new Error('Balance record does not exist for this business.');
        }

        const [result] = await pool.query(sql, [balance_id, business_id]);
        if (result.affectedRows) {
            return { deleted: true };
        } else {
            throw new Error('No balance record found to delete');
        }
    } catch (error) {
        throw new Error('Failed to delete balance: ' + error.message);
    }
}

async function checkBalanceExists(balance_id, business_id) {
    const sql = `
        SELECT 1 FROM BALANCE 
        WHERE BALANCE_ID = ? AND BUSINESS_ID = ?;
    `;
    try {
        const [rows] = await pool.query(sql, [balance_id, business_id]);
        return rows.length > 0;
    } catch (error) {
        throw new Error('Database operation failed: ' + error.message);
    }
}

// ------------------------------------------------------------------------------------------------------------------------------------------------//

// --------------------------------------------------------------- ORDERS -------------------------------------------------------------------------//

export async function insertOrderWithDetails(business_id, product_id, quantity, price) {
    const sqlOrder = `
        INSERT INTO ORDERS (BUSINESS_ID, PRODUCT_ID, QUANTITY, PRICE)
        VALUES (?, ?, ?, ?);
    `;
    try {
        const checkBusiness = await checkBusinessExists(business_id);
        if (!checkBusiness) {
            throw new Error('Business does not exist.');
        }

        const [orderResult] = await pool.query(sqlOrder, [business_id, product_id, quantity, price]);
        const supplier_id = determineSupplierForProduct(product_id);

        const sqlJunction = `
            INSERT INTO business_orders_suppliers (business_id, order_id, supplier_id)
            VALUES (?, ?, ?);
        `;
        await pool.query(sqlJunction, [business_id, orderResult.insertId, supplier_id]);

        return { order_id: orderResult.insertId, inserted: true };
    } catch (error) {
        throw new Error('Failed to insert order: ' + error.message);
    }
}

// export async function getOrdersByBusiness(business_id) {
//     const sql = `
//         SELECT * FROM ORDERS 
//         WHERE BUSINESS_ID = ?;
//     `;
//     try {
//         // Check if the business exists
//         const checkBusiness = await checkBusinessExists(business_id);
//         if (!checkBusiness) {
//             throw new Error('Business does not exist.');
//         }

//         const [rows] = await pool.query(sql, [business_id]);
//         return rows;
//     } catch (error) {
//         throw new Error('Failed to retrieve orders: ' + error.message);
//     }
// }

export async function getOrderById(business_id, order_id) {
    const sql = `
        SELECT * FROM ORDERS 
        WHERE ORDER_ID = ? AND BUSINESS_ID = ?;
    `;
    try {
        // Check if the order exists for the business
        const checkOrder = await checkOrderExists(order_id, business_id);
        if (!checkOrder) {
            throw new Error('Order does not exist for this business.');
        }

        const [rows] = await pool.query(sql, [order_id, business_id]);
        return rows[0];
    } catch (error) {
        throw new Error('Failed to retrieve order: ' + error.message);
    }
}

export async function getOrders(business_id) {
    const sql = `
        SELECT 
            O.ORDER_ID,
            O.ORDER_DATE,
            P.PRODUCT_NAME,
            O.QUANTITY,
            O.PRICE,
            S.SUPPLIER_NAME
        FROM 
            ORDERS O
        INNER JOIN 
            PRODUCTS P ON O.PRODUCT_ID = P.PRODUCT_ID
        INNER JOIN 
            business_orders_suppliers BOS ON O.ORDER_ID = BOS.order_id
        INNER JOIN 
            SUPPLIERS S ON BOS.supplier_id = S.SUPPLIER_ID
        WHERE
            O.BUSINESS_ID = ?
        ORDER BY 
            O.ORDER_DATE DESC;
    `;
    try {
        const checkBusiness = await checkBusinessExists(business_id);
        if (!checkBusiness) {
            throw new Error('Business does not exist.');
        }

        const [rows] = await pool.query(sql, [business_id]);
        return rows;
    } catch (error) {
        throw new Error('Failed to retrieve orders for business: ' + error.message);
    }
}

export async function getOrderDetailsById(order_id, business_id) {
    const sql = `
        SELECT 
            O.ORDER_DATE,
            P.PRODUCT_NAME,
            O.QUANTITY,
            O.PRICE,
            S.SUPPLIER_NAME
        FROM 
            ORDERS O
        JOIN 
            PRODUCTS P ON O.PRODUCT_ID = P.PRODUCT_ID
        JOIN 
            business_orders_suppliers BOS ON O.ORDER_ID = BOS.order_id
        JOIN 
            SUPPLIERS S ON BOS.supplier_id = S.SUPPLIER_ID
        WHERE 
            O.BUSINESS_ID = ? AND O.ORDER_ID = ?
        ORDER BY 
            O.ORDER_DATE;
    `;
    try {
        // Check if the order exists for the business
        const checkOrder = await checkOrderExists(order_id, business_id);
        if (!checkOrder) {
            throw new Error('Order does not exist for this business.');
        }

        const [rows] = await pool.query(sql, [business_id, order_id]);
        if (rows.length) {
            return rows;
        } else {
            throw new Error('No order found for the specified business and order ID');
        }
    } catch (error) {
        throw new Error('Failed to retrieve order details: ' + error.message);
    }
}

export async function getOrderBySupplier(business_id, supplier_id) {
    const sql = `
        SELECT 
            O.ORDER_DATE,
            S.SUPPLIER_NAME,
            P.PRODUCT_NAME,
            O.QUANTITY,
            O.PRICE
        FROM 
            ORDERS O
        JOIN 
            PRODUCTS P ON O.PRODUCT_ID = P.PRODUCT_ID
        JOIN 
            business_orders_suppliers BOS ON O.ORDER_ID = BOS.order_id
        JOIN 
            SUPPLIERS S ON BOS.supplier_id = S.SUPPLIER_ID
        WHERE
            O.BUSINESS_ID = ? AND 
            S.SUPPLIER_ID = ?
        ORDER BY 
            O.ORDER_DATE;
    `;
    try {
        // Check if the supplier exists for the business
        const checkSupplier = await checkSupplierExists(supplier_id, business_id);
        if (!checkSupplier) {
            throw new Error('Supplier does not exist for this business.');
        }

        const [rows] = await pool.query(sql, [business_id, supplier_id]);
        if (rows.length) {
            return rows;
        } else {
            throw new Error('No order found for the specified business and supplier');
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
            O.QUANTITY,
            O.PRICE
        FROM 
            ORDERS O
        JOIN 
            PRODUCTS P ON O.PRODUCT_ID = P.PRODUCT_ID
        JOIN 
            SUPPLIERS S ON O.SUPPLIER_ID = S.SUPPLIER_ID
        WHERE
            O.BUSINESS_ID = ? AND 
            DATE(O.ORDER_DATE) = DATE(?)
        ORDER BY 
            O.ORDER_DATE;
    `;
    try {
        const checkBusiness = await checkBusinessExists(business_id);
        if (!checkBusiness) {
            throw new Error('Business does not exist.');
        }

        const [rows] = await pool.query(sql, [business_id, order_date]);
        if (rows.length) {
            return rows;
        } else {
            throw new Error('No order found on date for the specified business');
        }
    } catch (error) {
        throw new Error('Failed to retrieve orders: ' + error.message);
    }
}

export async function getOrderBeforeDate(business_id, order_date) {
    const sql = `
        SELECT 
            O.ORDER_DATE,
            S.SUPPLIER_NAME,
            P.PRODUCT_NAME,
            O.QUANTITY,
            O.PRICE
        FROM 
            ORDERS O
        JOIN 
            PRODUCTS P ON O.PRODUCT_ID = P.PRODUCT_ID
        JOIN 
            SUPPLIERS S ON O.SUPPLIER_ID = S.SUPPLIER_ID
        WHERE
            O.BUSINESS_ID = ? AND 
            DATE(O.ORDER_DATE) <= DATE(?)
        ORDER BY 
            O.ORDER_DATE;
    `;
    try {
        const checkBusiness = await checkBusinessExists(business_id);
        if (!checkBusiness) {
            throw new Error('Business does not exist.');
        }

        const [rows] = await pool.query(sql, [business_id, order_date]);
        if (rows.length) {
            return rows;
        } else {
            throw new Error('No order found before date for the specified business');
        }
    } catch (error) {
        throw new Error('Failed to retrieve orders: ' + error.message);
    }
}

export async function getOrderAfterDate(business_id, order_date) {
    const sql = `
        SELECT 
            O.ORDER_DATE,
            S.SUPPLIER_NAME,
            P.PRODUCT_NAME,
            O.QUANTITY,
            O.PRICE
        FROM 
            ORDERS O
        JOIN 
            PRODUCTS P ON O.PRODUCT_ID = P.PRODUCT_ID
        JOIN 
            SUPPLIERS S ON O.SUPPLIER_ID = S.SUPPLIER_ID
        WHERE
            O.BUSINESS_ID = ? AND 
            DATE(O.ORDER_DATE) >= DATE(?)
        ORDER BY 
            O.ORDER_DATE;
    `;
    try {
        const checkBusiness = await checkBusinessExists(business_id);
        if (!checkBusiness) {
            throw new Error('Business does not exist.');
        }

        const [rows] = await pool.query(sql, [business_id, order_date]);
        if (rows.length) {
            return rows;
        } else {
            throw new Error('No order found after date for the specified business');
        }
    } catch (error) {
        throw new Error('Failed to retrieve orders: ' + error.message);
    }
}

export async function getOrderBetweenDates(business_id, order_date_1, order_date_2) {
    const sql = `
        SELECT 
            O.ORDER_DATE,
            S.SUPPLIER_NAME,
            P.PRODUCT_NAME,
            O.QUANTITY,
            O.PRICE
        FROM 
            ORDERS O
        JOIN 
            PRODUCTS P ON O.PRODUCT_ID = P.PRODUCT_ID
        JOIN 
            SUPPLIERS S ON O.SUPPLIER_ID = S.SUPPLIER_ID
        WHERE 
            O.BUSINESS_ID = ? AND
            DATE(O.ORDER_DATE) BETWEEN DATE(?) AND DATE(?)
        ORDER BY 
            O.ORDER_DATE;
    `;
    try {
        const checkBusiness = await checkBusinessExists(business_id);
        if (!checkBusiness) {
            throw new Error('Business does not exist.');
        }

        const [rows] = await pool.query(sql, [business_id, order_date_1, order_date_2]);
        if (rows.length) {
            return rows;
        } else {
            throw new Error('No orders found between the specified dates for the business');
        }
    } catch (error) {
        throw new Error('Failed to retrieve orders: ' + error.message);
    }
}

export async function getOrderDetailsByProduct(business_id, product_id) {
    const sql = `
        SELECT 
            O.ORDER_DATE,
            S.SUPPLIER_NAME,
            P.PRODUCT_NAME,
            O.QUANTITY,
            O.PRICE
        FROM 
            ORDERS O
        JOIN 
            PRODUCTS P ON O.PRODUCT_ID = P.PRODUCT_ID
        JOIN 
            business_orders_suppliers BOS ON O.ORDER_ID = BOS.order_id
        JOIN 
            SUPPLIERS S ON BOS.supplier_id = S.SUPPLIER_ID
        WHERE
            O.BUSINESS_ID = ? AND 
            P.PRODUCT_ID = ?
        ORDER BY 
            O.ORDER_DATE;
    `;
    try {
        // Check if the product exists for the business
        const checkProduct = await checkProductExists(product_id, business_id);
        if (!checkProduct) {
            throw new Error('Product does not exist for this business.');
        }

        const [rows] = await pool.query(sql, [business_id, product_id]);
        if (rows.length) {
            return rows;
        } else {
            throw new Error('No order found with the specified product for the business');
        }
    } catch (error) {
        throw new Error('Failed to retrieve order details: ' + error.message);
    }
}

export async function getOrderDetailsByPrice(business_id, price) {
    const sql = `
        SELECT 
            O.ORDER_DATE,
            S.SUPPLIER_NAME,
            P.PRODUCT_NAME,
            O.QUANTITY,
            O.PRICE
        FROM 
            ORDERS O
        JOIN 
            PRODUCTS P ON O.PRODUCT_ID = P.PRODUCT_ID
        JOIN 
            SUPPLIERS S ON O.SUPPLIER_ID = S.SUPPLIER_ID
        WHERE
            O.BUSINESS_ID = ? AND 
            O.PRICE = ?
        ORDER BY 
            O.ORDER_DATE;
    `;
    try {
        const checkBusiness = await checkBusinessExists(business_id);
        if (!checkBusiness) {
            throw new Error('Business does not exist.');
        }

        const [rows] = await pool.query(sql, [business_id, price]);
        if (rows.length) {
            return rows;
        } else {
            throw new Error('No order found with the specified price for the business');
        }
    } catch (error) {
        throw new Error('Failed to retrieve order details: ' + error.message);
    }
}

export async function getOrderBelowPrice(business_id, price) {
    const sql = `
        SELECT 
            O.ORDER_DATE,
            S.SUPPLIER_NAME,
            P.PRODUCT_NAME,
            O.QUANTITY,
            O.PRICE
        FROM 
            ORDERS O
        JOIN 
            PRODUCTS P ON O.PRODUCT_ID = P.PRODUCT_ID
        JOIN 
            SUPPLIERS S ON O.SUPPLIER_ID = S.SUPPLIER_ID
        WHERE
            O.BUSINESS_ID = ? AND 
            O.PRICE <= ?
        ORDER BY 
            O.ORDER_DATE;
    `;
    try {
        const checkBusiness = await checkBusinessExists(business_id);
        if (!checkBusiness) {
            throw new Error('Business does not exist.');
        }

        const [rows] = await pool.query(sql, [business_id, price]);
        if (rows.length) {
            return rows;
        } else {
            throw new Error('No order found with prices lower than given for the specified business');
        }
    } catch (error) {
        throw new Error('Failed to retrieve orders: ' + error.message);
    }
}

export async function getOrderAbovePrice(business_id, price) {
    const sql = `
        SELECT 
            O.ORDER_DATE,
            S.SUPPLIER_NAME,
            P.PRODUCT_NAME,
            O.QUANTITY,
            O.PRICE
        FROM 
            ORDERS O
        JOIN 
            PRODUCTS P ON O.PRODUCT_ID = P.PRODUCT_ID
        JOIN 
            SUPPLIERS S ON O.SUPPLIER_ID = S.SUPPLIER_ID
        WHERE
            O.BUSINESS_ID = ? AND 
            O.PRICE >= ?
        ORDER BY 
            O.ORDER_DATE;
    `;
    try {
        const checkBusiness = await checkBusinessExists(business_id);
        if (!checkBusiness) {
            throw new Error('Business does not exist.');
        }

        const [rows] = await pool.query(sql, [business_id, price]);
        if (rows.length) {
            return rows;
        } else {
            throw new Error('No order found with prices higher than given for the specified business');
        }
    } catch (error) {
        throw new Error('Failed to retrieve orders: ' + error.message);
    }
}

export async function getOrderBetweenPrices(business_id, price_1, price_2) {
    const sql = `
        SELECT 
            O.ORDER_DATE,
            S.SUPPLIER_NAME,
            P.PRODUCT_NAME,
            O.QUANTITY,
            O.PRICE
        FROM 
            ORDERS O
        JOIN 
            PRODUCTS P ON O.PRODUCT_ID = P.PRODUCT_ID
        JOIN 
            SUPPLIERS S ON O.SUPPLIER_ID = S.SUPPLIER_ID
        WHERE 
            O.BUSINESS_ID = ? AND
            O.PRICE BETWEEN ? AND ?
        ORDER BY 
            O.ORDER_DATE;
    `;
    try {
        const checkBusiness = await checkBusinessExists(business_id);
        if (!checkBusiness) {
            throw new Error('Business does not exist.');
        }
        
        const [rows] = await pool.query(sql, [business_id, price_1, price_2]);
        if (rows.length) {
            return rows;
        } else {
            throw new Error('No order found with prices between the specified values for the business');
        }
    } catch (error) {
        throw new Error('Failed to retrieve orders: ' + error.message);
    }
}

export async function updateOrderDetails(order_id, business_id, updates) {
    const { product_id, quantity, price, order_date } = updates;
    const sql = `
        UPDATE ORDERS
        SET PRODUCT_ID = ?, QUANTITY = ?, PRICE = ?, ORDER_DATE = ?
        WHERE ORDER_ID = ? AND BUSINESS_ID = ?;
    `;
    try {
        // Check if the order exists for the business
        const checkOrder = await checkOrderExists(order_id, business_id);
        if (!checkOrder) {
            throw new Error('Order does not exist for this business.');
        }

        const [result] = await pool.query(sql, [product_id, quantity, price, order_date, order_id, business_id]);
        if (result.affectedRows) {
            return { updated: true };
        } else {
            throw new Error('No order found for update');
        }
    } catch (error) {
        throw new Error('Failed to update order: ' + error.message);
    }
}

export async function deleteOrder(order_id, business_id) {
    const sqlDeleteOrder = `
        DELETE FROM ORDERS 
        WHERE ORDER_ID = ? AND BUSINESS_ID = ?;
    `;
    const sqlDeleteRelationships = `
        DELETE FROM business_orders_suppliers
        WHERE order_id = ? AND business_id = ?;
    `;
    try {
        const checkOrder = await checkOrderExists(order_id, business_id);
        if (!checkOrder) {
            throw new Error('Order does not exist for this business.');
        }

        // First, remove relationships from junction table
        await pool.query(sqlDeleteRelationships, [order_id, business_id]);

        // Then, delete the order
        const [result] = await pool.query(sqlDeleteOrder, [order_id, business_id]);
        return { deleted: true };
    } catch (error) {
        throw new Error('Failed to delete order: ' + error.message);
    }
}

async function checkOrderExists(order_id, business_id) {
    const sql = `
        SELECT 1 FROM ORDERS 
        WHERE ORDER_ID = ? AND BUSINESS_ID = ?;
    `;
    try {
        const [rows] = await pool.query(sql, [order_id, business_id]);
        return rows.length > 0;
    } catch (error) {
        throw new Error('Database operation failed: ' + error.message);
    }
}