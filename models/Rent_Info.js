const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const rent_info_schema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  phone_number: {
    type: Number,
    required: true,
  },
  street: {
    type: String,
    required: true,
  },
  apt: {
    type: String,
    required: true,
  },
  zip_code: {
    type: String,
    required: true,
  },
});
module.exports = mongoose.model("Rent_Info", rent_info_schema);
