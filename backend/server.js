const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mime = require('mime-types');

const app = express();
const PORT = process.env.PORT || 3001;

// const userId = process.env.USER_ID;
// const email = process.env.EMAIL;
// const rollNumber = process.env.ROLL_NUMBER;

app.use(cors());
app.use(bodyParser.json({ limit: '50mb' }));

// Utility Functions
function isPrime(num) {
    const n = parseInt(num);
    if (n <= 1) return false;
    for (let i = 2; i <= Math.sqrt(n); i++) {
        if (n % i === 0) return false;
    }
    return true;
}

function findHighestLowercaseAlphabet(alphabets) {
    const lowercaseAlphabets = alphabets.filter(char => /[a-z]/.test(char));
    if (lowercaseAlphabets.length === 0) return [];
    return [lowercaseAlphabets.reduce((a, b) => a > b ? a : b)];
}

function validateBase64File(base64String) {
    try {
        // Basic validation 
        if (!base64String || base64String === 'BASE_64_STRING') {
            return {
                file_valid: false,
                file_mime_type: '',
                file_size_kb: 0
            };
        }

        // Remove data URL prefix if present
        const base64Data = base64String.replace(/^data:.*\/.*;base64,/, '');
        
        // Attempt to detect MIME type
        const buffer = Buffer.from(base64Data, 'base64');
        const mimeType = mime.lookup(buffer) || 'application/octet-stream';
        
        return {
            file_valid: true,
            file_mime_type: mimeType,
            file_size_kb: (buffer.length / 1024).toFixed(0)
        };
    } catch (error) {
        return {
            file_valid: false,
            file_mime_type: '',
            file_size_kb: 0
        };
    }
}

// POST Route
app.post('/bfhl', (req, res) => {
    try {
        const { data, file_b64 } = req.body;

        // Separate numbers and alphabets
        const numbers = data.filter(item => /^\d+$/.test(item));
        const alphabets = data.filter(item => /^[a-zA-Z]$/.test(item));

        // File validation
        const fileValidation = validateBase64File(file_b64);

        // Check for prime numbers
        const isPrimeFound = numbers.some(isPrime);
        // We can take the input from .env from 
        const response = {
            is_success: true,
            user_id: "pratham_27092003",
            email: "prathammahajan2709@gmail.com", 
            roll_number: "21100BTCSE09926", 
            numbers,
            alphabets,
            highest_lowercase_alphabet: findHighestLowercaseAlphabet(alphabets),
            is_prime_found: isPrimeFound,
            ...fileValidation
        };

        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({
            is_success: false,
            error: error.message
        });
    }
});

// GET Route
app.get('/bfhl', (req, res) => {
    res.status(200).json({
        operation_code: 1
    });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

module.exports = app;