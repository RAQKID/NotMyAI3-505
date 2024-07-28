const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');
require('dotenv').config();  // Load environment variables from .env file

const app = express();
const port = 3000;

// Middleware to parse JSON bodies
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files from the "public" directory
app.use(express.static('public'));

// Handle form submission
app.post('/ask', async (req, res) => {
    const userQuestion = req.body.question;

    if (!userQuestion) {
        return res.status(400).send('Question is required');
    }

    try {
        const response = await axios.get('https://api.kastg.xyz/api/ai/chatgpt', {
            params: {
                prompt: userQuestion,
                key: process.env.API_KEY  // Use API key from .env file
            }
        });

        // Extract and send back the response text
        const result = response.data.result;
        const answer = result.length > 0 ? result[0].response : 'No response received';

        res.json({ response: answer });
    } catch (error) {
        res.status(500).send('An error occurred while contacting the API');
    }
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});