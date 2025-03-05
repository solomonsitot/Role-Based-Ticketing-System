import React, { useEffect } from 'react';
import Signup from './pages/Auth/Signup';
import Login from './pages/Auth/Login';
import { Routes, Route } from "react-router-dom";
import UserHome from './pages/user/UserHome';
import AdminHome from './pages/admin/AdminHome';
import NewTicket from './pages/user/NewTicket';
import { SET_LOGIN } from './redux/features/auth/authSlice';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";  // Make sure to import the CSS

function App() {
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
  const dispatch = useDispatch();

  useEffect(() => {
    async function loginStatus() {
      const status = await axios.get(`${BACKEND_URL}/user/get-user-status`, {
        withCredentials: true,
      });
      dispatch(SET_LOGIN(status.data));
    }
    loginStatus();
  }, [BACKEND_URL, dispatch]);

  return (
    <div>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Signup />} />
        <Route path="/user/:id?" element={<UserHome />} />
        <Route path="/admin/:id?" element={<AdminHome />} />
        <Route path="/:id/add-new-ticket" element={<NewTicket />} />
      </Routes>

      <ToastContainer />
    </div>
  );
}

export default App;
