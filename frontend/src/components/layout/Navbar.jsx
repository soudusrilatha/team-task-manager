import React, { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { LogOut, User } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);

  return (
    <nav className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between shadow-sm">
      <div className="flex items-center space-x-4">
        <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
          Team Task Manager
        </h1>
      </div>
      <div className="flex items-center space-x-6">
        <div className="flex items-center space-x-2 text-gray-600">
          <User size={18} />
          <span className="font-medium text-sm">{user?.name} ({user?.role})</span>
        </div>
        <button
          onClick={logout}
          className="flex items-center space-x-1 text-gray-500 hover:text-red-600 transition-colors"
        >
          <LogOut size={18} />
          <span className="text-sm font-medium">Logout</span>
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
