import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Collapsible from "../components/Collapsible";
import Edit from "../components/Edit";

const EditHabit = () => {
  const [habit, setHabit] = useState(null);
  const [freq, setFreq] = useState("");
  const [category, setCategory] = useState("");
  const [error, setError] = useState("");
  const [title, setTitle] = useState("");
  const { id } = useParams();
  const navigate = useNavigate();
  useEffect(() => {
    const getHabit = async () => {
      const payload = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/habits/${id}`,
        {
          method: "GET",
          headers: {
            Authorization: localStorage.getItem("token"),
            "Content-Type": "application/json",
          },
          // body: JSON.stringify({ habitId }),
        }
      );
      const res = await payload.json();
      console.log(res);
      if (res.habit) {
        setHabit(res.habit);
        setFreq(res.habit.frequency);
        setCategory(res.habit.category);
        setTitle(res.habit.title);
      }
    };
    getHabit();
  }, [id]);
  const handleFreq1 = (e) => {
    setFreq(e);
    // console.log(e);
  };
  const handleFreq2 = (e) => {
    // console.log(e);
    setCategory(e);
  };
  return (
    <div className="text-white h-screen flex gap-4 items-center justify-center flex-col w-screen">
      {habit && (
        <Edit
          habit={habit}
          title={title}
          setTitle={setTitle}
          handleFreq1={handleFreq1}
          handleFreq2={handleFreq2}
        />
      )}
      <div>
        <button
          className="bg-green-500 cursor-pointer hover:bg-green-600 py-1 px-2 font-bold rounded-lg text-lg"
          onClick={async () => {
            const data = await fetch(
              `${import.meta.env.VITE_BACKEND_URL}/habits/${habit._id}/change`,
              {
                method: "PUT",
                headers: {
                  Authorization: localStorage.getItem("token"),
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  title: title,
                  frequency: freq,
                  category,
                }),
              }
            );
            const res = await data.json();
            if (res.message) {
              navigate("/dashboard");
            }
            if (res.error) {
              setError(res.error);
            }
          }}
        >
          Save Changes
        </button>
      </div>
      <div>
        <button
          className="bg-red-500 cursor-pointer hover:bg-red-600 py-1 px-2 font-bold rounded-lg text-lg"
          onClick={async () => {
            const data = await fetch(
              `${import.meta.env.VITE_BACKEND_URL}/habits/${habit._id}`,
              {
                method: "DELETE",
                headers: {
                  Authorization: localStorage.getItem("token"),
                  "Content-Type": "application/json",
                },
              }
            );
            const res = await data.json();
            if (res.message) {
              navigate("/dashboard");
            }
            if (res.error) {
              setError(res.error);
            }
          }}
        >
          Delete Habit
        </button>
      </div>
      <div>
        {error && <div className="text-sm my-2 text-red-600">{error}</div>}
      </div>
    </div>
  );
};

export default EditHabit;
