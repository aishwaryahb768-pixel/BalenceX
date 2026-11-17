import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { Store, User, Phone, Lock } from 'lucide-react';

const Login = () => {
  const [role, setRole] = useState('owner'); // 'owner' or 'customer'
  const [formData, setFormData] = useState({
    store_id: '',
    password: '',
    phone_number: ''
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    try {
      if (role === 'owner') {
        const res = await axios.post('http://localhost:5000/api/owner/login', {
          store_id: formData.store_id,
          password: formData.password
        });
        localStorage.setItem('owner', JSON.stringify(res.data.owner));
        navigate('/owner/dashboard');
      } else {
        const res = await axios.post('http://localhost:5000/api/customer/login', {
          phone_number: formData.phone_number
        });
        localStorage.setItem('customer', JSON.stringify(res.data.customer));
        navigate('/customer/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <div className="w-full max-w-md p-8 bg-white rounded-2xl shadow-xl">
        <div className="flex justify-center mb-6">
          <div className="p-3 bg-indigo-100 rounded-full">
            <Store className="w-8 h-8 text-indigo-600" />
          </div>
        </div>
        <h2 className="mb-2 text-3xl font-bold text-center text-gray-800">BalenceX</h2>
        <p className="mb-8 text-center text-gray-500">Track balances with ease</p>

        <div className="flex p-1 mb-8 bg-gray-100 rounded-lg">
          <button
            className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${role === 'owner' ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
            onClick={() => setRole('owner')}
          >
            Store Owner
          </button>
          <button
            className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${role === 'customer' ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
            onClick={() => setRole('customer')}
          >
            Customer
          </button>
        </div>

        {error && <div className="p-3 mb-6 text-sm text-red-500 bg-red-50 rounded-lg">{error}</div>}

        <form onSubmit={handleLogin} className="space-y-4">
          {role === 'owner' ? (
            <>
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">Store ID</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <Store className="w-5 h-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    name="store_id"
                    className="w-full py-2 pl-10 pr-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="Enter your store ID"
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
            </>
          ) : (
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
                  placeholder="Enter registered phone number"
                  value={formData.phone_number}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            className="w-full py-3 font-semibold text-white transition-all bg-indigo-600 rounded-lg hover:bg-indigo-700 active:scale-95"
          >
            Login
          </button>
        </form>

        {role === 'owner' && (
          <p className="mt-6 text-sm text-center text-gray-500">
            Don't have a store?{' '}
            <Link to="/register" className="font-semibold text-indigo-600 hover:text-indigo-500">
              Register here
            </Link>
          </p>
        )}
      </div>
    </div>
  );
};

export default Login;
