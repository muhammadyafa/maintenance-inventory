import React, { useState } from 'react';
import { Lock, ArrowRight, ShieldCheck } from 'lucide-react';
import { PASSWORD_SECRET } from '../constants';

interface LoginProps {
  onLogin: () => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === PASSWORD_SECRET) {
      onLogin();
    } else {
      setError('Access Denied: Incorrect Password');
      setPassword('');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-industrial-900 to-industrial-800 p-4">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden">
        <div className="bg-industrial-100 p-8 text-center border-b border-industrial-200">
          <div className="mx-auto w-16 h-16 bg-industrial-900 rounded-full flex items-center justify-center mb-4 shadow-lg">
            <ShieldCheck className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-industrial-900">System Access</h1>
          <p className="text-industrial-500 text-sm mt-1">Inventory Maintenance Control</p>
        </div>
        
        <div className="p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-industrial-700 mb-2">
                Security Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-industrial-400" />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError('');
                  }}
                  className="block w-full pl-10 pr-3 py-3 border border-industrial-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-industrial-500 focus:border-transparent transition-all"
                  placeholder="Enter access code..."
                />
              </div>
              {error && (
                <p className="mt-2 text-sm text-red-600 font-medium animate-pulse">
                  {error}
                </p>
              )}
            </div>

            <button
              type="submit"
              className="w-full flex items-center justify-center px-4 py-3 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-industrial-900 hover:bg-industrial-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-industrial-500 transition-colors"
            >
              Access Dashboard
              <ArrowRight className="ml-2 h-4 w-4" />
            </button>
          </form>
          
          <div className="mt-6 text-center">
            <span className="text-xs text-industrial-400">Authorized Personnel Only • Secure Session</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
