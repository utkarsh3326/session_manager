const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const userRoutes = require('./routes/user');
const { logRequest, logResponse } = require('./middleware/loggerMiddleware');

app.use(bodyParser.json());

// Global logging middleware
app.use(logRequest);
app.use(logResponse);

// User routes
app.use('/api', userRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
