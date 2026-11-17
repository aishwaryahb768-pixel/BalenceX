import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { Store, Phone, Lock, User, MapPin } from 'lucide-react';

const Register = () => {
  const [formData, setFormData] = useState({
    phone_number: '',
    store_name: '',
    address: '',
    store_id: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      const res = await axios.post('http://localhost:5000/api/owner/register', formData);
      setSuccess('Store registered successfully! Redirecting to login...');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <div className="w-full max-w-md p-8 bg-white rounded-2xl shadow-xl">
        <h2 className="mb-2 text-3xl font-bold text-center text-gray-800">Register Store</h2>
        <p className="mb-8 text-center text-gray-500">Create your owner account</p>

        {error && <div className="p-3 mb-6 text-sm text-red-500 bg-red-50 rounded-lg">{error}</div>}
        {success && <div className="p-3 mb-6 text-sm text-green-500 bg-green-50 rounded-lg">{success}</div>}

        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">Phone Number</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Phone className="w-5 h-5 text-gray-400" />
              </div>
              <input
                type="tel"
                name="phone_number"
                className="w-full py-2 pl-10 pr-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="Unique phone number"
                value={formData.phone_number}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">Store Name</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Store className="w-5 h-5 text-gray-400" />
              </div>
              <input
                type="text"
                name="store_name"
                className="w-full py-2 pl-10 pr-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="Enter store name"
                value={formData.store_name}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">Address</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <MapPin className="w-5 h-5 text-gray-400" />
              </div>
              <input
                type="text"
                name="address"
                className="w-full py-2 pl-10 pr-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="Store address"
                value={formData.address}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">Store ID (Unique)</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <User className="w-5 h-5 text-gray-400" />
              </div>
              <input
                type="text"
                name="store_id"
                className="w-full py-2 pl-10 pr-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="Create a unique store ID"
                value={formData.store_id}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">Password</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Lock className="w-5 h-5 text-gray-400" />
              </div>
              <input
                type="password"
                name="password"
                className="w-full py-2 pl-10 pr-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 font-semibold text-white transition-all bg-indigo-600 rounded-lg hover:bg-indigo-700 active:scale-95"
          >
            Register Store
          </button>
        </form>

        <p className="mt-6 text-sm text-center text-gray-500">
          Already have an account?{' '}
          <Link to="/login" className="font-semibold text-indigo-600 hover:text-indigo-500">
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
