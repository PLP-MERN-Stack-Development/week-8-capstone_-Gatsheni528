
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard.jsx';
import SessionDetail from './pages/SessionDetail.jsx';
import { AuthProvider, useAuth } from './context/AuthContext'; // Adjust path if needed

function AppRoutes() {
  const { currentUser } = useAuth(); // valid inside a component

  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route
        path="/sessions/:id"
        element={<SessionDetail currentUser={currentUser} />}
      />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}

export default App;
