import { useState } from "react";
import axios from "axios";
import { FiUser, FiMail, FiLock } from "react-icons/fi";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
    SET_ID,
    SET_LOGIN,
    SET_NAME,
    SET_ROLE,
  } from "../../redux/features/auth/authSlice";
  import ticket from '../../assets/ticket.jpg'
  export default function SignUp() {
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
  const dispatch = useDispatch();
    const navigate = useNavigate();
  
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async(e) => {
    e.preventDefault();
    if (!form.fullName || !form.email || !form.password || !form.confirmPassword) {
          return toast.error("All fields are required");
        }
    if (form.password !== form.confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }
    if (form.password.length < 6) {
      return toast.error("Passwords must be up to 6 characters");
    }
    if (!form.email.match(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)) {
      return toast.error("Please enter a valid email");
    }


    try {
        const response = await axios.post(
          `${BACKEND_URL}/user/signup`,
          { full_name:form.fullName,
            password:form.password,
            email:form.email,
            re_password:form.confirmPassword,
            role:"user" },
          { withCredentials: true }
        );
        const data = response.data;
        toast.success(response.data.message);
        await dispatch(SET_LOGIN(true));
        await dispatch(SET_NAME(data.body.full_name));
        await dispatch(SET_ROLE(data.body.role));
        await dispatch(SET_ID(data.body._id));
        if (data.body && data.body.role) {
        navigate(`/${data.body.role}/${data.body._id}`);
       } 
      } catch (error) {
        console.log("Error:", error);
        toast.error("An error occurred during signup.");
      }

  };

  return (
    <div className="flex items-center justify-center h-screen bg-[#FAFAFA] p-10 ">
      <div className="flex justify-between w-full h-full   rounded-3xl overflow-hidden ">
        <div className="w-1/3 hidden md:block ">
          <img 
            src={ticket} 
            alt="Signup Illustration" 
            className="w-full h-full object-cover" 
          />
        </div>
        
        <div className="w-full md:w-1/2 p-8">
          <h2 className="text-3xl font-extrabold text-center text-[#E67C3C]">Create an Account</h2>
          <p className="text-sm text-center text-[#1C2228] mt-2">Join us to explore exciting ticketing experiences.</p>
          <form className="mt-6" onSubmit={handleSubmit}>
            <div className="space-y-5">
              <div className="flex items-center border border-[#E67C3C] rounded-lg p-3 bg-[#FAFAFA] shadow-sm focus-within:ring-2 focus-within:ring-[#f0b681]">
                <FiUser className="text-[#E67C3C]" />
                <input
                  type="text"
                  name="fullName"
                  placeholder="Full Name"
                  value={form.fullName}
                  onChange={handleChange}
                  className="w-full px-3 bg-transparent focus:outline-none text-[#E67C3C]"
                  required
                />
              </div>
              <div className="flex items-center border border-[#E67C3C] rounded-lg p-3 bg-[#FAFAFA] shadow-sm focus-within:ring-2 focus-within:ring-[#f0b681]">
                <FiMail className="text-[#E67C3C]" />
                <input
                  type="email"
                  name="email"
                  placeholder="Email Address"
                  value={form.email}
                  onChange={handleChange}
                  className="w-full px-3 bg-transparent focus:outline-none text-[#E67C3C]"

                  required
                />
              </div>
              <div className="flex items-center border border-[#E67C3C] rounded-lg p-3 bg-[#FAFAFA] shadow-sm focus-within:ring-2 focus-within:ring-[#f0b681]">
                <FiLock className="text-[#E67C3C]" />
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={form.password}
                  onChange={handleChange}
                  className="w-full px-3 bg-transparent focus:outline-none text-[#E67C3C]"

                  required
                />
              </div>
              <div className="flex items-center border border-[#E67C3C] rounded-lg p-3 bg-[#FAFAFA] shadow-sm focus-within:ring-2 focus-within:ring-[#f0b681]">
                <FiLock className="text-[#E67C3C]" />
                <input
                  type="password"
                  name="confirmPassword"
                  placeholder="Confirm Password"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  className="w-full px-3 bg-transparent focus:outline-none text-[#E67C3C]"
                  required
                />
              </div>
            </div>
            <button type="submit" className="w-full mt-6 bg-[#ee691f] hover:bg-[##df5117] text-white py-3 rounded-lg shadow-lg text-lg font-semibold transition duration-300">
              Sign Up
            </button>
          </form>
          <p className="mt-6 text-sm text-center text-black">
            Already have an account? <a href="login" className="text-green-900 font-semibold hover:underline">Log in</a>
          </p>
        </div>
      </div>
    </div>
  );
}