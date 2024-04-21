const UserModel = require('../models/user'); // Import the User model

async function createUser(userData) {
    try {
        // Create a new user in the database using the User model
        const newUser = await UserModel.User.create(userData);

        // Return the newly created user
        return newUser;
    } catch (error) {
        console.error('Error creating user:', error);
        throw error; // Optionally, re-throw the error if you want to handle it further up the chain
    }
}

async function getUserByUsername(username) {
    try {
        // Use the findOne method to query for a user by username
        const user = await UserModel.User.findOne({
            where: {
                username: username, // Specify the username to search for
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
    getUserByUsername,
    createUser
};
