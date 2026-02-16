const express = require('express');
const cors = require('cors');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const analyzePcap = require('./analyzer');

const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());

// Configure storage
const upload = multer({ dest: 'uploads/' });

// Create uploads directory if it doesn't exist
if (!fs.existsSync('uploads')) {
    fs.mkdirSync('uploads');
}

app.post('/api/upload', upload.single('file'), async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
    }

    const filePath = req.file.path;
    const originalName = req.file.originalname;

    try {
        console.log(`Analyzing file: ${originalName}`);
        const results = await analyzePcap(filePath);

        // Cleanup
        fs.unlink(filePath, (err) => {
            if (err) console.error('Error deleting file:', err);
        });

        res.json({ results });
    } catch (error) {
        console.error('Analysis error:', error);
        res.status(500).json({ error: error.message });
    }
});

app.listen(port, () => {
    console.log(`Backend running on http://localhost:${port}`);
});
