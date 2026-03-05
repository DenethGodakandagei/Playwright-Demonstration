import React, { useEffect, useState } from 'react';
import { Link, Route, Routes, useNavigate } from 'react-router-dom';

const API = 'http://localhost:5000/api/tasks';

function TaskManager() {
  const navigate = useNavigate();

  const [tasks, setTasks] = useState([]);
  const [error, setError] = useState(null);
  const [newTaskText, setNewTaskText] = useState('');
  const [loading, setLoading] = useState(false);
  const [adding, setAdding] = useState(false);

  // Per-task state: { [id]: { editing: bool, value: string, saving: bool, deleting: bool } }
  const [taskState, setTaskState] = useState({});

  const fetchTasks = () => {
    setLoading(true);
    fetch(API)
      .then(res => { if (!res.ok) throw new Error("Server Error!"); return res.json(); })
      .then(data => { setTasks(data); setError(null); })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchTasks(); }, []);

  // ── ADD ──────────────────────────────────────────────
  const handleAddTask = async (e) => {
    e.preventDefault();
    if (!newTaskText.trim()) return;
    setAdding(true);
    try {
      const res = await fetch(API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: newTaskText.trim() }),
      });
      if (!res.ok) throw new Error("Failed to add task");
      const created = await res.json();
      setTasks(prev => [...prev, created]);
      setNewTaskText('');
    } catch (err) {
      setError(err.message);
    } finally {
      setAdding(false);
    }
  };

  // ── EDIT HELPERS ─────────────────────────────────────
  const startEdit = (task) => {
    setTaskState(prev => ({
      ...prev,
      [task._id]: { editing: true, value: task.text, saving: false, deleting: false }
    }));
  };

  const cancelEdit = (id) => {
    setTaskState(prev => ({ ...prev, [id]: { ...prev[id], editing: false } }));
  };

  const setEditValue = (id, value) => {
    setTaskState(prev => ({ ...prev, [id]: { ...prev[id], value } }));
  };

  // ── UPDATE ────────────────────────────────────────────
  const handleUpdate = async (id) => {
    const val = taskState[id]?.value?.trim();
    if (!val) return;
    setTaskState(prev => ({ ...prev, [id]: { ...prev[id], saving: true } }));
    try {
      const res = await fetch(`${API}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: val }),
      });
      if (!res.ok) throw new Error("Failed to update task");
      const updated = await res.json();
      setTasks(prev => prev.map(t => t._id === id ? updated : t));
      setTaskState(prev => ({ ...prev, [id]: { editing: false, value: '', saving: false, deleting: false } }));
    } catch (err) {
      setError(err.message);
      setTaskState(prev => ({ ...prev, [id]: { ...prev[id], saving: false } }));
    }
  };

  // ── DELETE ────────────────────────────────────────────
  const handleDelete = async (id) => {
    setTaskState(prev => ({ ...prev, [id]: { ...prev[id], deleting: true } }));
    try {
      const res = await fetch(`${API}/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error("Failed to delete task");
      setTasks(prev => prev.filter(t => t._id !== id));
    } catch (err) {
      setError(err.message);
      setTaskState(prev => ({ ...prev, [id]: { ...prev[id], deleting: false } }));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex flex-col items-center py-16 px-4">

      {/* Header */}
      <div className="w-full max-w-lg mb-8">
        <div className="flex items-center justify-between gap-4">
          <div className="text-left">
            <h1 className="text-4xl font-extrabold text-indigo-700 tracking-tight">Task Manager</h1>
            <p className="mt-2 text-gray-500 text-sm">Powered by MongoDB Atlas · Full CRUD</p>
          </div>

          <button
            type="button"
            onClick={() => navigate('/login')}
            className="inline-flex items-center justify-center h-10 px-4 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold transition-colors"
          >
            Login
          </button>
        </div>
      </div>

      {/* Card */}
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl p-8">

        {/* Add Task Form */}
        <form onSubmit={handleAddTask} className="flex gap-3 mb-8">
          <input
            type="text"
            value={newTaskText}
            onChange={e => setNewTaskText(e.target.value)}
            placeholder="Enter a new task..."
            className="flex-1 border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition"
          />
          <button
            type="submit"
            disabled={adding || !newTaskText.trim()}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300 text-white px-5 py-2 rounded-lg text-sm font-semibold active:scale-95 transition-all shadow"
          >
            {adding ? (
              <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
              </svg>
            ) : (
              <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
            )}
            Add Task
          </button>
        </form>

        {/* Error Banner */}
        {error && (
          <div className="error-banner mb-6 bg-red-50 border-l-4 border-red-400 p-4 rounded-md flex items-start gap-3">
            <svg className="h-5 w-5 text-red-400 mt-0.5 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <p className="text-sm text-red-700 font-medium">{error}</p>
          </div>
        )}

        {/* Task List */}
        <div className="task-list-container space-y-3">
          {loading ? (
            <p className="text-center text-gray-400 italic py-6 animate-pulse">Loading tasks...</p>
          ) : tasks.length === 0 ? (
            <div className="text-center py-10">
              <svg className="h-12 w-12 mx-auto text-gray-300 mb-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <p className="text-gray-400 text-sm">No tasks yet. Add your first one!</p>
            </div>
          ) : (
            tasks.map((task, index) => {
              const ts = taskState[task._id] || {};
              return (
                <div
                  key={task._id}
                  className="task-item flex items-center gap-3 bg-indigo-50 border border-indigo-100 rounded-xl px-4 py-3 hover:shadow-md transition-shadow"
                >
                  {/* Number badge */}
                  <span className="flex-shrink-0 w-7 h-7 rounded-full bg-indigo-100 text-indigo-600 text-xs font-bold flex items-center justify-center">
                    {index + 1}
                  </span>

                  {/* Text or Edit Input */}
                  {ts.editing ? (
                    <input
                      type="text"
                      value={ts.value}
                      onChange={e => setEditValue(task._id, e.target.value)}
                      onKeyDown={e => { if (e.key === 'Enter') handleUpdate(task._id); if (e.key === 'Escape') cancelEdit(task._id); }}
                      className="flex-1 border border-indigo-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white"
                      autoFocus
                    />
                  ) : (
                    <span className="flex-1 text-gray-800 font-medium text-sm break-words">{task.text}</span>
                  )}

                  {/* Action Buttons */}
                  <div className="flex items-center gap-2 flex-shrink-0">
                    {ts.editing ? (
                      <>
                        {/* Save */}
                        <button
                          onClick={() => handleUpdate(task._id)}
                          disabled={ts.saving}
                          title="Save"
                          className="flex items-center justify-center w-8 h-8 rounded-lg bg-green-500 hover:bg-green-600 disabled:bg-green-300 text-white transition-colors"
                        >
                          {ts.saving ? (
                            <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                            </svg>
                          ) : (
                            <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                        </button>
                        {/* Cancel */}
                        <button
                          onClick={() => cancelEdit(task._id)}
                          title="Cancel"
                          className="flex items-center justify-center w-8 h-8 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-600 transition-colors"
                        >
                          <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </>
                    ) : (
                      <>
                        {/* Edit */}
                        <button
                          onClick={() => startEdit(task)}
                          title="Edit"
                          className="flex items-center justify-center w-8 h-8 rounded-lg bg-amber-100 hover:bg-amber-200 text-amber-600 transition-colors"
                        >
                          <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        {/* Delete */}
                        <button
                          onClick={() => handleDelete(task._id)}
                          disabled={ts.deleting}
                          title="Delete"
                          className="flex items-center justify-center w-8 h-8 rounded-lg bg-red-100 hover:bg-red-200 disabled:bg-red-50 text-red-500 transition-colors"
                        >
                          {ts.deleting ? (
                            <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                            </svg>
                          ) : (
                            <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          )}
                        </button>
                      </>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Task Count */}
        {tasks.length > 0 && (
          <p className="mt-6 text-right text-xs text-gray-400 font-medium">
            {tasks.length} task{tasks.length !== 1 ? 's' : ''} total
          </p>
        )}

      </div>
    </div>
  );
}

function Login() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const onSubmit = (e) => {
    e.preventDefault();
    if (username === 'admin' && password === 'password123') {
      setError('');
      navigate('/dashboard');
      return;
    }
    setError('Invalid username or password');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex flex-col items-center py-16 px-4">
      <div className="w-full max-w-lg mb-8">
        <div className="flex items-center justify-between gap-4">
          <div className="text-left">
            <h1 className="text-4xl font-extrabold text-indigo-700 tracking-tight">Login</h1>
            <p className="mt-2 text-gray-500 text-sm">Use your credentials to continue</p>
          </div>
          <Link
            to="/"
            className="inline-flex items-center justify-center h-10 px-4 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold transition-colors"
          >
            Home
          </Link>
        </div>
      </div>

      <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl p-8">
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">Username</label>
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Username"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition"
            />
          </div>

          {error && (
            <div className="error-message bg-red-50 border-l-4 border-red-400 p-4 rounded-md">
              <p className="text-sm text-red-700 font-medium">{error}</p>
            </div>
          )}

          <button
            type="submit"
            className="w-full h-10 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold transition-colors"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}

function Dashboard() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex flex-col items-center py-16 px-4">
      <div className="w-full max-w-lg mb-8">
        <div className="flex items-center justify-between gap-4">
          <div className="text-left">
            <h1 className="text-4xl font-extrabold text-indigo-700 tracking-tight">Dashboard</h1>
            <p className="mt-2 text-gray-500 text-sm">You are logged in</p>
          </div>
          <Link
            to="/"
            className="inline-flex items-center justify-center h-10 px-4 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold transition-colors"
          >
            Task Manager
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<TaskManager />} />
      <Route path="/login" element={<Login />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="*" element={<TaskManager />} />
    </Routes>
  );
}
