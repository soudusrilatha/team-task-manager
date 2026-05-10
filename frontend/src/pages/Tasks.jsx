import React, { useState, useEffect, useContext } from 'react';
import api from '../api/axios';
import { AuthContext } from '../context/AuthContext';
import { CheckCircle2, Circle, Clock, Plus } from 'lucide-react';

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [projects, setProjects] = useState([]);
  const [newTask, setNewTask] = useState({ title: '', description: '', status: 'Todo', dueDate: '', projectId: '' });
  const { user } = useContext(AuthContext);

  useEffect(() => {
    fetchTasks();
    if (user.role === 'ADMIN') {
      fetchProjects();
    }
  }, []);

  const fetchTasks = async () => {
    try {
      const { data } = await api.get('/tasks');
      setTasks(data);
    } catch (error) {
      console.error('Failed to fetch tasks', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchProjects = async () => {
    try {
      const { data } = await api.get('/projects');
      setProjects(data);
    } catch (error) {
      console.error('Failed to fetch projects', error);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.post('/tasks', newTask);
      setTasks([...tasks, data]);
      setShowModal(false);
      setNewTask({ title: '', description: '', status: 'Todo', dueDate: '', projectId: '' });
    } catch (error) {
      console.error('Failed to create task', error);
    }
  };

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      const { data } = await api.put(`/tasks/${taskId}`, { status: newStatus });
      setTasks(tasks.map(t => t._id === taskId ? data : t));
    } catch (error) {
      console.error('Failed to update task status', error);
    }
  };

  if (loading) return <div className="flex justify-center items-center h-full"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div></div>;

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Done': return <CheckCircle2 size={18} className="text-green-500" />;
      case 'In Progress': return <Clock size={18} className="text-yellow-500" />;
      default: return <Circle size={18} className="text-gray-400" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Tasks</h1>
        {user.role === 'ADMIN' && (
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center space-x-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors shadow-sm"
          >
            <Plus size={18} />
            <span>New Task</span>
          </button>
        )}
      </div>

      <div className="bg-white shadow-sm rounded-xl border border-gray-200 overflow-hidden">
        <ul className="divide-y divide-gray-200">
          {tasks.length === 0 ? (
            <li className="p-6 text-center text-gray-500">No tasks found.</li>
          ) : (
            tasks.map((task) => (
              <li key={task._id} className="p-4 sm:px-6 hover:bg-gray-50 transition-colors flex items-center justify-between group">
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0 cursor-pointer" onClick={() => handleStatusChange(task._id, task.status === 'Done' ? 'Todo' : 'Done')}>
                    {getStatusIcon(task.status)}
                  </div>
                  <div>
                    <p className={`text-sm font-medium ${task.status === 'Done' ? 'text-gray-400 line-through' : 'text-gray-900'}`}>
                      {task.title}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Project: {task.projectId?.name || 'Unknown'} | Due: {new Date(task.dueDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div>
                  <select
                    value={task.status}
                    onChange={(e) => handleStatusChange(task._id, e.target.value)}
                    className="text-xs border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="Todo">Todo</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Done">Done</option>
                  </select>
                </div>
              </li>
            ))
          )}
        </ul>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Create New Task</h2>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Task Title</label>
                <input
                  type="text"
                  required
                  value={newTask.title}
                  onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Project</label>
                <select
                  required
                  value={newTask.projectId}
                  onChange={(e) => setNewTask({ ...newTask, projectId: e.target.value })}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                >
                  <option value="">Select Project</option>
                  {projects.map(p => (
                    <option key={p._id} value={p._id}>{p.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Due Date</label>
                <input
                  type="date"
                  required
                  value={newTask.dueDate}
                  onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
                >
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Tasks;
