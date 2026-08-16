import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import LineOne from "./pages/LineOne.jsx";
import PreAssembly from "./pages/PreAssembly.jsx";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/linha-1" element={<LineOne />} />

        <Route path="/pre-montagem" element={<PreAssembly />} />

        <Route
          path="*"
          element={<Navigate to="/linha-1" replace />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;