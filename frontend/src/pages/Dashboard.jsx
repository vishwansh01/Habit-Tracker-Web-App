import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Habits from "../components/Habit";

const Dashboard = () => {
  const [loggedIn, setLoggedIn] = useState(false);
  const navigate = useNavigate();
  const [habits, setHabits] = useState(null);
  const [search, setSearch] = useState("");
  const [users, setUsers] = useState(null);
  const [cross, setCross] = useState(false);
  // console.log(habits);
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
        // console.log(hab);
        if (hab.habits.length != 0) {
          console.log(hab.habits);
          setHabits(hab.habits);
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
        <div className="">
          <div className="flex items-center gap-4 p-2 w-screen lg:justify-end">
            <button
              className="bg-blue-500 cursor-pointer hover:bg-blue-600 text-xs lg:text-xl px-2 lg:font-bold  lg:px-4 h-fit py-1 rounded-xl"
              onClick={() => {
                navigate("/feed");
              }}
            >
              View feed
            </button>
            <div className="flex flex-col lg:flex-row">
              <input
                type="name"
                className="bg-white text-slate-700 w-3/5 lg:w-full text-xs lg:text-xl font-bold px-2 rounded-lg py-1"
                placeholder="Enter user gmail"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                }}
              />
              <button
                className="bg-green-500 cursor-pointer hover:bg-green-600 text-sm lg:text-xl px-2 lg:font-bold  lg:px-4 rounded-lg my-2 lg:my-0 lg mx-3"
                onClick={async () => {
                  const payload = await fetch(
                    `${
                      import.meta.env.VITE_BACKEND_URL
                    }/social/users/search?q=${search}`,
                    {
                      method: "GET",
                      headers: {
                        Authorization: localStorage.getItem("token"),
                        "Content-Type": "application/json",
                      },
                    }
                  );
                  const hab = await payload.json();
                  // console.log(hab);
                  if (hab.users) {
                    console.log(hab);
                    setUsers(hab.users);
                    setCross(true);
                  }
                }}
              >
                Search
              </button>
            </div>
            <button
              className="bg-blue-500  cursor-pointer hover:bg-blue-600 text-xs lg:text-xl px-2 lg:font-bold  lg:px-4 h-fit py-1 rounded-xl"
              onClick={() => {
                navigate("/create");
              }}
            >
              Create habbit
            </button>
            <button
              className="bg-red-500  cursor-pointer hover:bg-red-600 py-1 text-xs lg:text-xl px-2 lg:font-bold  lg:px-4 rounded-xl my-4"
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
                          checkIns: habit.totalCheckIns,
                          streak: habit.streak,
                          completionRate: habit.completionRate,
                          createdAt: habit.createdAt,
                          completedToday: habit.completedToday,
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
      {cross && (
        <div
          className={`
        absolute top-0 left-0 z-10 overflow-scroll bg-black/50 w-screen h-screen flex items-center justify-center`}
        >
          {users &&
            users.map((user) => {
              return (
                <div key={user._id} className="border p-2">
                  <div>Email : {user.email}</div>
                  {/* <div>Id : {user._id}</div> */}
                  {user.email !== user.currUser && (
                    <div> Following : {user.isFollowing ? "Yes" : "No"}</div>
                  )}
                  {user.email !== user.currUser ? (
                    !user.isFollowing ? (
                      <button
                        className="bg-blue-500 my-2 hover:bg-blue-600 cursor-pointer rounded-lg text-xs lg:text-lg lg:font-bold  lg:px-4 py-1 px-2"
                        onClick={async () => {
                          const payload = await fetch(
                            `${import.meta.env.VITE_BACKEND_URL}/social/users/${
                              user.email
                            }/follow`,
                            {
                              method: "POST",
                              headers: {
                                Authorization: localStorage.getItem("token"),
                                "Content-Type": "application/json",
                              },
                            }
                          );
                          const hab = await payload.json();
                          console.log(hab);
                          if (hab.message) {
                            window.location.reload();
                            // setUsers(hab.users);
                            // setCross(true);
                          }
                        }}
                      >
                        Follow
                      </button>
                    ) : (
                      <button
                        className="bg-red-600 my-2 hover:bg-red-700 cursor-pointer rounded-lg text-lg font-bold py-1 px-2"
                        onClick={async () => {
                          const payload = await fetch(
                            `${import.meta.env.VITE_BACKEND_URL}/social/users/${
                              user.email
                            }/follow`,
                            {
                              method: "DELETE",
                              headers: {
                                Authorization: localStorage.getItem("token"),
                                "Content-Type": "application/json",
                              },
                            }
                          );
                          const hab = await payload.json();
                          console.log(hab);
                          if (hab.message) {
                            window.location.reload();
                            // setUsers(hab.users);
                            // setCross(true);
                          }
                        }}
                      >
                        Unfollow
                      </button>
                    )
                  ) : (
                    <div>You can't follow yourself</div>
                  )}
                </div>
              );
            })}
          <div
            className="m-4 cursor-pointer"
            onClick={() => {
              setCross(false);
            }}
          >
            X
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
