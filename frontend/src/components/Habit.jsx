import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
// import { useNavigate } from "react-router-dom";

const Habits = ({ habit }) => {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  // const onComplete = async (habitId) => {
  //   // console.log(habitId);
  //   const payload = await fetch(
  //     `${import.meta.env.VITE_BACKEND_URL}/habits/complete`,
  //     {
  //       method: "POST",
  //       headers: {
  //         Authorization: localStorage.getItem("token"),
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify({ habitId }),
  //     }
  //   );
  //   const res = await payload.json();
  //   // console.log(res);
  //   if (res.message) {
  //     window.location.reload();
  //   }
  //   if (res.error) {
  //     setError(res.error);
  //   }
  // };
  const checkIn = async ({ habitId }) => {
    // console.log(habitId);
    const payload = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}/habits/${habitId}/check`,
      {
        method: "POST",
        headers: {
          Authorization: localStorage.getItem("token"),
          "Content-Type": "application/json",
        },
        // body: JSON.stringify({ habitId }),
      }
    );
    const res = await payload.json();
    console.log(res);
    if (res.error) {
      setError(res.error);
    }
    if (res.message) {
      window.location.reload();
    }
  };
  //   console.log(habit);
  return (
    <div className="text-white m-4 border-y-2 py-4">
      {" "}
      <div className="font-bold text-xl text-slate-400">{habit.title}</div>
      <button
        className="font-bold text-xl bg-red-500 hover:bg-red-600 py-1 px-2 rounded-xl cursor-pointer"
        onClick={() => {
          navigate(`/edit/${habit._id}`);
        }}
      >
        Edit
      </button>
      <div className="flex flex-col items-center justify-center">
        <div className="font-bold text-sm"> Frequency : {habit.freq}</div>
        <div className="font-bold text-sm"> Category : {habit.category}</div>
        {/* <div className=" flex gap-2 items-center justify-center"> */}
        {/* <div className="font-bold text-sm">
            Active : {habit.isActive ? "Uncompleted" : "Completed"}
          </div> */}
        {/* {habit.isActive && (
            <div
              className="text-green-600 text-sm font-semibold hover:underline cursor-pointer"
              onClick={() => {
                // console.log(habit._id);
                onComplete(habit._id);
              }}
            >
              Complete it
            </div>
          )} */}
        {/* </div> */}
        {!habit.completedToday && (
          <button
            className="bg-green-500 hover:bg-green-600 font-semibold px-2 py-1 rounded-xl cursor-pointer"
            onClick={() => {
              checkIn({ habitId: habit._id });
            }}
          >
            Check In
          </button>
        )}
        <div className="font-bold text-sm">
          Completion Rate : {habit.completionRate}
        </div>
        <div className="font-bold text-sm">
          Created At : {habit.createdAt.split("T")[0]}
        </div>
        <div className="font-bold text-sm">Streak : {habit.streak}</div>
        <div className="font-bold text-sm">
          Total Checkins : {habit.checkIns}
        </div>
      </div>
      <div>
        {error && (
          <div className="text-xs w-fit h-fit my-2 text-red-600">{error}</div>
        )}
      </div>
    </div>
  );
};

export default Habits;
