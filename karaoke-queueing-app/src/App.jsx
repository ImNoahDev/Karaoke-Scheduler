import React, { useState, useEffect } from 'react';
import axios from 'axios';

const App = () => {
  const [queue, setQueue] = useState([]);
  const [name, setName] = useState('');
  const [time, setTime] = useState('');
  const [song, setSong] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    fetchQueue();
  }, []);

  const fetchQueue = async () => {
    const response = await axios.get('http://localhost:3001/api/queue');
    setQueue(response.data.data);
  };

  const addToQueue = async () => {
    await axios.post('http://localhost:3001/api/queue', { name, time, song });
    fetchQueue();
  };

  const removeFromQueue = async (id) => {
    await axios.delete(`http://localhost:3001/api/queue/${id}`);
    fetchQueue();
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between">
        <h1 className="text-2xl font-bold">Karaoke Queue</h1>
        <button onClick={() => setIsAdmin(!isAdmin)} className="bg-blue-500 text-white px-4 py-2 rounded">
          {isAdmin ? 'Switch to User View' : 'Switch to Admin View'}
        </button>
      </div>

      <div className="mt-4">
        {isAdmin ? (
          <AdminDashboard queue={queue} removeFromQueue={removeFromQueue} />
        ) : (
          <UserDashboard
            name={name}
            setName={setName}
            time={time}
            setTime={setTime}
            song={song}
            setSong={setSong}
            addToQueue={addToQueue}
          />
        )}
      </div>
    </div>
  );
};

const AdminDashboard = ({ queue, removeFromQueue }) => (
  <div>
    <h2 className="text-xl font-bold">Admin Dashboard</h2>
    <ul className="mt-4">
      {queue.map((item) => (
        <li key={item.id} className="flex justify-between py-2">
          <span>
            {item.name} - {item.time} - {item.song}
          </span>
          <button onClick={() => removeFromQueue(item.id)} className="bg-red-500 text-white px-2 py-1 rounded">
            Remove
          </button>
        </li>
      ))}
    </ul>
  </div>
);

const UserDashboard = ({ name, setName, time, setTime, song, setSong, addToQueue }) => (
  <div>
    <h2 className="text-xl font-bold">User Dashboard</h2>
    <div className="mt-4">
      <div className="mb-2">
        <label className="block">Name:</label>
        <input value={name} onChange={(e) => setName(e.target.value)} className="border p-2 rounded w-full" />
      </div>
      <div className="mb-2">
        <label className="block">Time:</label>
        <input value={time} onChange={(e) => setTime(e.target.value)} className="border p-2 rounded w-full" />
      </div>
      <div className="mb-2">
        <label className="block">Song:</label>
        <input value={song} onChange={(e) => setSong(e.target.value)} className="border p-2 rounded w-full" />
      </div>
      <button onClick={addToQueue} className="bg-green-500 text-white px-4 py-2 rounded">
        Add to Queue
      </button>
    </div>
  </div>
);

export default App;
