import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import WeatherPage from "./pages/WeatherPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/:adm4" element={<WeatherPage />} />
      </Routes>
    </Router>
  );
}

export default App;
