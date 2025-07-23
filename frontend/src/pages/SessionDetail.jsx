import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import ChatBox from '../components/ChatBox';
import axios from 'axios';

const SessionDetail = () => {
  const { id } = useParams();
  const [session, setSession] = useState(null);

  useEffect(() => {
    const fetchSession = async () => {
      const res = await axios.get(`/api/sessions/${id}`);
      setSession(res.data);
    };
    fetchSession();
  }, [id]);

  if (!session) return <div className="p-4">Loading...</div>;

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">{session.title}</h1>
      <p className="text-gray-600">{session.description}</p>
      <hr />
      <ChatBox sessionId={id} />
    </div>
  );
};

export default SessionDetail;
