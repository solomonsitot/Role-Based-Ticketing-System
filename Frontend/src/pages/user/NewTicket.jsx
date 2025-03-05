import { useState } from "react";
import axios from "axios";
import { FiArrowLeft, FiLogOut } from "react-icons/fi";
import useRedirectLogoutUsers from "../../hooks/redirectLogoutUsers";
import { toast } from "react-toastify";

export default function NewTicket() {
  useRedirectLogoutUsers("/login");

  const [form, setForm] = useState({
    ticket_title: "",
    ticket_description: "",
  });

  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.ticket_title || !form.ticket_description) {
      return toast.error("All fields are required");
    }

    try {
      const response = await axios.post(
        `${BACKEND_URL}/user/create-new-ticket`,
        { ...form },
        { withCredentials: true }
      );
      toast.success(response.data.message);
      setForm({ ticket_title: "", ticket_description: "" });
      if(response.data.body){
        window.location.href = `/user/${response.data.body.owner}`;  // Redirect to user ticket page.
      }
    } catch (error) {
      console.error("Error creating ticket:", error);
      toast.error("An error occurred while creating the ticket.");
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-white text-gray-900 p-6">
      <div className="flex justify-between items-center p-4 border border-blue-600] text-blue- shadow-md rounded-lg">
        <button onClick={() => window.history.back()} className="flex items-center space-x-2">
          <FiArrowLeft className="text-xl" />
          <span>Back</span>
        </button>
      </div>

      {/* Main Content */}
      <div className="flex flex-col items-center justify-center flex-grow p-6">
        <h2 className="text-4xl font-extrabold text-center text-gray-700 mb-6">Create a New Ticket</h2>
        <form className="w-full max-w-3xl bg-white p-8 rounded-lg shadow-lg border border-gray-200" onSubmit={handleSubmit}>
          <div className="space-y-6">
            <div>
              <label className="block text-gray-700 font-semibold mb-2">Ticket Title</label>
              <input
                type="text"
                name="ticket_title"
                placeholder="Enter title"
                value={form.ticket_title}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-100 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 font-semibold mb-2">Ticket Description</label>
              <textarea
                name="ticket_description"
                placeholder="Describe your issue"
                value={form.ticket_description}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-100 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                required
              />
            </div>
          </div>
          <button type="submit" className="w-full mt-6 bg-blue-900 hover:bg-blue-600 text-white py-3 rounded-lg shadow-lg text-lg font-semibold transition duration-300">
            Submit Ticket
          </button>
        </form>
      </div>
    </div>
  );
}
