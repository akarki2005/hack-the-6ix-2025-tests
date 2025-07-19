import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

export default function Completed() {
  const [completedTasks, setCompletedTasks] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const saved = localStorage.getItem('completedTasks');
    if (saved) {
      setCompletedTasks(JSON.parse(saved));
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Completed Tasks</h1>
          <button
            onClick={() => router.push('/')}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Back
          </button>
        </div>
        
        <div>
          <h2 className="text-lg font-semibold mb-3 text-gray-700">Completed ({completedTasks.length})</h2>
          {completedTasks.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No completed tasks yet.</p>
          ) : (
            <ul className="space-y-2">
              {completedTasks.map((task) => (
                <li key={task.id} className="p-3 bg-green-50 rounded-md border-l-4 border-green-500">
                  <span className="text-gray-800 line-through">{task.text}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}