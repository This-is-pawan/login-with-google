import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "./axios";
import { useAuth } from "./AuthContext";

const AuthSuccess = () => {
  const navigate = useNavigate();
  const { setAuth } = useAuth();

  useEffect(() => {
    let isMounted = true;

    const getAccessToken = async () => {
      try {
        const res = await axiosInstance.post(
          "/api/google/refresh",
          {},
          { withCredentials: true }
        );

        const accessToken = res?.data?.accessToken;

        if (accessToken && isMounted) {
          // ✅ store in memory
          setAuth({ accessToken });

          // ✅ also persist for axios interceptor (important)
          localStorage.setItem("accessToken", accessToken);

          navigate("/profile", { replace: true });
        }
      } catch (error) {
        console.error("Auth success error:", error);

        if (isMounted) {
          navigate("/login", { replace: true });
        }
      }
    };

    getAccessToken();

    return () => {
      isMounted = false;
    };
  }, [navigate, setAuth]);

  return (
    <div className="p-4 text-center">
      <h2>Signing you in…</h2>
    </div>
  );
};

export default AuthSuccess;
