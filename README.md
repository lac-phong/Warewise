# Warewise

The project structure is organized into the following directories:

- `client`: Contains the client-side application built using React.
- `server`: Includes the server-side application developed with Node.js and Express.
- `database`: Contains the database setup scripts and configurations.

## Getting Started

To run this project, follow the steps below:

### 1. Setting Up the Database

1. **Ensure MySQL is Installed:**

   - Make sure you have MySQL installed on your machine. If not, you can download and install MySQL from the [official website](https://dev.mysql.com/downloads/).

2. **Create `.env` File for Server:**

   - Navigate to the `server` directory.
   - Create a .env file with the following code:
   ```bash
        MYSQL_HOST = '127.0.0.1'
        MYSQL_USER = 'root'
        MYSQL_PASSWORD = ''
        MYSQL_DATABASE = 'WAREWISE'
        JWT_SECRET = ''
   ```
   - Add your MYSQL passoword and create a random string for JWT_SECRET.

3. **Run Database Setup Scripts:**
   - Navigate to the `database` directory.
   - Copy the database setup script code from the file to your MySQL database management tool (e.g., MySQL Workbench) and run the file.

### 2. Running the Server

1. **Navigate to Server Directory:**
   ```bash
   cd server
   ```
2. Install Server-Side Dependencies:
   ```bash
   npm install
   ```
3. Start the Server:
   ```bash
   nodemon app.js
   ```

### 2. Running the Client

1. **Navigate to Client Directory:**
   ```bash
   cd client
   ```
2. Install Server-Side Dependencies:
   ```bash
   npm install
   ```
3. Start the Server:
   ```bash
   npm start
   ```

# Accessing the Application

Once both the server and client are running, access the application by navigating to http://localhost:3000 in your web browser.

# Division of Work

- **Rohith Iyengar**
  
- **Lac Phong-Nguyen**

- **Shreya Raj**

- **Natalie Kao**
  - Created Add Supplier Page
  - Created presentation slides

- **Nyun Ei Hlaing**
  - Created Log in, Register, Account, and Employee pages
  - Created ER diagram.
