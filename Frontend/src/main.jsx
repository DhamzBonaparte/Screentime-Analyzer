import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import Analyzer from "./Components/Analyzer.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Analyzer />
  </StrictMode>,
);
