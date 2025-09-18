import React from "react";

const FilterFeed = ({ activity }) => {
  return (
    <div
      key={activity.id}
      className="w-full m-2 text-slate-400 border-y px-2 py-1"
    >
      <div className="font-semibold">{activity.user.email} </div>
      <div className="font-semibold">Type: {activity.type}</div>
      <div>
        <div className="">
          Date :{" "}
          {activity.date
            ? activity.date.split("T")[0]
            : activity.createdAt.split("T")[0]}
        </div>
        {activity.habit && <div>Category: {activity.habit.category}</div>}
        {activity.streak && <div>Streak : {activity.streak}</div>}
      </div>
    </div>
  );
};

export default FilterFeed;
