const yup = require("yup");
const { EMAIL_REGX, PASSWORD_REGX, OTP_REGX } = require("./regex");

const registerSchema = yup.object().shape({
  email: yup
    .string()
    .email("Invalid email format")
    .matches(EMAIL_REGX, "Invalid email format")
    .required("Email is required"),
  password: yup
    .string()
    .matches(
      PASSWORD_REGX,
      "Password should be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character!"
    )
    .required("Password is required"),
  firstName: yup.string().required(),
  lastName: yup.string().required(),
});

const verifyOTPSchema = yup.object().shape({
  _id: yup.string().required("Id is not provided"),
  otp: yup
    .string()
    .required("otp is required")
    .matches(
      OTP_REGX,
      "OTP must be exactly 6 digits long and contain only numeric values"
    ),
});

const loginSchema = yup.object().shape({
  email: yup
    .string()
    .email("Invalid email format")
    .matches(EMAIL_REGX, "Invalid email format")
    .required("Email is required"),
  password: yup
    .string()
    .matches(
      PASSWORD_REGX,
      "Password should be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character!"
    )
    .required("Password is required"),
});

const resendOTPSchema = yup.object().shape({
  email: yup
    .string()
    .email("Invalid email format")
    .matches(EMAIL_REGX, "Invalid email format")
    .required("Email is required"),
})

module.exports = {
  registerSchema,
  verifyOTPSchema,
  loginSchema,
  resendOTPSchema,
};
