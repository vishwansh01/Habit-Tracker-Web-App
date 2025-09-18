import React from "react";
import Collapsible from "./Collapsible";

const Edit = ({ habit, title, setTitle, handleFreq1, handleFreq2 }) => {
  return (
    <div className=" flex gap-4 flex-col">
      <div className="flex flex-col items-start">
        <label htmlFor="title" className="font-semibold text-lg m-4">
          Title
        </label>
        <input
          id="title"
          name="title"
          type="title"
          className=" bg-white text-black py-1 px-2 rounded-lg"
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
          }}
        />
      </div>
      {/* <div>
            <label htmlFor="title" className=" m-4">
              Title
            </label>
            <input
              id="title"
              name="title"
              type="title"
              className="w bg-white text-black"
              value={habit.title}
              onChange={() => {}}
            />
          </div> */}
      {/* <div>
            <label htmlFor="title" className=" m-4">
              Title
            </label>
            <input
              id="title"
              name="title"
              type="title"
              className="w bg-white text-black"
              value={habit.title}
              onChange={() => {}}
            />
          </div> */}
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
        defaultValue={`${habit.category}`}
        onChange={handleFreq2}
      />
      <Collapsible
        label={"Select Frequency:"}
        options={["daily", "weekly"]}
        defaultValue={`${habit.frequency}`}
        onChange={handleFreq1}
      />
    </div>
  );
};

export default Edit;
