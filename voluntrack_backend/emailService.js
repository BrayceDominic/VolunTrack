const nodemailer = require('nodemailer');

// Create reusable transporter object using SMTP transport
const transporter = nodemailer.createTransport({
  service: 'gmail', // you can use any email service provider
  auth: {
    user: process.env.EMAIL_USER, // your email
    pass: process.env.EMAIL_PASS, // your email password or app password (for Gmail)
  },
});

// Send email function
const sendPasswordResetEmail = async (toEmail, resetToken) => {
  try {
    const resetUrl = `http://192.168.100.243:5000/api/reset-password/${resetToken}`; // URL to reset password page
    
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: toEmail,
      subject: 'Password Reset Request',
      html: `<p>You requested a password reset. Click the link below to reset your password:</p>
             <a href="${resetUrl}">Reset Password</a>`,
    };

    // Send email
    await transporter.sendMail(mailOptions);
    console.log('Password reset email sent to ' + toEmail);
  } catch (error) {
    console.error('Error sending email:', error);
  }
};

module.exports = { sendPasswordResetEmail };
