import React, { useState, useEffect } from 'react';
import { logGateAccess, getAllLogs } from '../firebase/firebaseOperations';

const LogManagement = () => {
  const [carId, setCarId] = useState('');
  const [status, setStatus] = useState('');
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const logsData = await getAllLogs();
        setLogs(logsData);
      } catch (error) {
        console.error('Error fetching logs: ', error);
      }
    };

    fetchLogs();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await logGateAccess(carId, status);
    const updatedLogs = await getAllLogs();
    setLogs(updatedLogs);
    setCarId('');
    setStatus('');
  };

  return (
    <div className="max-w-4xl mx-auto bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
      <div className="max-w-md mx-auto mb-8">
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">Car ID:</label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              type="text"
              value={carId}
              onChange={(e) => setCarId(e.target.value)}
              required
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2">Status:</label>
            <select
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              required
            >
              <option value="">Select Status</option>
              <option value="Authorized">Authorized</option>
              <option value="Unauthorized">Unauthorized</option>
            </select>
          </div>
          <div className="flex items-center justify-between">
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="submit"
            >
              Log Gate Access
            </button>
          </div>
        </form>
      </div>

      <div className="overflow-x-auto">
        <h2 className="text-2xl font-bold mb-4">All Logs</h2>
        <table className="min-w-full bg-white">
          <thead>
            <tr className="bg-gray-100">
              <th className="border text-left px-8 py-2">Log ID</th>
              <th className="border text-left px-8 py-2">Car ID</th>
              <th className="border text-left px-8 py-2">Status</th>
              {/* Add more headers as per your log data structure */}
            </tr>
          </thead>
          <tbody>
            {logs.map(log => (
              <tr key={log.id}>
                <td className="border px-8 py-2">{log.id}</td>
                <td className="border px-8 py-2">{log.carId}</td>
                <td className="border px-8 py-2">{log.status}</td>
                {/* Render additional fields here */}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LogManagement;
