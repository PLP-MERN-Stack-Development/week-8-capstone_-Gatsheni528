import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard.jsx';
import SessionDetail from './pages/SessionDetail';

const { currentUser } = useAuth(); // wrap App in AuthProvider if not already

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route
          path="/sessions/:id"
          element={<SessionDetail currentUser={mockUser} />}
        />
      </Routes>
    </Router>
  );
}

export default App;
