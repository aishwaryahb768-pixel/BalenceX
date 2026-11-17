import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import ContributionsSettings from '../components/ContributionsSettings';

const Settings = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-200">
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <button 
                onClick={() => navigate(-1)} 
                className="p-2 mr-2 text-gray-400 rounded-full hover:text-gray-600 hover:bg-gray-100 transition-colors"
                title="Go back"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <span className="text-xl font-bold text-gray-900">Settings</span>
            </div>
            <span className="text-2xl font-bold text-indigo-600">BalenceX</span>
          </div>
        </div>
      </nav>

      <main className="px-4 py-8 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <ContributionsSettings />
      </main>
    </div>
  );
};

export default Settings;
