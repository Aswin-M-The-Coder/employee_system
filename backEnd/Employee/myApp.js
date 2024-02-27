const express = require('express');
const mysql = require('mysql2');
const fs = require('fs');


const app = express();

app.use(express.urlencoded({ extended: true }));

// Databe connection
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'aswin',
  database: 'emp'
});

connection.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    return;
  }
  console.log('Connected to MySQL Successfully');
});


function passprotect(req, res, next){
  if(req.headers.authorization == 'Basic YXN3aW46cGFzcw=='){
    
  res.set('WWW-Authenticate', 'Basic realm="Simple App"')
    next()
  }else{
    res.status(401).send("please provide id password")
  }
}

app.use(passprotect); 

// Read the HTML file 
const htmlFile = fs.readFileSync('C:/Users/aswin/Desktop/Pycharm Projects/fs_sample/index.html', 'utf8');

app.get('/', (req, res) => {
  connection.query('SELECT * FROM data', (err, results) => {
    if (err) {
      console.error('Error fetching data from MySQL:', err);
      res.status(500).send('Error fetching data');
      return;
    }

    let tableHtml = '<!-- Employee details will be displayed here -->';

    results.forEach(employee => {
      tableHtml += `<tr>
      <td>${employee.id}</td>
                      <td>${employee.name}</td>
                      <td>${employee.dob}</td>
                      <td>${employee.age}</td>
                      <td>${employee.department}</td>
                      <td>${employee.designatiion}</td>
                      <td>
      <form action="/delete/${employee.id}" method="POST">
        <input type="hidden" name="name" value="John Doe">
        <button type="submit">Delete</button>
      </form>
    </td>
                    </tr>`;
    });

    // Insert the fetched employee details into the HTML file
    const updatedHtmlFile = htmlFile.replace('<!-- Employee details will be displayed here -->', tableHtml);

    res.send(updatedHtmlFile); // Send the updated HTML to the client
  });
});

// app.get('/', (req, res) => {
//   res.sendFile(path.join(__dirname, 'index.html'));
// });

// Start the server
const PORT = 3000; // Replace with your desired port number
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});



// db.js






app.post('/submit', passprotect, (req, res) => {
  res.set('WWW-Authenticate', 'Basic realm="Simple App"')
  if(req.headers.authorization == 'Basic YXN3aW46cGFzcw=='){
    const {id, name, dob, age, department, designation } = req.body;
  
    const sql = 'INSERT INTO data (id, name, dob, age, department, designatiion) VALUES (?, ?, ?, ?, ?, ?)';
    connection.query(sql, [id, name, dob, age, department, designation], (err, result) => {
      if (err) {
        console.error('Error inserting data into MySQL:', err);
        res.status(500).send('Error submitting data');
        return;
      }
      console.log('Data inserted into MySQL');
    res.redirect('/');
    });
  };
  });
  
app.post('/delete/:id',passprotect, function(req,res) {
  res.set('WWW-Authenticate', 'Basic realm="Simple App"')
  if(req.headers.authorization == 'Basic YXN3aW46cGFzcw=='){
  const nam = req.params.id;
  connection.query('DELETE FROM data WHERE id = ?', [nam], (err, result) => {
    if (err) {
      console.error('Error deleting employee:', err);
      res.status(500).send('Error deleting employee');
      return;
    }
    console.log('Employee deleted from MySQL');
    res.redirect('/'); // Redirect back to the home page or any appropriate page
  });
};
});

