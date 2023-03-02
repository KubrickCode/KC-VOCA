import Signin from "./Signin";
import Signup from "./Signup";
import { Route, Routes } from "react-router-dom";

const Sign = () => {
  return (
    <Routes>
      <Route path="/" element={<Signin />} />
      <Route path="/signup" element={<Signup />} />
    </Routes>
  );
};

export default Sign;
