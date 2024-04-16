const express = require('express');
const fs = require('fs');
const csv = require('csv-parser');

const app = express();
const PORT = 3000;

// Import routes
const routes = require('./routes');

// Middleware to parse JSON bodies.
app.use(express.json());

// Serve static files from the public directory
app.use(express.static('views'));

// Tell the app to use the routes defined in 'routes.js'
app.use(routes);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
