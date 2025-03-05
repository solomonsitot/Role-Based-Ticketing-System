import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import ticket_img from '../../assets/Ticket.png'
import useRedirectLogoutUsers from "../../hooks/redirectLogoutUsers";

export default function UserHome() {
  useRedirectLogoutUsers("/login");
  const [tickets, setTickets] = useState([]);
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
  const { id } = useParams(); 
  useEffect(() => {
    async function fetchTickets() {
      try {
        const response = await axios.get(`${BACKEND_URL}/user/get-my-tickets`, { withCredentials: true });
        setTickets(response.data);
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
return (
  <div className="flex flex-col min-h-screen bg-gray-100 p-6">
    <nav className="flex justify-between items-center bg-white shadow-md px-6 py-4 rounded-lg mb-6">
      <h1 className="text-xl font-bold text-gray-700">Welcome</h1>
      <button className="bg-red-600 hover:bg-red-800 transition duration-300 text-white px-4 py-2 rounded-lg shadow"
      onClick={handleLogout}>
        Logout
      </button>
    </nav>

    <div className="flex flex-col items-center">
      <div className="w-full flex  justify-between px-10 mb-10">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Your Tickets</h1>
        <button className="mb-6 bg-blue-600 hover:bg-blue-700 transition text-white px-6 py-3 rounded-lg shadow-lg">
          <a href={`/${id}/add-new-ticket`}>Add New Ticket</a>
        </button>
      </div>

      {/* Tickets Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-6xl bg-white rounded-3xl p-6 shadow-md">
        {tickets.length > 0 ? (
          tickets.map((ticket) => (
            <div
              key={ticket.id}
              className="bg-gray-50 p-6 rounded-xl shadow-md border border-gray-200 transition duration-300 hover:shadow-lg hover:scale-105"
            >
              <div className="flex justify-between px-4 items-center">
                <h2 className="text-lg font-semibold text-blue-950">{ticket.ticket_title}</h2>
                <img className="h-[50px] object-contain" src={ticket_img} alt="Ticket Icon" />
              </div>
              <p className="text-gray-600 mt-2">{ticket.ticket_description}</p>

              <div className="flex justify-between mt-4">
                <p className="text-blue-950">
                  Status:{" "}
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                      ticket.ticket_status === "open"
                        ? "bg-green-100 text-green-600"
                        : ticket.ticket_status === "pending"
                        ? "bg-yellow-100 text-yellow-600"
                        : "bg-red-100 text-red-600"
                    }`}
                  >
                    {ticket.ticket_status}
                  </span>
                </p>
                <p className="text-gray-500 text-sm">📅 {ticket.created_at}</p>
              </div>
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center">
            <p className="text-gray-700 text-lg mb-4">No tickets available.</p>
            <a
              href={`/${id}/add-new-ticket`}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg shadow-lg transition"
            >
              Create Your First Ticket
            </a>
          </div>
        )}
      </div>
    </div>
  </div>
);

  
}

