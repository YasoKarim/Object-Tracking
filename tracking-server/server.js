/*
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


*/
const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

const app = express();
const port = 3000;

// Middleware to parse JSON bodies
app.use(bodyParser.json());

// Queue to store detected objects
let detectionQueue = [];

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

    // Push the detected object to the queue
    detectionQueue.push({ track_id, x, y, timestamp });
    console.log('Object pushed to queue:', detectionQueue);

    // Respond to the request
    res.status(200).send('Data received');
});

// Endpoint to pop the oldest object from the queue
app.get('/queue/pop', (req, res) => {
    if (detectionQueue.length === 0) {
        return res.status(200).send('Queue is empty');
    }
    const object = detectionQueue.shift();
    console.log('Object popped from queue:', object);
    
    // Call a Python function to process the popped object
    callPythonFunction(object);

    res.status(200).json(object);
});

// Function to call a Python script
function callPythonFunction(object) {
    const pythonProcess = spawn('python', ['process_object.py', JSON.stringify(object)]);

    pythonProcess.stdout.on('data', (data) => {
        console.log(`Python Output: ${data}`);
    });

    pythonProcess.stderr.on('data', (data) => {
        console.error(`Python Error: ${data}`);
    });

    pythonProcess.on('close', (code) => {
        console.log(`Python process exited with code ${code}`);
    });
}

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
});

/*
const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const Queue = require('bull');

const app = express();
const port = 3000;

// Middleware to parse JSON bodies
app.use(bodyParser.json());

// Create a queue for tracking data
const trackingQueue = new Queue('trackingQueue');

// Endpoint to receive tracking data
app.post('/track', (req, res) => {
    const { track_id, x, y, timestamp } = req.body;

    // Log the received data to the console
    console.log(`Received data - Track ID: ${track_id}, X: ${x}, Y: ${y}, Timestamp: ${timestamp}`);

    // Add the tracking data to the queue
    trackingQueue.add({ track_id, x, y, timestamp });

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

// Endpoint for the robot to request an object
app.get('/request-object', async (req, res) => {
    const { track_id } = req.query;

    // Retrieve the latest tracking data for the specified track_id from the queue
    const jobs = await trackingQueue.getCompleted();
    const matchingJob = jobs.reverse().find(job => job.data.track_id == track_id);

    if (matchingJob) {
        res.status(200).json(matchingJob.data);
    } else {
        res.status(404).send('Object not found');
    }
});

// Process the queue (you can define what to do with the data here)
trackingQueue.process((job, done) => {
    // In this example, we're just marking the job as done
    done();
});

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
});

*/