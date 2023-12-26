const yup = require("yup");
const { EMAIL_REGX, PASSWORD_REGX } = require("./regex");

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

module.exports = {
  registerSchema,
};
