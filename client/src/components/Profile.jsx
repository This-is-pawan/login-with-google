import { useEffect, useState } from "react";
import axios from "axios";

const API_URL = import.meta.env.VITE_URL;

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // loading state
  const [error, setError] = useState(null);

  // ---------------- AXIOS INSTANCE ----------------
  const axiosInstance = axios.create({
    baseURL: API_URL,
    withCredentials: true, // send cookies with requests
  });

  // ---------------- LOGOUT ----------------
  const handleLogout = async () => {
    try {
      // Clear access token from localStorage
      localStorage.removeItem("accessToken");

      // Call backend to clear refresh token cookie
      await axiosInstance.post("/logout");

      // Redirect to home
      window.location.href = "/";
    } catch (err) {
      console.error("Logout error:", err.response || err);
    }
  };

  // ---------------- REFRESH ACCESS TOKEN ----------------
  const refreshAccessToken = async () => {
    try {
      const res = await axiosInstance.post("/refresh");
      const data = res.data;

      if (data.accessToken) {
        localStorage.setItem("accessToken", data.accessToken);
        return data.accessToken;
      } else {
        return null;
      }
    } catch (err) {
      console.error("Refresh token error:", err.response?.data || err);
      return null;
    }
  };

  // ---------------- FETCH USER ----------------
  const fetchUser = async () => {
    setLoading(true);
    setError(null);

    let token = localStorage.getItem("accessToken");

    if (!token) {
      token = await refreshAccessToken();
      if (!token) {
        setUser(null);
        setLoading(false);
        return;
      }
    }

    try {
      const res = await axiosInstance.get("/user/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = res.data;

      if (data.success) {
        setUser(data.user);
      } else if (data.message === "Invalid or expired token") {
        // Token expired → try refresh
        const newToken = await refreshAccessToken();
        if (newToken) fetchUser(); // retry fetching user
        else setUser(null);
      } else {
        setUser(null);
      }
    } catch (err) {
      console.error("Fetch user error:", err.response?.data || err);
      setUser(null);
      setError("Failed to fetch user data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  if (loading) return <h2>Loading...</h2>;
  if (!user) return <h2>Not Logged In</h2>;
  if (error) return <h2>{error}</h2>;

  return (
    <div className="p-4">
      <img
        src={user.photo}
        alt="profile"
        width={80}
        referrerPolicy="no-referrer"
        style={{ borderRadius: "50%" }}
      />

      <h2>{user.name}</h2>
      <p>{user.email}</p>

      <button
        onClick={handleLogout}
        className="bg-red-600 text-white px-4 py-2 rounded mt-3"
      >
        Logout
      </button>
    </div>
  );
};

export default Profile;
