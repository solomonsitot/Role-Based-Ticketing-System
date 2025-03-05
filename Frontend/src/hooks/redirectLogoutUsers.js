import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { SET_LOGIN } from "../redux/features/auth/authSlice";
import { toast } from "react-toastify";
import axios from "axios";

const useRedirectLogoutUsers = (path) => {
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const redirect = async () => {
      try {
        const response = await axios.get(
          `${BACKEND_URL}/user/get-user-status`,
          { withCredentials: true }
        );
        const isLoggedIn = response.data;
        dispatch(SET_LOGIN(isLoggedIn));
        if (!isLoggedIn) {
          toast("Session expired, please login again");
          navigate(path);
        }
      } catch (error) {
        console.error("Error checking login status:", error);
        toast.error("An error occurred while checking login status");
      }
    };

    redirect();
  }, [dispatch, navigate, path]);
};

export default useRedirectLogoutUsers;