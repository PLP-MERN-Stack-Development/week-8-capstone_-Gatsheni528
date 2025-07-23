import { useEffect, useState } from 'react';
import { fetchSessions, joinSession } from '../services/api';

export default function Dashboard() {
  const [sessions, setSessions] = useState([]);

  useEffect(() => {
    fetchSessions().then(res => setSessions(res.data));
  }, []);

  const handleJoin = (id) => {
    joinSession(id).then(() => alert("Joined session!"));
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Available Skill Sessions</h1>
      {sessions.map((session) => (
        <div key={session._id} className="border p-4 rounded mb-3">
          <h2 className="text-xl">{session.title}</h2>
          <p>{session.description}</p>
          <button onClick={() => handleJoin(session._id)} className="btn-primary mt-2">Join</button>
        </div>
      ))}
    </div>
  );
}
