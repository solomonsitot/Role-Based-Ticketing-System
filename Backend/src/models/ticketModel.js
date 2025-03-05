const mongoose = require("mongoose");
const Users = require("./userModel");
const ticketSchema = new mongoose.Schema({
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Users",
  },
  ticket_title: {
    type: String,
    required: true,
  },
  ticket_description: {
    type: String,
    required: false,
  },
  ticket_status: {
    type: String,
    required: true,
  }
});
const Tickets = new mongoose.model("Tickets", ticketSchema);
module.exports = Tickets;