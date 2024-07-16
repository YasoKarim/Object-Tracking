const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 3000;

// Middleware to parse JSON bodies
app.use(bodyParser.json());

// Endpoint to receive tracking data
app.post('/track', (req, res) => {
    const { track_id, x, y, timestamp } = req.body;

    // Log the received data to the console
    console.log(`Received data - Track ID: ${track_id}, X: ${x}, Y: ${y}, Timestamp: ${timestamp}`);

    // Append the data to a file
    const logFile = path.join(__dirname, 'tracking_data.log');
    const logEntry = `Track ID: ${track_id}, X: ${x}, Y: ${y}, Timestamp: ${timestamp}\n`;
    fs.appendFile(logFile, logEntry, (err) => {
        if (err) {
            console.error('Error writing to log file', err);
            return res.status(500).send('Internal Server Error');
        }
    });

    // Respond to the request
    res.status(200).send('Data received');
});

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
});
