import { Box } from "@mui/material";
import { Route, Routes } from "react-router-dom";
import Header from "./components/Header";
import Dashboard from "./containers/Dashboard";
import Home from "./containers/Home";
import SignIn from "./containers/SignIn";
import { Tray } from "./containers/Tray";

export default function App() {
  return (
    <Box>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<SignIn />} />
        <Route path="/tray" element={<Tray />} />
        <Route path="/dashboard/:tab" element={<Dashboard />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </Box>
  );
}
