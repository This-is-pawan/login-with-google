import { useEffect, useState } from "react";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // loading state
  const [error, setError] = useState(null);

  // ---------------- LOGOUT ----------------
  const handleLogout = async () => {
    try {
      // Clear access token from localStorage
      localStorage.removeItem("accessToken");

      // Call backend to clear refresh token cookie
      await fetch(`${import.meta.env.VITE_URL}/logout`, {
        method: "POST",
        credentials: "include",
      });

      // Redirect to home
      window.location.href = "/";
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  // ---------------- REFRESH ACCESS TOKEN ----------------
  const refreshAccessToken = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_URL}/refresh`, {
        method: "POST",
        credentials: "include", // send refresh token cookie
      });
      const data = await res.json();

      if (data.accessToken) {
        localStorage.setItem("accessToken", data.accessToken);
        return data.accessToken;
      } else {
        return null;
      }
    } catch (err) {
      console.error("Refresh token error:", err);
      return null;
    }
  };

  // ---------------- FETCH USER ----------------
  const fetchUser = async () => {
    setLoading(true);
    setError(null);

    let token = localStorage.getItem("accessToken");

    if (!token) {
      // Try refreshing token if not present
      token = await refreshAccessToken();
      if (!token) {
        setUser(null);
        setLoading(false);
        return;
      }
    }

    try {
      const res = await fetch(`${import.meta.env.VITE_URL}/user/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();

      if (data.success) {
        setUser(data.user);
      } else if (data.message === "Invalid or expired token") {
        // Token expired → try refresh
        const newToken = await refreshAccessToken();
        if (newToken) {
          fetchUser(); // retry fetching user
        } else {
          setUser(null);
        }
      } else {
        setUser(null);
      }
    } catch (err) {
      console.error("Fetch user error:", err);
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
