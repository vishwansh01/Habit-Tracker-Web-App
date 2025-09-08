// import { useState } from "react";
import "./App.css";
import Hero from "./components/Hero";
import { Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import Dashboard from "./pages/Dashboard";
import CreateHabit from "./pages/CreateHabit";

function App() {
  // const [count, setCount] = useState(0);

  return (
    <div className="w-screen h-screen bg-[linear-gradient(to_bottom,hsl(220,65%,5%)_0%,hsl(220,65%,3.52%)_50%,hsl(220,65%,10%)_100%)]">
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/create" element={<CreateHabit />} />
      </Routes>
    </div>
  );
}

export default App;
