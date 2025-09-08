import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Habits from "../components/Habit";

const Dashboard = () => {
  const [loggedIn, setLoggedIn] = useState(false);
  const navigate = useNavigate();
  const [habits, setHabits] = useState(null);
  console.log(habits);
  useEffect(() => {
    const isLoggedIn = async () => {
      const token = localStorage.getItem("token");
      // console.log(token);
      if (token) {
        const data = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/dashboard`,
          {
            method: "GET",
            headers: {
              Authorization: token,
              "Content-Type": "application/json",
            },
          }
        );
        // console.log(e);
        const res = await data.json();
        if (res.message) {
          setLoggedIn(true);
        }
        if (res.error) {
          return;
        }
        const payload = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/dashboard/habits`,
          {
            method: "GET",
            headers: {
              Authorization: token,
              "Content-Type": "application/json",
            },
          }
        );
        const hab = await payload.json();
        console.log(hab.length);
        if (hab.length != 0) {
          setHabits(hab);
        }
      }
    };
    isLoggedIn();
  }, []);
  const logOut = () => {
    localStorage.removeItem("token");
    navigate("/");
  };
  return (
    <div className="text-white">
      {loggedIn ? (
        <div>
          <div className="flex items-center gap-4 p-2 w-full justify-end">
            <button
              className="bg-blue-500 hover:bg-blue-600 px-4 h-fit py-1 font-bold rounded-xl"
              onClick={() => {
                navigate("/create");
              }}
            >
              Create habbit
            </button>
            <button
              className="bg-red-500 hover:bg-red-600 px-4 py-1 font-bold rounded-xl my-4"
              onClick={logOut}
            >
              Log Out
            </button>
          </div>
          <div className="flex items-center justify-center">
            {habits ? (
              <div>
                <div className="text-5xl font-semibold pb-4">Your Habits</div>
                {habits.map((habit) => {
                  return (
                    <div key={habit._id} className="">
                      <Habits
                        habit={{
                          title: habit.title,
                          isActive: habit.isActive,
                          _id: habit._id,
                          freq: habit.frequency,
                          category: habit.category,
                        }}
                      />
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-xl font-bold">
                Please create a habit to view it!
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="flex w-screen flex-col gap-4 h-screen items-center justify-center">
          <div className="text-xl font-semibold">Please login to continue</div>
          <Link
            to="/login"
            className="bg-[#3730a3] text-white p-2 px-4 font-bold rounded-md hover:bg-[#2c2591] cursor-pointer"
          >
            Login
          </Link>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
