import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const API_URL = 'http://localhost:5000/api';

function App() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Fetch tasks from backend
  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/tasks`);
      setTasks(response.data);
      setError('');
    } catch (err) {
      setError('Failed to fetch tasks');
      console.error('Error fetching tasks:', err);
    } finally {
      setLoading(false);
    }
  };

  const addTask = async (e) => {
    e.preventDefault();
    if (!newTask.trim()) return;

    try {
      setLoading(true);
      const response = await axios.post(`${API_URL}/tasks`, {
        title: newTask,
        completed: false
      });
      setTasks([...tasks, response.data]);
      setNewTask('');
      setError('');
    } catch (err) {
      setError('Failed to add task');
      console.error('Error adding task:', err);
    } finally {
      setLoading(false);
    }
  };

  const toggleTask = async (id) => {
    try {
      const task = tasks.find(t => t._id === id);
      const response = await axios.put(`${API_URL}/tasks/${id}`, {
        ...task,
        completed: !task.completed
      });
      setTasks(tasks.map(t => t._id === id ? response.data : t));
    } catch (err) {
      setError('Failed to update task');
      console.error('Error updating task:', err);
    }
  };

  const deleteTask = async (id) => {
    try {
      await axios.delete(`${API_URL}/tasks/${id}`);
      setTasks(tasks.filter(t => t._id !== id));
    } catch (err) {
      setError('Failed to delete task');
      console.error('Error deleting task:', err);
    }
  };

  const filteredTasks = tasks.filter(task => {
    if (filter === 'active') return !task.completed;
    if (filter === 'completed') return task.completed;
    return true;
  });

  const taskStats = {
    total: tasks.length,
    active: tasks.filter(t => !t.completed).length,
    completed: tasks.filter(t => t.completed).length
  };

  return (
    <div className="App">
      <header className="header">
        <h1>🚀 Task Manager Pro</h1>
        <p>Manage your tasks with Docker-powered efficiency</p>
      </header>

      <main className="main">
        {error && <div className="error">{error}</div>}
        
        {/* Task Stats */}
        <div className="stats">
          <div className="stat">
            <span className="stat-number">{taskStats.total}</span>
            <span className="stat-label">Total</span>
          </div>
          <div className="stat">
            <span className="stat-number">{taskStats.active}</span>
            <span className="stat-label">Active</span>
          </div>
          <div className="stat">
            <span className="stat-number">{taskStats.completed}</span>
            <span className="stat-label">Completed</span>
          </div>
        </div>

        {/* Add Task Form */}
        <form onSubmit={addTask} className="add-task-form">
          <input
            type="text"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            placeholder="Add a new task..."
            className="task-input"
            disabled={loading}
          />
          <button type="submit" disabled={loading || !newTask.trim()}>
            {loading ? '⏳' : '➕'} Add Task
          </button>
        </form>

        {/* Filter Buttons */}
        <div className="filters">
          <button 
            className={filter === 'all' ? 'active' : ''}
            onClick={() => setFilter('all')}
          >
            All
          </button>
          <button 
            className={filter === 'active' ? 'active' : ''}
            onClick={() => setFilter('active')}
          >
            Active
          </button>
          <button 
            className={filter === 'completed' ? 'active' : ''}
            onClick={() => setFilter('completed')}
          >
            Completed
          </button>
        </div>

        {/* Task List */}
        <div className="task-list">
          {loading && tasks.length === 0 ? (
            <div className="loading">Loading tasks...</div>
          ) : filteredTasks.length === 0 ? (
            <div className="empty">
              {filter === 'all' ? 'No tasks yet. Add one above!' : `No ${filter} tasks.`}
            </div>
          ) : (
            filteredTasks.map(task => (
              <div key={task._id} className={`task-item ${task.completed ? 'completed' : ''}`}>
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => toggleTask(task._id)}
                  className="task-checkbox"
                />
                <span className="task-title">{task.title}</span>
                <button 
                  onClick={() => deleteTask(task._id)}
                  className="delete-btn"
                  title="Delete task"
                >
                  🗑️
                </button>
              </div>
            ))
          )}
        </div>
      </main>

      <footer className="footer">
        <p>💡 Built with React + Node.js + Docker</p>
        <p>🐳 Containerized for consistent deployment</p>
      </footer>
    </div>
  );
}

export default App;