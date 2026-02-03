const Navbar = () => {
  const handleGoogleLogin = () => {
    window.location.href = `${import.meta.env.VITE_URL}/api/google/login`;
  };

  return (
    <div className="flex justify-between items-center p-3 bg-pink-200">
      <h1 className="font-bold">Google Auth</h1>

      <button
        onClick={handleGoogleLogin}
        className="bg-red-500 text-white px-4 py-2 rounded"
      >
        Continue with Google
      </button>
    </div>
  );
};

export default Navbar;
