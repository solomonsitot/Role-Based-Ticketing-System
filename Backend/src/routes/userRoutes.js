const path = require("path");
const express = require("express");
const {signup,Login,logout,getMyTickets,getAllTickets,updateTicket,createTicket, getLoginStatus} = require("../controllers/userController");
const auth_mw = require("../middleware/auth_mw");

const router = express.Router();

router.post("/signup", signup);
router.post("/login", Login);
router.get("/logout", logout);
router.get("/get-user-status", getLoginStatus);
router.get("/get-my-tickets", auth_mw, getMyTickets);
router.get("/get-all-tickets/", auth_mw, getAllTickets);
router.put("/update-ticket/:id?",auth_mw,updateTicket);
router.post("/create-new-ticket",auth_mw,createTicket);  
module.exports = router;