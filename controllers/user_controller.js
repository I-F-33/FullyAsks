const UserModel = require('../models/user'); // Import the User model
const database = require('../db/appdb.js'); // Import the Sequelize instance

async function createUser(username, classYear) {
    try {
        console.log('Creating User');
        
        // Authenticate the database connection asynchronously
        await database.sequelize.authenticate();
        console.log('Connection has been established successfully.');

        // Check to see if user already exists
        const user = await getUserByUsernameAndYear(username, classYear);

        if (user) {
            console.log('User already exists');
            console.log('User:', user.dataValues);
            return user.dataValues;
        }
        
        console.log('User does not exist');
        console.log('Creating new user');

        // Create a new user in the database using the User model
        const newUser = await UserModel.User.create({
            username: username,
            year: classYear
        });
        
        console.log('New user created:', newUser);
        
        // Return the newly created user
        return newUser.dataValues;
    } catch (error) {
        console.error('Error creating user:', error);
        throw error; // Optionally, re-throw the error if you want to handle it further up the chain
    } finally {
        // Always close the database connection, whether an error occurred or not
        database.sequelize.close();
        console.log('Connection closed');
    }
}



async function getUserByUsernameAndYear(username, classYear) {
    try {
        // Use the findOne method to query for a user by username
        const user = await UserModel.User.findOne({
            where: {
                username: username, // Specify the username to search for
                year: classYear
            },
        });

        // Return the user object if found, or null if not found
        return user;
    } catch (error) {
        console.error('Error fetching user by username:', error);
        throw error; // Optionally, re-throw the error if you want to handle it further up the chain
    }
}

module.exports = {
    getUserByUsernameAndYear,
    createUser
};
