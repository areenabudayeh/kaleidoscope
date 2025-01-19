import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Page1 from "./Page1";
import Page2 from './Page2';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Page1 />} />
        <Route path="/board" element={<Page2 />} /> 
      </Routes>
    </Router>
  );
};

ReactDOM.createRoot(document.getElementById("dualite-root")).render(<App />);
