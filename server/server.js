const express = require('express');
const nodemailer = require('nodemailer');
const app = express();
app.use(express.json());

const cors = require('cors');
app.use(cors());


const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'sharanyamavinaguni@gmail.com', // Your email
    pass: 'caxp ebou xwcp yjaw',   // Your email password
  },
});

// Temporary store for OTPs (Use a proper database in production)
let otpStore = {};

app.post('/api/send-otp', (req, res) => {
  const { email } = req.body;
  const otp = Math.floor(100000 + Math.random() * 900000); // Generate a 6-digit OTP

  // Store OTP temporarily
  otpStore[email] = otp;

  // Send OTP via email
  const mailOptions = {
    from: 'sharanyamavinaguni@gmail.com',
    to: email,
    subject: 'Your OTP for PGSearcher Login',
    text: `Your OTP is: ${otp}`,
  };

  transporter.sendMail(mailOptions, (err, info) => {
    if (err) {
      return res.status(500).send('Error sending OTP');
    }
    res.status(200).send('OTP sent');
  });
});

// Verify OTP
app.post('/api/verify-otp', (req, res) => {
  const { email, otp } = req.body;

  if (otpStore[email] && otpStore[email] === parseInt(otp)) {
    delete otpStore[email]; // Clear OTP after successful verification
    res.status(200).send('OTP verified');
  } else {
    res.status(400).send('Invalid OTP');
  }
});

// Set Password
app.post('/api/set-password', (req, res) => {
  const { email, password } = req.body;
  // Save the password securely in the database
  res.status(200).send('Password set successfully');
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
