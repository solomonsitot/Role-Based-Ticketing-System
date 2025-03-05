require("dotenv").config();
const crypto = require("crypto");
const _ = require("lodash");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const Tickets = require("../models/ticketModel");

const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

module.exports.signup = async (req, res) => {
        try {
          const { full_name, email, password, re_password, role } = req.body;
          if (!full_name || !email || !password || !re_password || !role) {
            return res.status(400).json({ message: "all fields are required" });
          }
          if (!emailRegex.test(email)) {
            return res.status(400).json({ message: "Invalid email address" });
          }
          if (password != re_password) {
            return res.status(400).json({ message: "password mismatch" });
          }
          let user = await User.findOne({ email: email });
          if (user) {
            return res.status(400).json({ message: "user already exists" });
          }
          user = new User(
            _.pick(req.body, ["full_name", "email", "password", "role"])
          );
          const salt = await bcrypt.genSalt(10);
          user.password = await bcrypt.hash(user.password, salt);
          const token = await jwt.sign(
            { id: user._id, role: user.role,},
            process.env.PRIVATE_SECERET_TOKEN
          );
          await user.save();
          res
            .cookie("token", token, {
              path: "/",
              httpOnly: true,
              sameSite: "none",
              secure: true,
            })
            .json({ message: "user signup successfully", body: user })
            .status(200);
        } catch (err) {
          console.log(err.message);
        }
};

module.exports.Login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
          return res.status(400).json({ message: "all fields are required" });
        }
        const user = await User.findOne({ email: email });
        if (!user) {
          return res.status(400).json({ message: "invalid email or password" });
        }
        const valid = await bcrypt.compare(password, user.password);
        if (!valid) {
          return res.status(400).json({ message: "invalid email or password" });
        }
        const token = await jwt.sign(
          { id: user._id, role: user.role},
          process.env.PRIVATE_SECERET_TOKEN
        );
        res
          .cookie("token", token, {
            path: "/",
            httpOnly: true,
            sameSite: "none",
            secure: true,
          })
          .json({ message: "loggedin successfully", body: user })
          .status(200);
      } catch (err) {
        res.json({ message: err.message });
      }
};

module.exports.logout = async (req, res) => {
    res.cookie("token", "", {
        path: "/",
        httpOnly: true,
        expires: new Date(0), // Setting expiration date to past
        sameSite: "none",
        secure: true,
      });
      res.status(200).json({
        message: "logged out successfully",
      });
};

module.exports.getMyTickets = async (req, res) => {
    try {
      const { role, id } = req.user;
  
      if (role != "user") {
        return res.json({ message: "you are not allowed to see tickets" });
      }
      const ticket = await Tickets.find({ owner: id });
      res.json(ticket).status(200);
    } catch (err) {
      res.json({ message: err.message });
    }
  };

  module.exports.getAllTickets = async (req, res) => {
    try {
      const { role } = req.user;
      if (role != "admin") {
        return res.json({ message: "you are not allowed to see all tickets" });
      }
      const tickets = await Tickets.find({});
      res.json({ message: tickets }).status(200);
    } catch (err) {
      res.json({ message: err.message });
    }
  };

  module.exports.updateTicket = async (req, res) => {
    try {
      const { role } = req.user;
      if (role != "admin") {
        return res.json({ message: "you are not allowed to update tickets" });
      }
      const tid = req.params.id;
      const { ticket_status} = req.body;
  
      // Ensure you have the current room information
      const ticket = await Tickets.findById(tid);
      if (!ticket) {
        return res.status(404).json({ message: "ticket not found" });
      }
       ticket.ticket_status = ticket_status || ticket.ticket_status;
  
      await ticket.save();
  
      res.status(200).json({ message: "ticket updated successfully", body: room });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  };
  
  module.exports.createTicket = async (req, res) => {
    try {
      const { role, id } = req.user;
      const { ticket_title, ticket_description } = req.body;
      if (!ticket_title || !ticket_description ) {
        return res.json({ message: "all fields are required" });
      }
      if (role !== "user") {
        return res.json({ message: "you are not allowed to create ticket" });
      }      
      const ticket = {
        owner: id,
        ticket_title: ticket_title,
        ticket_description: ticket_description,
        ticket_status: "open",
      };
      await Tickets.create(ticket);
      res.json({ message: "ticket created sucessfully", body: ticket }).status(200);
    } catch (err) {
      res.json({ message: err.message });
    }
  };
  
  module.exports.getLoginStatus = async (req, res) => {
    const token = req.cookies.token;
    if (!token) {
      return res.json(false);
    }
    const verified = jwt.verify(token, process.env.PRIVATE_SECERET_TOKEN);
    if (verified) {
      return res.json(true);
    }
    return res.json(false);
  };