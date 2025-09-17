import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Leaderboard = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activities, setActivites] = useState(null);
  const navigate = useNavigate();
  console.log(activities);
  useEffect(() => {
    const getFeed = async () => {
      const payload = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/social/feed`,
        {
          method: "GET",
          headers: {
            Authorization: localStorage.getItem("token"),
            "Content-Type": "application/json",
          },
        }
      );
      const hab = await payload.json();
      if (hab.activities) {
        setActivites(
          hab.activities
            .filter(
              (activity) =>
                activity.streak !== undefined && activity.streak !== null
            )
            .sort((a, b) => a.streak - b.streak)
        );
      }
    };
    setIsLoggedIn(true);
    getFeed();
  }, []);
  return (
    <div className="text-white">
      {isLoggedIn ? (
        <div>
          <div className="py-3 flex justify-center gap-20 items-center">
            <button
              className="bg-blue-500 cursor-pointer hover:bg-blue-600 rounded-xl font-bold text-lg py-1 px-2 m-2"
              onClick={() => {
                navigate("/feed");
              }}
            >
              Feed
            </button>
            <div className="text-5xl font-semibold border-b w-fit text-center">
              Leader Board
            </div>
            <button
              className="bg-blue-500 cursor-pointer hover:bg-blue-600 rounded-xl font-bold text-lg py-1 px-2 m-2"
              onClick={() => {
                navigate("/dashboard");
              }}
            >
              Dashboard
            </button>
          </div>
          <div>
            {activities ? (
              <div className="overflow-scroll">
                {activities.map((activity) => {
                  return (
                    <div
                      key={activity.id}
                      className="w-full m-2 text-slate-400 border-y px-2 py-1"
                    >
                      <div className="font-semibold">
                        {activity.user.email}{" "}
                      </div>
                      {/* <div className="font-semibold">Type: {activity.type}</div> */}
                      <div>
                        {/* <div className="">
                        Date :{" "}
                        {activity.date
                        ? activity.date.split("T")[0]
                        : activity.createdAt.split("T")[0]}
                      </div> */}
                        {/* {activity.habit && (
                        <div>Category: {activity.habit.category}</div>
                      )} */}
                        {activity.streak && (
                          <div>Streak : {activity.streak}</div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div>No Activities</div>
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

export default Leaderboard;
