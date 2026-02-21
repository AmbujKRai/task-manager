import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

export default function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [form, setForm] = useState({ title: '', description: '', status: 'pending' });
  const [editingTask, setEditingTask] = useState(null);
  const [message, setMessage] = useState({ text: '', type: '' });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    if (!localStorage.getItem('token')) return navigate('/login');
    fetchTasks();
  }, []);

  const showMessage = (text, type = 'success') => {
    setMessage({ text, type });
    setTimeout(() => setMessage({ text: '', type: '' }), 3000);
  };

  const fetchTasks = async () => {
    try {
      const res = await api.get('/tasks');
      setTasks(res.data.data);
    } catch {
      showMessage('Failed to load tasks', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingTask) {
        await api.put(`/tasks/${editingTask.id}`, form);
        showMessage('Task updated!');
        setEditingTask(null);
      } else {
        await api.post('/tasks', form);
        showMessage('Task created!');
      }
      setForm({ title: '', description: '', status: 'pending' });
      fetchTasks();
    } catch (err) {
      showMessage(err.response?.data?.message || 'Something went wrong', 'error');
    }
  };

  const handleEdit = (task) => {
    setEditingTask(task);
    setForm({ title: task.title, description: task.description || '', status: task.status });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this task?')) return;
    try {
      await api.delete(`/tasks/${id}`);
      showMessage('Task deleted');
      fetchTasks();
    } catch {
      showMessage('Delete failed', 'error');
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const statusColor = { pending: '#f59e0b', 'in-progress': '#3b82f6', done: '#10b981' };

  return (
    <div style={{ fontFamily: 'sans-serif', minHeight: '100vh', background: '#f0f2f5' }}>
      {/* Navbar */}
      <div style={{ background: '#4f46e5', padding: '14px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ color: 'white', margin: 0 }}>📋 Task Manager</h2>
        <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
          <span style={{ color: 'white' }}>👤 {user.name} ({user.role})</span>
          <button onClick={handleLogout} style={{ padding: '8px 16px', background: 'white', color: '#4f46e5', border: 'none', borderRadius: 8, cursor: 'pointer' }}>
            Logout
          </button>
        </div>
      </div>

      <div style={{ maxWidth: 900, margin: '32px auto', padding: '0 16px' }}>
        {/* Message */}
        {message.text && (
          <div style={{ padding: 12, borderRadius: 8, marginBottom: 16,
            background: message.type === 'error' ? '#fee2e2' : '#d1fae5',
            color: message.type === 'error' ? '#dc2626' : '#065f46' }}>
            {message.text}
          </div>
        )}

        {/* Task Form */}
        <div style={{ background: 'white', padding: 24, borderRadius: 12, marginBottom: 24, boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
          <h3 style={{ marginTop: 0 }}>{editingTask ? '✏️ Edit Task' : '➕ New Task'}</h3>
          <form onSubmit={handleSubmit} style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <input
              style={{ flex: 2, padding: '10px 14px', borderRadius: 8, border: '1px solid #ddd', fontSize: 14, minWidth: 180 }}
              placeholder="Task title *"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              required
            />
            <input
              style={{ flex: 3, padding: '10px 14px', borderRadius: 8, border: '1px solid #ddd', fontSize: 14, minWidth: 180 }}
              placeholder="Description (optional)"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
            <select
              style={{ padding: '10px 14px', borderRadius: 8, border: '1px solid #ddd', fontSize: 14 }}
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value })}
            >
              <option value="pending">Pending</option>
              <option value="in-progress">In Progress</option>
              <option value="done">Done</option>
            </select>
            <button type="submit" style={{ padding: '10px 20px', background: '#4f46e5', color: 'white', border: 'none', borderRadius: 8, cursor: 'pointer', fontSize: 14 }}>
              {editingTask ? 'Update' : 'Add Task'}
            </button>
            {editingTask && (
              <button type="button" onClick={() => { setEditingTask(null); setForm({ title: '', description: '', status: 'pending' }); }}
                style={{ padding: '10px 20px', background: '#e5e7eb', border: 'none', borderRadius: 8, cursor: 'pointer', fontSize: 14 }}>
                Cancel
              </button>
            )}
          </form>
        </div>

        {/* Task List */}
        <div style={{ background: 'white', padding: 24, borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
          <h3 style={{ marginTop: 0 }}>My Tasks ({tasks.length})</h3>
          {loading ? (
            <p>Loading tasks...</p>
          ) : tasks.length === 0 ? (
            <p style={{ color: '#6b7280' }}>No tasks yet. Create one above!</p>
          ) : (
            tasks.map((task) => (
              <div key={task.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 0', borderBottom: '1px solid #f3f4f6' }}>
                <div>
                  <p style={{ margin: 0, fontWeight: 600 }}>{task.title}</p>
                  {task.description && <p style={{ margin: '4px 0 0', fontSize: 13, color: '#6b7280' }}>{task.description}</p>}
                </div>
                <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                  <span style={{ padding: '4px 10px', borderRadius: 20, fontSize: 12, fontWeight: 600, background: statusColor[task.status] + '22', color: statusColor[task.status] }}>
                    {task.status}
                  </span>
                  <button onClick={() => handleEdit(task)} style={{ padding: '6px 12px', background: '#ede9fe', color: '#4f46e5', border: 'none', borderRadius: 6, cursor: 'pointer', fontSize: 13 }}>
                    Edit
                  </button>
                  <button onClick={() => handleDelete(task.id)} style={{ padding: '6px 12px', background: '#fee2e2', color: '#dc2626', border: 'none', borderRadius: 6, cursor: 'pointer', fontSize: 13 }}>
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}