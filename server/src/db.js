const mysql = require("mysql2");


const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.BD_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME
});

connection.connect((error) => {

        console.log('host:', process.env.DB_HOST);
        console.log('user:', process.env.BD_USER);
        console.log('password:', process.env.DB_PASS);
        console.log('database:', process.env.DB_NAME);
        if (error) throw error;

  console.log(`Connectado a Base de dados: ${process.env.DB_NAME}`);

});

module.exports = connection;
