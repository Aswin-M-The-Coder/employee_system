const express = require('express');
const mysql = require('mysql2');
const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);
const app = express();
const cors = require('cors')

app.use(cors({
    origin: 'http://localhost:3000', 
    credentials: true
}));

const sessionStore = new MySQLStore({
    /* MySQL connection options */
    host: 'database-1.cpiowo2ek0tb.eu-north-1.rds.amazonaws.com',
    port: '3306',
    user: 'admin',
    password: 'aswinmrds',
    database: 'my_db'
});

app.use(session({
    secret: 'your_secret_key',
    store: sessionStore,
    resave: false,
    saveUninitialized: true
}));

app.use(express.json());
app.use(express.static('public'));

const con = mysql.createConnection({
    host: "database-1.cpiowo2ek0tb.eu-north-1.rds.amazonaws.com",
    port: "3306",
    user: "admin",
    password: "aswinmrds",
    database: "my_db"
});

con.connect(function(err) {
    if (err) {
        console.log("Error in Connection");
    } else {
        console.log("Connected");
    }
});

app.get('/dashboard', (req, res) => {
    const user = req.session;
    if (user) {
        const role = user.role;
        console.log(role)
        if (role === "admin") {
            const sql = "SELECT * FROM employee";
            con.query(sql, (err, result) => {
                if (err) {
                    console.error("Error fetching admin data:", err);
                    return res.json({ Status: "Error", Error: "Error fetching admin data" });
                }
                return res.json({ Status: "Success", role: "admin", data: result });
            });
        } else {
            const userId = user.id; // Assuming the user object has an 'id' property
            const sql = "SELECT * FROM employee_data WHERE user_id = ?";
            con.query(sql, [userId], (err, result) => {
                if (err) {
                    console.error("Error fetching employee data:", err);
                    return res.json({ Status: "Error", Error: "Error fetching employee data" });
                }
                return res.json({ Status: "Success", role: "employee", data: result });
            });
        }
    } else {
        return res.json({ Status: "Error", Error: "User not authenticated" });
    }
});



app.post('/login', (req, res) => {
    const { email, password } = req.body;
    const sql = "SELECT * FROM employee WHERE email = ? AND password = ?";
    con.query(sql, [email, password], (err, result) => {
        if (err) {
            console.error("Error in login query:", err);
            return res.json({ Status: "Error", Error: "Error in running query" });
        }
        if (result.length > 0) {
            const user = result[0];
            req.session.user = user;
            console.log(user)
            return res.json({ Status: "Success", user });
        } else {
            return res.json({ Status: "Error", Error: "Wrong Email or Password" });
        }
    });
});

app.get('/getEmployee', (req, res) => {
    const sql = "SELECT * FROM employee";
    con.query(sql, (err, result) => {
        if (err) return res.json({ Error: "Get employee error in sql" });
        return res.json({ Status: "Success", Result: result });
    });
});

app.get('/get/:id', (req, res) => {
    const id = req.params.id;
    const sql = "SELECT * FROM employee where id = ?";
    con.query(sql, [id], (err, result) => {
        if (err) return res.json({ Error: "Get employee error in sql" });
        return res.json({ Status: "Success", Result: result });
    });
});

app.put('/update/:id', (req, res) => {
    const id = req.params.id;
    const sql = "UPDATE employee set salary = ? WHERE id = ?";
    con.query(sql, [req.body.salary, id], (err, result) => {
        if (err) return res.json({ Error: "update employee error in sql" });
        return res.json({ Status: "Success" });
    });
});

app.delete('/delete/:id', (req, res) => {
    const id = req.params.id;
    const sql = "Delete FROM employee WHERE id = ?";
    con.query(sql, [id], (err, result) => {
        if (err) return res.json({ Error: "delete employee error in sql" });
        return res.json({ Status: "Success" });
    });
});

