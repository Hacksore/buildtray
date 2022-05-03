import { Route, Routes } from "react-router-dom";
import Dashboard from "./containers/Dashboard";
import SignIn from "./containers/SignIn";
import { Tray } from "./containers/Tray";

export default function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<h2>Main landing page</h2>} />
        <Route path="/login" element={<SignIn />} />
        <Route path="/tray" element={<Tray />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </>
  );
}
