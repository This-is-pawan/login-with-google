const Navbar = () => {



  return (
    <div className="flex justify-between p-3 bg-pink-200">
      <h1>Google Auth</h1>
     <a href={`${import.meta.env.VITE_URL}/login-with-google`}>
 Continue with Google
</a>

    </div>
  );
};

export default Navbar;
