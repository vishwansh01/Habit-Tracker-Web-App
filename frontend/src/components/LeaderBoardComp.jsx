import React from "react";

const LeaderBoardComp = ({ activity }) => {
  return (
    <div
      key={activity.id}
      className="w-full m-2 text-slate-400 border-y px-2 py-1"
    >
      <div className="font-semibold">{activity.user.email} </div>
      <div>{activity.streak && <div>Streak : {activity.streak}</div>}</div>
    </div>
  );
};

export default LeaderBoardComp;
