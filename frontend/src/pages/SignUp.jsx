import { useState } from "react";
import { Link } from "react-router-dom";
import { signupSchema } from "../schemas/schema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

const SignUp = () => {
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(signupSchema),
  });
  const onSubmit = async (e) => {
    const data = e;
    console.log("data", e);
    const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/auth/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    const val = await res.json();
    if (val.message) {
      setMessage(`${val.message}! Please login `);
      setError("");
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
          to="/login"
          className="bg-[#3730a3] text-white p-2 px-4 font-bold rounded-md hover:bg-[#2c2591] cursor-pointer"
        >
          Login
        </Link>
      </div>
      <div className="text-white flex flex-col items-center justify-center h-full">
        <form
          className="flex flex-col gap-3.5 w-1/2"
          onSubmit={handleSubmit(onSubmit)}
        >
          <label
            htmlFor="email"
            className="font-semibold text-xl cursor-pointer"
          >
            Gmail
          </label>
          <input
            {...register("email")}
            placeholder="abc@gmail.com"
            type="email"
            id="email"
            name="email"
            className="bg-white w-full rounded-xl hover:bg-slate-200 text-black px-2 py-1 font-semibold"
          />
          {errors.email && (
            <p className="text-red-500">{errors.email.message}</p>
          )}
          <label
            htmlFor="name"
            className="font-semibold text-xl cursor-pointer"
          >
            Name
          </label>
          <input
            {...register("name")}
            placeholder="Jane Smith"
            id="name"
            type="name"
            name="name"
            className="bg-white rounded-xl w-full hover:bg-slate-200 text-black px-2 py-1 font-semibold"
          />
          {errors.name && <p className="text-red-500">{errors.name.message}</p>}
          <label
            htmlFor="password"
            className="font-semibold text-xl cursor-pointer"
          >
            Password
          </label>
          <input
            {...register("password")}
            placeholder="•••••••"
            type="password"
            id="password"
            name="password"
            className="bg-white rounded-xl w-full hover:bg-slate-200 text-black px-2 py-1 font-semibold"
          />
          {errors.password && (
            <p className="text-red-500">{errors.password.message}</p>
          )}
          <div className="text-center">
            <button
              type="submit"
              className=" bg-blue-600 text-white p-2 px-4 font-bold rounded-md hover:bg-blue-700 cursor-pointer w-fit"
            >
              Sign Up
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

export default SignUp;
