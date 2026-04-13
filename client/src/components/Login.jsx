import React from "react";
import toast from "react-hot-toast";
import { useAppContext } from "../context/AppContext";

const Login = () => {
  const [state, setState] = React.useState("login");
  const { setShowLoginUser, axios, navigate, fetchUser } = useAppContext();

  const [formData, setFormData] = React.useState({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (state === "register" && !formData.name.trim()) {
        toast.error("Name is required");
        return;
      }

      const endpoint =
        state === "login" ? "/api/user/login" : "/api/user/register";
      const payload =
        state === "login"
          ? { email: formData.email.trim(), password: formData.password }
          : {
              name: formData.name.trim(),
              email: formData.email.trim(),
              password: formData.password,
            };

      const { data } = await axios.post(endpoint, payload);

      if (data.success) {
        await fetchUser();
        setShowLoginUser(false);
        navigate("/");
        toast.success(
          state === "login" ? "Logged in successfully" : "Account created"
        );
      } else {
        toast.error(data.message || "Request failed");
      }
    } catch (error) {
      const msg =
        error?.response?.data?.message ||
        error?.message ||
        "Something went wrong";
      toast.error(msg);
    }
  };

  return (
    <div>
      {/* Overlay */}
      <div
        onClick={() => setShowLoginUser(false)}
        className='fixed inset-0 z-30 flex items-center justify-center text-sm text-gray-600 bg-black/50'
        >
        <form
            onSubmit={handleSubmit}
            onClick={(e) => e.stopPropagation()} // ✅ FIXED
            className="w-full sm:w-[350px] text-center bg-white border border-gray-200 rounded-2xl px-8 shadow-md"
        >
          {/* Title */}
          <h1 className="text-gray-800 text-3xl mt-10 font-medium">
            {state === "login" ? "Login" : "Sign up"}
          </h1>

          <p className="text-primary text-sm mt-2">
            Please sign in to continue
          </p>

          {/* Name */}
          {state !== "login" && (
            <div className="flex items-center mt-6 w-full bg-gray-100 border border-gray-200 h-12 rounded-full overflow-hidden pl-6 gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="text-gray-400" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="8" r="5" />
                <path d="M20 21a8 8 0 0 0-16 0" />
              </svg>
              <input
                type="text"
                name="name"
                placeholder="Name"
                className="w-full bg-transparent text-gray-700 placeholder-gray-400 outline-none"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
          )}

          {/* Email */}
          <div className="flex items-center mt-4 w-full bg-gray-100 border border-gray-200 h-12 rounded-full overflow-hidden pl-6 gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="text-gray-400" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m22 7-8.991 5.727a2 2 0 0 1-2.009 0L2 7" />
              <rect x="2" y="4" width="20" height="16" rx="2" />
            </svg>
            <input
              type="email"
              name="email"
              placeholder="Email id"
              className="w-full bg-transparent text-gray-700 placeholder-gray-400 outline-none"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          {/* Password */}
          <div className="flex items-center mt-4 w-full bg-gray-100 border border-gray-200 h-12 rounded-full overflow-hidden pl-6 gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="text-gray-400" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
            <input
              type="password"
              name="password"
              placeholder="Password"
              className="w-full bg-transparent text-gray-700 placeholder-gray-400 outline-none"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          {/* Forgot */}
          <div className="mt-4 text-left">
            <button className="text-sm text-primary hover:underline">
              Forget password?
            </button>
          </div>

          {/* Button */}
          <button
            type="submit"
            className="mt-3 w-full h-11 rounded-full text-white bg-primary hover:bg-primary transition"
          >
            {state === "login" ? "Login" : "Sign up"}
          </button>

          {/* Toggle */}
          <p
            onClick={() =>
              setState(prev => prev === "login" ? "register" : "login")
            }
            className="text-primary text-sm mt-3 mb-11 cursor-pointer"
          >
            {state === "login"
              ? "Don't have an account?"
              : "Already have an account?"}
            <span className="text-primary hover:underline ml-1">
              click here
            </span>
          </p>
        </form>
      </div>

      {/* Background blobs (unchanged) */}
      <div className='fixed inset-0 -z-10 pointer-events-none'>
        <div className='absolute left-1/2 top-20 -translate-x-1/2 w-[600px] h-[300px] bg-gradient-to-tr from-indigo-800/20 to-transparent rounded-full blur-3xl' />
        <div className='absolute right-12 bottom-10 w-[400px] h-[200px] bg-gradient-to-bl from-indigo-700/20 to-transparent rounded-full blur-2xl' />
      </div>
    </div>
  );
};

export default Login;