import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Collapsible from "../components/Collapsible";

const Feed = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activities, setActivites] = useState(null);
  const [filter, setFilter] = useState(false);
  const [errors, setErrors] = useState({});
  const [filterCategory, setFilterCategory] = useState("");
  // const [cross, setCross] = useState(false);
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
        setActivites(hab.activities);
      }
      //   console.log(hab);
    };
    setIsLoggedIn(true);
    getFeed();
  }, []);
  const handleFreq2 = (e) => {
    // console.log(e);
    setFilterCategory(e);
    setFilter(true);
    if (errors.category) {
      setErrors((prev) => ({ ...prev, category: undefined }));
    }
  };
  return (
    <div className="text-white">
      {isLoggedIn ? (
        <div>
          <div className="w-screen text-end flex items-center justify-end">
            <button
              className="bg-blue-500 cursor-pointer hover:bg-blue-600 rounded-xl font-bold text-lg py-1 px-2 m-2"
              onClick={() => {
                navigate("/leaderboard");
              }}
            >
              Leaderboard
            </button>
            <Collapsible
              label={"Select Category:"}
              options={[
                "Health",
                "Fitness",
                "Learning",
                "Productivity",
                "Mindfulness",
                "Social",
                "Other",
              ]}
              defaultValue={"Not Selected"}
              onChange={handleFreq2}
            />
            <button
              className="bg-blue-500 cursor-pointer hover:bg-blue-600 rounded-xl font-bold text-lg py-1 px-2 m-2"
              onClick={() => {
                navigate("/dashboard");
              }}
            >
              Dashboard
            </button>
          </div>
          <div className="text-5xl font-semibold border-b w-screen text-center">
            See Your friends activities
          </div>
          {errors.category && (
            <div className="text-sm mt-1 text-red-500">{errors.category}</div>
          )}
          {activities ? (
            <div className="overflow-scroll">
              {filter
                ? activities
                    .filter(
                      (activity) => activity.habit.category == filterCategory
                    )
                    .map((activity) => {
                      console.log(activity);
                      return (
                        <div
                          key={activity.id}
                          className="w-full m-2 text-slate-400 border-y px-2 py-1"
                        >
                          <div className="font-semibold">
                            {activity.user.email}{" "}
                          </div>
                          <div className="font-semibold">
                            Type: {activity.type}
                          </div>
                          <div>
                            <div className="">
                              Date :{" "}
                              {activity.date
                                ? activity.date.split("T")[0]
                                : activity.createdAt.split("T")[0]}
                            </div>
                            {activity.habit && (
                              <div>Category: {activity.habit.category}</div>
                            )}
                            {activity.streak && (
                              <div>Streak : {activity.streak}</div>
                            )}
                          </div>
                        </div>
                      );
                    })
                : activities.map((activity) => {
                    return (
                      <div
                        key={activity.id}
                        className="w-full m-2 text-slate-400 border-y px-2 py-1"
                      >
                        <div className="font-semibold">
                          {activity.user.email}{" "}
                        </div>
                        <div className="font-semibold">
                          Type: {activity.type}
                        </div>
                        <div>
                          <div className="">
                            Date :{" "}
                            {activity.date
                              ? activity.date.split("T")[0]
                              : activity.createdAt.split("T")[0]}
                          </div>
                          {activity.habit && (
                            <div>Category: {activity.habit.category}</div>
                          )}
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

export default Feed;
