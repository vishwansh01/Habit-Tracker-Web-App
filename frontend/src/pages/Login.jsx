import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Login = () => {
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const onSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());
    const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/auth/signin`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    const val = await res.json();
    if (val.token) {
      localStorage.setItem("token", `Bearer ${val.token}`);
      // window.location.reload();
      navigate("/dashboard");
    }
    if (val.error) {
      setError(val.error);
      setMessage("");
    }
  };
  return (
    <div className="">
      <div className="p-4 flex items-end w-full justify-end">
        <Link
          to="/signup"
          className="bg-[#3730a3] text-white p-2 px-4 font-bold rounded-md hover:bg-[#2c2591] cursor-pointer"
        >
          Sign Up
        </Link>
      </div>
      <div className="text-white flex flex-col items-center justify-center h-full">
        <form className="flex flex-col gap-3.5 w-1/2" onSubmit={onSubmit}>
          {/* <div> */}
          <label
            htmlFor="email"
            className="font-semibold text-xl cursor-pointer"
          >
            Gmail
          </label>
          <input
            placeholder="abc@gmail.com"
            type="email"
            id="email"
            name="email"
            className="bg-white w-full rounded-xl hover:bg-slate-200 text-black px-2 py-1 font-semibold"
          />
          {/* </div> */}
          {/* <label
            htmlFor="name"
            className="font-semibold text-xl cursor-pointer"
          >
            Name
          </label>
          <input
            placeholder="Jane Smith"
            id="name"
            type="name"
            name="name"
            className="bg-white rounded-xl w-full hover:bg-slate-200 text-black px-2 py-1 font-semibold"
          /> */}
          <label
            htmlFor="password"
            className="font-semibold text-xl cursor-pointer"
          >
            Password
          </label>
          <input
            placeholder="•••••••"
            type="password"
            id="password"
            name="password"
            className="bg-white rounded-xl w-full hover:bg-slate-200 text-black px-2 py-1 font-semibold"
          />
          <div className="text-center">
            <button
              type="submit"
              className=" bg-blue-600 text-white p-2 px-4 font-bold rounded-md hover:bg-blue-700 cursor-pointer w-fit"
            >
              Login
            </button>
          </div>
        </form>
        <div>
          {error && <div className="text-sm my-2 text-red-600">{error}</div>}
          {message && (
            <div className="text-green-700 my-2 text-sm">{message}</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;
