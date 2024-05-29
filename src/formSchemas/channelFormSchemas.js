const yup = require("yup");

const channelCreateSchema = yup.object().shape({
  channelName: yup.string().required("Channel name is required"),
  adminName: yup.string().required("Admin name is required"),
  channelDescription: yup.string().required("Channel description is required"),
});

module.exports = {
  channelCreateSchema,
};
