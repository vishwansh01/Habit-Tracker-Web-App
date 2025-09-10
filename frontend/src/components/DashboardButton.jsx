import React from "react";
import { useNavigate } from "react-router-dom";

const DashboardButton = () => {
  const navigate = useNavigate();
  return (
    <button
      className="bg-blue-500  cursor-pointer hover:bg-blue-600 text-xs lg:text-xl px-2 lg:font-bold  lg:px-4 h-fit py-1 rounded-xl"
      onClick={() => {
        navigate("/dashboard");
      }}
    >
      Dashboard
    </button>
  );
};

export default DashboardButton;
