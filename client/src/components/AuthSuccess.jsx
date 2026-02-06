import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "./axios";
import { useAuth } from "./AuthContext";

const AuthSuccess = () => {
  const navigate = useNavigate();
  const { setAuth } = useAuth();

  useEffect(() => {
    const login = async () => {
      try {
        const res = await axiosInstance.post(
          "/api/google/refresh",
          {},
          { withCredentials: true }
        );

        const token = res.data?.accessToken;
        if (!token) throw new Error();

        setAuth({ accessToken: token }); // store globally
        navigate("/profile", { replace: true });
      } catch {
        navigate("/login", { replace: true });
      }
    };

    login();
  }, [navigate, setAuth]);

  return <h2 style={{ textAlign: "center" }}>Signing you in...</h2>;
};

export default AuthSuccess;
