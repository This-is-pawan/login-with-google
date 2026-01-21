import { useEffect, useState } from "react";

const Profile = () => {
  const [user, setUser] = useState(null);

 const handleLogout = () => {
    window.location.href = `${import.meta.env.VITE_URL}/logout`;
  };
  useEffect(() => {
    fetch(`${import.meta.env.VITE_URL}/user/me`, {
      credentials: "include",
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) setUser(data.user);
      });
  }, []);

  if (!user) return <h2>Not Logged In</h2>;

  return (
    <div className="p-4">
     <img
  src={user.photo}
  alt="profile"
  width={80}
  referrerPolicy="no-referrer"
  style={{ borderRadius: "50%" }}
/>

      <h2>{user?.name?.charAt(0)}</h2>
      <p>{user?.email}</p>
       <button
            onClick={handleLogout}
            className="bg-red-600 text-white px-4 py-2 rounded"
          >
            Logout
          </button>
    </div>
  );
};

export default Profile;
