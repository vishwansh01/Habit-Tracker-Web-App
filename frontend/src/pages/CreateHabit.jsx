import { useState } from "react";
import Collapsible from "../components/Collapsible";
import { useNavigate } from "react-router-dom";

const CreateHabit = () => {
  const [title, setTitle] = useState("");
  const [freq, setFreq] = useState("");
  const [category, setCategory] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // console.log(title);
  const handleFreq1 = (e) => {
    setFreq(e);
    // console.log(e);
  };
  const handleFreq2 = (e) => {
    // console.log(e);
    setCategory(e);
  };
  const onSubmit = async () => {
    const data = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}/habits/create`,
      {
        method: "POST",
        headers: {
          Authorization: localStorage.getItem("token"),
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title: title, frequency: freq, category }),
      }
    );
    const res = await data.json();
    if (res.message) {
      navigate("/dashboard");
    }
    if (res.error) {
      setError(res.error);
    }
  };
  return (
    <div className="text-white flex gap-4 h-full flex-col items-center justify-center">
      <div className="flex items-start flex-col gap-6">
        <div>
          <div className="p-2">Title</div>
          <input
            type="title"
            placeholder="Title"
            name="title"
            id="title"
            onChange={(e) => {
              setTitle(e.target.value);
            }}
            className="bg-white w-fit py-1 px-2 rounded-xl hover:bg-slate-200 text-black"
          />
        </div>
        <Collapsible
          label={"Select Frequency:"}
          options={["daily", "weekly"]}
          defaultValue={"daily"}
          onChange={handleFreq1}
        />
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
          defaultValue={"Other"}
          onChange={handleFreq2}
        />
        <div className="flex items-center justify-center w-full">
          <button
            className="bg-green-500 px-4 py-1 font-bold rounded-lg hover:bg-green-600"
            onClick={onSubmit}
          >
            Create Habit
          </button>
        </div>
        <div>
          {error && <div className="text-sm my-2 text-red-600">{error}</div>}
        </div>
        {/* <form onSubmit={onSubmit}> */}
        {/* <label htmlFor="title" className="text-white"></label> */}
        {/* </form> */}
      </div>
    </div>
  );
};

export default CreateHabit;
