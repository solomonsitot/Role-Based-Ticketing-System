import { useEffect, useState } from "react";
import axios from "axios";
import useRedirectLogoutUsers from "../../hooks/redirectLogoutUsers";
import { FiLogOut, FiTag, FiFileText, FiCheckCircle, FiClock, FiXCircle } from "react-icons/fi";

function AdminHome() {
  useRedirectLogoutUsers("/login");

  const [tickets, setTickets] = useState([]);
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    async function fetchTickets() {
      try {
        const response = await axios.get(`${BACKEND_URL}/user/get-all-tickets`, { withCredentials: true });
        setTickets(response.data.message);
        console.log(response.data)
      } catch (error) {
        console.error("Error fetching tickets:", error);
      }
    }
    fetchTickets();
  }, []);

  const handleLogout = async () => {
    try {
      await axios.get(`${BACKEND_URL}/user/logout`, { withCredentials: true });
      localStorage.removeItem("token");
      window.location.href = "/login";
    } catch (error) {
      console.error("Error logging out:", error);
    }
  }
  const updateStatus = async (id, newStatus) => {
    try {
      await axios.put(`${BACKEND_URL}/user/update-ticket/${id}`, { ticket_status: newStatus }, { withCredentials: true });
      setTickets(tickets.map(ticket => ticket.id === id ? { ...ticket, ticket_status: newStatus } : ticket));
    } catch (error) {
      console.error("Error updating ticket status:", error);
    }
    window.location.reload();

  };

  return (
    <div className="flex flex-col min-h-screen bg-white text-gray-900">
      <nav className="flex justify-between items-center bg-blue-900 text-white p-4 shadow-md">
        <h1 className="text-2xl font-bold">Welcome, Admin</h1>
        <button className="flex items-center gap-2 bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg"
        onClick={handleLogout}>
          <FiLogOut /> Logout
        </button>
      </nav>
      <div className="container mx-auto p-6">
        <h2 className="text-3xl font-semibold text-blue-900 mb-6">Ticket Management</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tickets.length > 0 ? (
            tickets.map((ticket) => (
              <div key={ticket.id} className="bg-gray-100 p-6 rounded-lg shadow-md flex flex-col gap-3 border-l-4 border-blue-900">
                <div className="flex items-center gap-2 text-blue-900 font-semibold text-xl">
                  <FiTag /> {ticket.ticket_title}
                </div>
                <p className="text-gray-700 flex items-start gap-2">
                  <FiFileText className="text-blue-900 mt-1" /> {ticket.ticket_description}
                </p>
                <span className={`inline-flex items-center gap-2 mt-2 px-3 py-1 rounded-full text-sm font-medium text-white ${
                  ticket.ticket_status === "open" ? "bg-green-600" : ticket.ticket_status === "pending" ? "bg-violet-600" : "bg-red-600"
                }`}>
                  {ticket.ticket_status === "open" && <FiCheckCircle />}
                  {ticket.ticket_status === "pending" && <FiClock />}
                  {ticket.ticket_status === "closed" && <FiXCircle />}
                  {ticket.ticket_status}
                </span>
                <div className="mt-4 flex gap-2">
                  <button 
                    className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg"
                    onClick={() => updateStatus(ticket._id, "open")}
                  >
                    Open
                  </button>
                  <button 
                    className="bg-violet-500 hover:bg-violet-600 text-white px-4 py-2 rounded-lg"
                    onClick={() => updateStatus(ticket._id, "pending")}
                  >
                    Pending
                  </button>
                  <button 
                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg"
                    onClick={() => updateStatus(ticket._id, "closed")}
                  >
                    Close
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-lg text-center col-span-full">No tickets available.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminHome;
