import React, { useState, useEffect } from 'react';
import { CheckCircle, Clock, AlertCircle, ListTodo } from 'lucide-react';
import api from '../api/axios';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalTasks: 0,
    completedTasks: 0,
    pendingTasks: 0,
    overdueTasks: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await api.get('/dashboard/stats');
        setStats(data);
      } catch (error) {
        console.error('Failed to fetch stats', error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <div className="flex justify-center items-center h-full"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div></div>;

  const statCards = [
    { title: 'Total Tasks', value: stats.totalTasks, icon: <ListTodo size={24} className="text-blue-500" />, bgColor: 'bg-blue-50' },
    { title: 'Completed', value: stats.completedTasks, icon: <CheckCircle size={24} className="text-green-500" />, bgColor: 'bg-green-50' },
    { title: 'Pending', value: stats.pendingTasks, icon: <Clock size={24} className="text-yellow-500" />, bgColor: 'bg-yellow-50' },
    { title: 'Overdue', value: stats.overdueTasks, icon: <AlertCircle size={24} className="text-red-500" />, bgColor: 'bg-red-50' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Dashboard Overview</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <div key={index} className="bg-white rounded-xl shadow-sm p-6 flex items-center space-x-4 border border-gray-100 hover:shadow-md transition-shadow">
            <div className={`p-3 rounded-lg ${stat.bgColor}`}>
              {stat.icon}
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">{stat.title}</p>
              <h3 className="text-2xl font-bold text-gray-900">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 mt-8">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Welcome to Team Task Manager</h2>
        <p className="text-gray-600">
          Manage your projects and tasks efficiently. Navigate through the sidebar to view projects or your assigned tasks.
        </p>
      </div>
    </div>
  );
};

export default Dashboard;
