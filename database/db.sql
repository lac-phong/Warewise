CREATE DATABASE WAREWISE;

USE WAREWISE;

CREATE TABLE BUSINESS (
    BUSINESS_ID INT AUTO_INCREMENT PRIMARY KEY,
    USERNAME VARCHAR(255) UNIQUE NOT NULL,
    PASSWORD VARCHAR(255) NOT NULL,
    BUSINESS_NAME VARCHAR(255) NOT NULL,
    ADDRESS VARCHAR(255) NOT NULL,
    CREATION_DATE TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE EMPLOYEES (
    EMPLOYEE_ID INT AUTO_INCREMENT,
    BUSINESS_ID INT,
    FIRST_NAME VARCHAR(255),
    LAST_NAME VARCHAR(255),
    EMAIL VARCHAR(255),
    PHONE VARCHAR(20),
    ADDRESS VARCHAR(255),
    SALARY DECIMAL(10, 2),
    PRIMARY KEY (EMPLOYEE_ID),
    FOREIGN KEY (BUSINESS_ID) REFERENCES BUSINESS(BUSINESS_ID) ON DELETE CASCADE
);

CREATE TABLE PRODUCTS (
    PRODUCT_ID INT AUTO_INCREMENT,
    BUSINESS_ID INT,
    CATEGORY_NAME VARCHAR(255),
    PRODUCT_NAME VARCHAR(255),
    PRODUCT_DESCRIPTION TEXT,
    QUANTITY INT,
    REORDER_LEVEL INT,
    REORDER_QUANTITY INT,
    PRICE DECIMAL(10, 2),
    PRIMARY KEY (PRODUCT_ID),
    FOREIGN KEY (BUSINESS_ID) REFERENCES BUSINESS(BUSINESS_ID) ON DELETE CASCADE
);

CREATE TABLE SUPPLIERS (
    SUPPLIER_ID INT AUTO_INCREMENT,
    BUSINESS_ID INT,
    SUPPLIER_NAME VARCHAR(255),
    EMAIL VARCHAR(255),
    PHONE VARCHAR(20),
    ADDRESS VARCHAR(255),
    SUPPLIER_CATEGORY TEXT,
    PRIMARY KEY (SUPPLIER_ID),
    FOREIGN KEY (BUSINESS_ID) REFERENCES BUSINESS(BUSINESS_ID) ON DELETE CASCADE
);

CREATE TABLE business_product_supplier (
    business_id INT,
    product_id INT,
    supplier_id INT,
    PRIMARY KEY (business_id, product_id, supplier_id),
    FOREIGN KEY (business_id) REFERENCES BUSINESS(BUSINESS_ID) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES PRODUCTS(PRODUCT_ID) ON DELETE CASCADE,
    FOREIGN KEY (supplier_id) REFERENCES SUPPLIERS(SUPPLIER_ID) ON DELETE CASCADE
);

CREATE TABLE CUSTOMERS (
    CUSTOMER_ID INT AUTO_INCREMENT,
    BUSINESS_ID INT,
    FIRST_NAME VARCHAR(255),
    LAST_NAME VARCHAR(255),
    EMAIL VARCHAR(255),
    PHONE VARCHAR(20),
    ADDRESS VARCHAR(255),
    PRIMARY KEY (CUSTOMER_ID),
    FOREIGN KEY (BUSINESS_ID) REFERENCES BUSINESS(BUSINESS_ID) ON DELETE CASCADE
);

CREATE TABLE SALES (
    SALES_ID INT AUTO_INCREMENT,
    BUSINESS_ID INT,
    PRODUCT_ID INT,
    QUANTITY INT,
    PAYMENT_DETAILS TEXT,
    PRICE DECIMAL(10, 2),
    ORDER_DATE TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (SALES_ID),
    FOREIGN KEY (BUSINESS_ID) REFERENCES BUSINESS(BUSINESS_ID) ON DELETE CASCADE,
    FOREIGN KEY (PRODUCT_ID) REFERENCES PRODUCTS(PRODUCT_ID) ON DELETE CASCADE
);

CREATE TABLE ORDERS (
    ORDER_ID INT AUTO_INCREMENT,
    BUSINESS_ID INT,
    PRODUCT_ID INT,
    QUANTITY INT,
    PRICE DECIMAL(10, 2),
    ORDER_DATE TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (ORDER_ID),
    FOREIGN KEY (BUSINESS_ID) REFERENCES BUSINESS(BUSINESS_ID) ON DELETE CASCADE,
    FOREIGN KEY (PRODUCT_ID) REFERENCES PRODUCTS(PRODUCT_ID) ON DELETE CASCADE
);

CREATE TABLE business_orders_suppliers (
    business_id INT,
    order_id INT,
    supplier_id INT,
    PRIMARY KEY (business_id, order_id),
    FOREIGN KEY (business_id) REFERENCES BUSINESS(BUSINESS_ID) ON DELETE CASCADE,
    FOREIGN KEY (order_id) REFERENCES ORDERS(ORDER_ID) ON DELETE CASCADE,
    FOREIGN KEY (supplier_id) REFERENCES SUPPLIERS(supplier_id) ON DELETE CASCADE
);

CREATE TABLE BALANCE (
    BALANCE_ID INT AUTO_INCREMENT,
    BUSINESS_ID INT,
    BALANCE INT NOT NULL,
    TIMESTAMP TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (BALANCE_ID),
    FOREIGN KEY (BUSINESS_ID) REFERENCES BUSINESS(BUSINESS_ID) ON DELETE CASCADE
);

CREATE INDEX idx_business_id_on_employees ON EMPLOYEES (BUSINESS_ID);
CREATE INDEX idx_business_id_on_products ON PRODUCTS (BUSINESS_ID);
CREATE INDEX idx_business_id_on_suppliers ON SUPPLIERS (BUSINESS_ID);
CREATE INDEX idx_business_id_on_customers ON CUSTOMERS (BUSINESS_ID);
CREATE INDEX idx_business_id_on_sales ON SALES (BUSINESS_ID);
CREATE INDEX idx_product_id_on_sales ON SALES (PRODUCT_ID);
CREATE INDEX idx_business_id_on_orders ON ORDERS (BUSINESS_ID);
CREATE INDEX idx_product_id_on_orders ON ORDERS (PRODUCT_ID);
CREATE INDEX idx_balance_on_business ON BALANCE (BUSINESS_ID);

CREATE INDEX idx_email_on_suppliers ON SUPPLIERS (EMAIL);
CREATE INDEX idx_email_on_customers ON CUSTOMERS (EMAIL);
CREATE INDEX idx_order_date_on_sales ON SALES (ORDER_DATE);
CREATE INDEX idx_order_date_on_orders ON ORDERS (ORDER_DATE);

DELIMITER //
CREATE TRIGGER UPDATE_SALE_PRICE
BEFORE INSERT ON SALES
FOR EACH ROW
BEGIN
    DECLARE unit_price DECIMAL(10, 2);

    SELECT PRICE INTO unit_price
    FROM PRODUCTS
    WHERE BUSINESS_ID = NEW.BUSINESS_ID AND PRODUCT_ID = NEW.PRODUCT_ID;

    SET NEW.PRICE = unit_price * NEW.QUANTITY;
END;
//
DELIMITER ;