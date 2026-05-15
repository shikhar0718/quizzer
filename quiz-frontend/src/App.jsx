import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Teacher from "./pages/Teacher";
import Student from "./pages/Student";
import Quiz from "./pages/Quiz";

function App() {
  return (
    <div className="min-h-screen bg-black text-white">

      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/teacher" element={<Teacher />} />
          <Route path="/student" element={<Student />} />
          <Route path="/quiz" element={<Quiz />} />
      </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;