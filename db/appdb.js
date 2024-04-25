//import config.js
const creds = require('./jsconfig')

const { Sequelize } = require('sequelize');

// Replace these with your actual RDS instance details
const dbUsername = creds.dbUser;
const dbPassword = creds.dbPassword;
const dbHost = creds.dbHost;
const dbPort = creds.dbPort;
const dbName = creds.dbname;
const dialect = 'mysql'; // Specify the correct dialect for your RDS instance

// Create the database URL
const databaseURL = `${dialect}://${dbUsername}:${dbPassword}@${dbHost}:${dbPort}/${dbName}`;

console.log(databaseURL)

function createConnection() {
// Create the Sequelize instance
    const sequelize = new Sequelize(databaseURL, {
        dialect,
        logging: false, // Optional: Disable Sequelize's SQL logging
        pool: {
            max: 20, // Maximum number of connections in the pool
            min: 0, // Minimum number of connections in the pool
            acquire: 30000, // Maximum time (in ms) to acquire a connection
            idle: 10000, // Maximum time (in ms) a connection can be idle
        },
    });

    
    return sequelize;
}

  function testConnection() {
    sequelize
        .authenticate()
        .then(async () => {
            console.log('Connection has been established successfully.');
            
            console.log('Connection closed');
            sequelize.close();
            
        })
        .catch((error) => {
            console.error('Unable to connect to the database:', error);
        });
    
        

}

// Test the database connection
//testConnection();
// Export the Sequelize instance
module.exports = {createConnection};