// app.post('/login', (req, res) => {
//     const { email, password } = req.body;
//     const sql = "SELECT role, id, email FROM users WHERE email = ? AND password = ?";
//     con.query(sql, [email, password], (err, result) => {
//         if (err) return res.json({ Status: "Error", Error: "Error in running query" });
//         if (result.length > 0) {
//             const user = result[0];
//             req.session.user = { id: user.id, email: user.email, role:user.role }; // Store user ID in session
//             return res.json({ Status: "Success", user });
//         } else {
//             return res.json({ Status: "Error", Error: "Wrong Email or Password" });
//         }
//     });
// });

app.get('/userProfile', (req, res) => {
    // Check if the user ID is stored in the session
    if (!req.session.user || !req.session.user.id) {
        return res.status(401).json({ error: "User not authenticated" });
    }

    // Fetch user data based on the user ID stored in the session
    const userId = req.session.user.id;
    
    // Query the SQL database to fetch employee data based on the user ID
    const sql = "SELECT * FROM employee WHERE id = ?";
    con.query(sql, [userId], (err, result) => {
        if (err) {
            return res.status(500).json({ error: "Internal server error" });
        }
        if (result.length === 0) {
            return res.status(404).json({ error: "User not found" });
        }
        const userData = result[0];
        res.json(userData);
    });
});


app.post('/employeelogin', (req, res) => {
    const { email, password } = req.body;
    const sql = "SELECT * FROM employee WHERE email = ? AND password = ?";
    con.query(sql, [email, password], (err, result) => {
        if (err) return res.json({ Status: "Error", Error: "Error in running query" });
        if (result.length > 0) {
            const user = result[0];
            req.session.user = { id: user.id, email: user.email, role:user.role };
            console.log(user)
            return res.json({ Status: "Success",  user});
        } else {
            return res.json({ Status: "Error", Error: "Wrong Email or Password" });
        }
    });
});




app.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error("Error in logging out:", err);
            return res.json({ Status: "Error", Error: "Error in logging out" });
        }
        return res.json({ Status: "Success" });
    });
});

app.get('/adminCount', (req, res) => {
    const sql = "SELECT COUNT(*) AS admin FROM employee where role='admin'";
    con.query(sql, (err, result) => {
        if (err) {
            console.error("Error fetching admin count:", err);
            return res.status(500).json({ error: "Error fetching admin count" });
        }
        return res.json(result);
    });
});

// Route to get the count of employees
app.get('/employeeCount', (req, res) => {
    const sql = "SELECT COUNT(*) AS employee FROM employee where role='employee'";
    con.query(sql, (err, result) => {
        if (err) {
            console.error("Error fetching employee count:", err);
            return res.status(500).json({ error: "Error fetching employee count" });
        }
        return res.json(result);
    });
});

app.get('/admins', (req, res) => {
    const sql = "SELECT name, email FROM employee where role='admin'";
    con.query(sql, (err, result) => {
        if (err) {
            console.error("Error fetching admins:", err);
            return res.status(500).json({ error: "Error fetching admins" });
        }
        return res.json(result);
    });
});

app.get('/salary', (req, res) => {
    const sql = "SELECT SUM(salary) AS sumOfSalary FROM employee";
    con.query(sql, (err, result) => {
        if (err) {
            console.error("Error fetching total salary:", err);
            return res.status(500).json({ error: "Error fetching total salary" });
        }
        return res.json(result);
    });
});

app.post('/create', (req, res) => {
    const sql = "INSERT INTO employee (`name`,`email`,`password`, `address`, `salary`) VALUES (?)";
    const values = [
        req.body.name,
        req.body.email,
        req.body.password,
        req.body.address,
        req.body.salary
    ];
    con.query(sql, [values], (err, result) => {
        if (err) return res.json({ Error: "Error in signup query" });
        return res.json({ Status: "Success" });
    });
});

app.listen(8081, () => {
    console.log("Running");
});
