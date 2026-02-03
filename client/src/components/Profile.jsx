import { useEffect, useState } from "react";
import axiosInstance from "./axios";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // ---------------- REFRESH TOKEN ----------------
  const refreshAccessToken = async () => {
    try {
      const res = await axiosInstance.post("/api/google/refresh");
      localStorage.setItem("accessToken", res.data.accessToken);
      return res.data.accessToken;
    } catch {
      return null;
    }
  };

  // ---------------- FETCH USER ----------------
  const fetchUser = async () => {
    setLoading(true);

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
      const res = await axiosInstance.get("/api/user/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setUser(res.data.user);
    } catch (err) {
      if (err.response?.status === 401) {
        const newToken = await refreshAccessToken();
        if (newToken) fetchUser();
        else setUser(null);
      }
    } finally {
      setLoading(false);
    }
  };

  // ---------------- LOGOUT ----------------
  const handleLogout = async () => {
    try {
      await axiosInstance.post("/api/google/logout");
      localStorage.removeItem("accessToken");
      window.location.href = "/";
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  if (loading) return <h2>Loading...</h2>;
  if (!user) return <h2>Not Logged In</h2>;

  return (
    <div className="p-4">
      <img
        src={user.photo}
        alt="profile"
        width={80}
        style={{ borderRadius: "50%" }}
        referrerPolicy="no-referrer"
      />

      <h2 className="font-bold mt-2">{user.name}</h2>
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
