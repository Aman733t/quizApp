const express = require('express');
const bodyParser = require('body-parser');
const routes = require('./config/routes');
const filter = require('./libs/filter/app_filter');
const config = require('./config/config');

const app = express(); // Create the app instance

app.use(bodyParser.json());

// Dynamically register GET routes
for (let route in routes.get) {
    app.get(route, filter.getMethod);
}

// Dynamically register POST routes
for (let route in routes.post) {
    app.post(route, filter.postMethod);
}

// Export the app instance for testing
module.exports = app;

// Only start the server if not in a test environment
if (require.main === module) {
    app.listen(config.server.port, () => {
        console.log(`server started on ${config.server.port}`);
    });
}
