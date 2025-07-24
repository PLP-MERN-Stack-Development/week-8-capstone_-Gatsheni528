import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import SessionDetail from './pages/SessionDetail';
import ChatBox from './components/ChatBox';

const mockUser = {
  _id: '12345',
  username: 'JohnDoe'
  // You can later replace this with real auth logic
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/sessions/:id"
          element={<SessionDetail currentUser={mockUser} />}
        />
        <Route
          path="/chat/:sessionId"
          element={<ChatBox sessionId="global" currentUser={mockUser} />}
        />
      </Routes>
    </Router>
  );
}

export default App;
