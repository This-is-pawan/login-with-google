import { useEffect, useState } from "react";
import axiosInstance from "./axios";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(null); // 🔐 Access token in memory only

  // ---------------- GET NEW ACCESS TOKEN ----------------
  const refreshAccessToken = async () => {
    try {
      const res = await axiosInstance.post("/api/google/refresh");
      const newToken = res.data.accessToken;
      setToken(newToken); // store in memory
      return newToken;
    } catch {
      setToken(null);
      return null;
    }
  };

  // ---------------- FETCH USER ----------------
  const fetchUser = async (currentToken) => {
    setLoading(true);

    let accessToken = currentToken || token;

    // If no token → get new one
    if (!accessToken) {
      accessToken = await refreshAccessToken();
      if (!accessToken) {
        setUser(null);
        setLoading(false);
        return;
      }
    }

    try {
      const res = await axiosInstance.get("/api/user/me", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      setUser(res.data.user);
    } catch (err) {
      // If token expired → refresh and retry once
      if (err.response?.status === 401) {
        const newToken = await refreshAccessToken();
        if (newToken) return fetchUser(newToken);
        setUser(null);
      }
    } finally {
      setLoading(false);
    }
  };

  // ---------------- LOGOUT ----------------
  const handleLogout = async () => {
    try {
      await axiosInstance.post("/api/google/logout");
      setToken(null);
      setUser(null);
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
