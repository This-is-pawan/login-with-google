import { useEffect, useState } from "react";
import axiosInstance from "./axios";
import { useAuth } from "./AuthContext";

const Profile = () => {
  const { auth, setAuth } = useAuth();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // ---------- Refresh Token ----------
  const refreshToken = async () => {
    try {
      const res = await axiosInstance.post(
        "/api/google/refresh",
        {},
        { withCredentials: true }
      );

      const newToken = res.data?.accessToken;
      if (!newToken) return null;

      setAuth({ accessToken: newToken });
      return newToken;
    } catch {
      setAuth(null);
      return null;
    }
  };

  // ---------- Fetch User (Retry ONLY ONCE) ----------
  const fetchUser = async () => {
    setLoading(true);

    let token = auth?.accessToken;

    // 1. If no token → try refresh once
    if (!token) {
      token = await refreshToken();
      if (!token) {
        setUser(null);
        setLoading(false);
        return;
      }
    }

    try {
      const res = await axiosInstance.get("/api/user/me", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setUser(res.data.user);
    } catch (err) {
      // 2. If token expired → retry ONLY once
      if (err.response?.status === 401) {
        const newToken = await refreshToken();

        if (newToken) {
          try {
            const retryRes = await axiosInstance.get("/api/user/me", {
              headers: { Authorization: `Bearer ${newToken}` },
            });

            setUser(retryRes.data.user);
          } catch {
            setUser(null); // stop retry ❌
          }
        } else {
          setUser(null);
        }
      } else {
        setUser(null);
      }
    } finally {
      setLoading(false);
    }
  };

  // ---------- Logout ----------
  const handleLogout = async () => {
    await axiosInstance.post("/api/google/logout");
    setAuth(null);
    setUser(null);
    window.location.href = "/";
  };

  useEffect(() => {
    fetchUser();
  }, []);

  if (loading) return <h2>Loading...</h2>;
  if (!user) return <h2>Not Logged In</h2>;
return (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-indigo-200">
    <div className="bg-white shadow-xl rounded-2xl p-6 w-80 text-center border border-gray-200">

      {/* Profile Image */}
      <div className="flex justify-center">
        <img
          src={user.photo}
          alt="profile"
          referrerPolicy="no-referrer"
          className="w-24 h-24 rounded-full border-4 border-blue-400 shadow-md"
        />
      </div>

      {/* Name */}
      <h2 className="mt-4 text-xl font-bold text-gray-800">
        {user.name}
      </h2>

      {/* Email */}
      <p className="text-gray-500 text-sm mt-1">
        {user.email}
      </p>

      {/* Divider */}
      <div className="my-4 border-t"></div>

      {/* Logout Button */}
      <button
        onClick={handleLogout}
        className="w-full bg-blue-500 hover:bg-blue-600 transition duration-200 text-white font-semibold py-2 rounded-lg shadow-md"
      >
        Logout
      </button>

    </div>
  </div>
);

};

export default Profile;
