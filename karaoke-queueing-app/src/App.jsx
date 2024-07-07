import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { format, isBefore } from 'date-fns';

const App = () => {
  const [queue, setQueue] = useState([]);
  const [names, setNames] = useState(['']);
  const [time, setTime] = useState('');
  const [song, setSong] = useState('');
  const [instrument, setInstrument] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    fetchQueue();
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const fetchQueue = async () => {
    const response = await axios.get('http://localhost:3001/api/queue');
    const sortedQueue = response.data.data.sort((a, b) => {
      return new Date(`1970-01-01T${a.time}`) - new Date(`1970-01-01T${b.time}`);
    });
    setQueue(sortedQueue);
  };

  const addToQueue = async () => {
    const nameString = names.join(', ');
    await axios.post('http://localhost:3001/api/queue', { names, time, song, instrument });
    fetchQueue();
    setNames(['']);
    setTime('');
    setSong('');
    setInstrument('');
  };

  const removeFromQueue = async (id) => {
    await axios.delete(`http://localhost:3001/api/queue/${id}`);
    fetchQueue();
  };

  const addNameField = () => {
    setNames([...names, '']);
  };

  const removeNameField = (index) => {
    const updatedNames = names.filter((_, i) => i !== index);
    setNames(updatedNames);
  };

  const handleNameChange = (index, value) => {
    const updatedNames = [...names];
    updatedNames[index] = value;
    setNames(updatedNames);
  };

  const isTimePassed = (queueTime) => {
    const [hours, minutes] = queueTime.split(':');
    const queueDateTime = new Date();
    queueDateTime.setHours(hours, minutes, 0, 0);
    return isBefore(queueDateTime, currentTime);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <div className="container mx-auto">
        <div className="flex justify-between items-center bg-white p-4 rounded shadow-md mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Karaoke Queue</h1>
          <div className="flex items-center">
            <div className="mr-4 text-gray-600">{format(currentTime, 'HH:mm:ss')}</div>
            <button
              onClick={() => setIsAdmin(!isAdmin)}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition duration-200"
            >
              {isAdmin ? 'Switch to User View' : 'Switch to Admin View'}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white p-4 rounded shadow-md">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Queue</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border border-gray-200 rounded-md">
                <thead>
                  <tr>
                    <th className="py-3 px-4 border-b">Name(s)</th>
                    <th className="py-3 px-4 border-b">Song</th>
                    <th className="py-3 px-4 border-b">Time</th>
                    <th className="py-3 px-4 border-b">Instrument</th>
                    {isAdmin && <th className="py-3 px-4 border-b">Actions</th>}
                  </tr>
                </thead>
                <tbody>
                  {queue.map((item) => (
                    <tr key={item.id} className={isTimePassed(item.time) ? 'line-through text-gray-500' : ''}>
                      <td className="py-3 px-4 border-b">{item.names.join(', ')}</td>
                      <td className="py-3 px-4 border-b">{item.song}</td>
                      <td className="py-3 px-4 border-b">{item.time}</td>
                      <td className="py-3 px-4 border-b">{item.instrument}</td>
                      {isAdmin && (
                        <td className="py-3 px-4 border-b">
                          <button
                            onClick={() => removeFromQueue(item.id)}
                            className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded transition duration-200"
                          >
                            Remove
                          </button>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-white p-4 rounded shadow-md">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Add to Queue</h2>
            <div>
              {names.map((name, index) => (
                <div className="mb-4" key={index}>
                  <label className="block text-gray-700">Name:</label>
                  <div className="flex items-center">
                    <input
                      value={name}
                      onChange={(e) => handleNameChange(index, e.target.value)}
                      className="border border-gray-300 p-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500 mr-2"
                    />
                    {names.length > 1 && (
                      <button
                        onClick={() => removeNameField(index)}
                        className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded transition duration-200"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                </div>
              ))}
              <button
                onClick={addNameField}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition duration-200 mb-4 w-full"
              >
                Add Another Name
              </button>
              <div className="mb-4">
                <label className="block text-gray-700">Time:</label>
                <input
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="border border-gray-300 p-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                  type="time"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Song:</label>
                <input
                  value={song}
                  onChange={(e) => setSong(e.target.value)}
                  className="border border-gray-300 p-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Instrument (if not singing):</label>
                <input
                  value={instrument}
                  onChange={(e) => setInstrument(e.target.value)}
                  className="border border-gray-300 p-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <button
                onClick={addToQueue}
                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded transition duration-200 w-full"
              >
                Add to Queue
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
