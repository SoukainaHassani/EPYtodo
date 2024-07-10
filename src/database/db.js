const mysql = require('mysql2');

const connection = mysql.createConnection({
    host:       process.env.MYSQL_HOST,
    user:       process.env.MYSQL_USER,
    password:   process.env.MYSQL_ROOT_PASSWORD,
    database:   process.env.MYSQL_DATABASE
});


connection.connect((error) => {
    if (error) {
        console.error('Error connecting to the Database: ', error);
        return;
    } else {
        console.log('Connected to the Database!');
    }
}); // exec 'node src/index' pour capter le .env

module.exports = connection;
