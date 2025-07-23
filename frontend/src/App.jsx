import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import SessionDetail from './pages/SessionDetail';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/sessions/:id" element={<SessionDetail />} />

        {/* Add more routes here */}
      </Routes>
    </Router>
  );
}

export default App;




