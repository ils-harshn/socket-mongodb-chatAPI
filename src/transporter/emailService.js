const nodemailer = require("nodemailer");
const serverConfig = require("../../config");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: serverConfig.EMAIL, // Your email address
    pass: serverConfig.EMAIL_PASS, // Your password
  },
});

transporter
  .verify()
  .then(() => {
    console.log("Email server connection is ready");
  })
  .catch((error) => {
    console.error("Error connecting to email server:", error);
    process.exit(1);
  });

const emailService = {
  sendEmailVerificationOTP: (user, otp) => {
    const mailOptions = {
      from: "harshverma790932611@gmail.com",
      to: user.email,
      subject: "Email verification OTP (TEST CHAT APP)",
      html: `<h1>Welcome ${user.firstName} ${user.lastName}</h1><p>Your email verification OTP</p><code>${otp}</code>`,
    };
    return transporter.sendMail(mailOptions);
  },
  sendEmailVerifiedNotification: (user) => {
    const mailOptions = {
      from: "harshverma790932611@gmail.com",
      to: user.email,
      subject: "Account Verified (TEST CHAT APP)",
      html: `<h1>${user.email} (VERIFIED)</h1><p>Raise a complaint if it was not you!</p>`,
    };
    return transporter.sendMail(mailOptions);
  },
  sendNewLoginFoundNotification: (user) => {
    const mailOptions = {
      from: "harshverma790932611@gmail.com",
      to: user.email,
      subject: "New Login Found (TEST CHAT APP)",
      html: `<h1>:${user.firstName} ${user.lastName}</h1><p>New login found for your account</p><p>Raise a complaint if it was not you!</p>`,
    };
    return transporter.sendMail(mailOptions);
  },
  sendAllDeviceLoggedOutNotification: (user) => {
    const mailOptions = {
      from: "harshverma790932611@gmail.com",
      to: user.email,
      subject: "Logged for all device (TEST CHAT APP)",
      html: `<h1>:${user.firstName} ${user.lastName}</h1><p>You have logged from all device.</p><p>Raise a complaint if it was not you!</p>`,
    };
    return transporter.sendMail(mailOptions);
  },
};

module.exports = emailService;
