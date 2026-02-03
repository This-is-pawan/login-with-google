import { useEffect } from "react";
import axiosInstance from "./axios";
import { useNavigate } from "react-router-dom";

const AuthSuccess = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const getAccessToken = async () => {
      try {
        const res = await axiosInstance.post("/api/google/refresh");

        if (res.data.accessToken) {
          localStorage.setItem("accessToken", res.data.accessToken);
          navigate("/profile");
        } else {
          navigate("/login");
        }
      } catch (err) {
        console.error("Auth success error:", err);
        navigate("/login");
      }
    };

    getAccessToken();
  }, [navigate]);

  return <h2 className="p-4">Signing you in...</h2>;
};

export default AuthSuccess;
