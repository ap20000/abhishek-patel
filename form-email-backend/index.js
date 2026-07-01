const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Serve static files from the root directory (CSS, JS, Images, etc.)
app.use(express.static(path.join(__dirname, '..')));

// Serve the static HTML file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'index.html'));
});

// Route to handle the form submission
app.post('/send', (req, res) => {
    const { name, email, subject, message } = req.body;

    // Set up the Nodemailer transporter
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'abishekpatel46@gmail.com',
            pass: 'zzqv avhi hfir dufy' // Use an app-specific password
        }
    });

    const mailOptions = {
        from: email,
        to: 'abishekpatel46@gmail.com',
        subject: subject,
        text: `You have received a message from ${name} (${email}):\n\n${message}`
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return res.status(500).json({ error: 'Error while sending email: ' + error.message });
        }
        res.status(200).json({ message: 'Email sent successfully!' });
    });
});

// Start the server
app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});
