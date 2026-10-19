const { app, startServer } = require('./src/server');

const PORT = process.env.PORT || 5000;
const server = startServer(PORT);

module.exports = { app, server };