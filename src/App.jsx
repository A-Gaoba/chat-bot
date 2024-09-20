import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import QueryPage from "./pages/QueryPage";
// import AskAIComponent from "./components/AskAIComponent";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/query" element={<QueryPage />} />
      </Routes>
    </Router>
  );
};

export default App;
