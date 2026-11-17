import React, { useState, useEffect } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import axios from 'axios';
import { LogOut, Store, Phone, CreditCard, ChevronRight } from 'lucide-react';

const CustomerDashboard = () => {
  const [customer, setCustomer] = useState(null);
  const [stores, setStores] = useState([]);
  const [selectedStore, setSelectedStore] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const storedCustomer = localStorage.getItem('customer');
    if (!storedCustomer) {
      setLoading(false);
      navigate('/login');
      return;
    }

    try {
      const customerData = JSON.parse(storedCustomer);
      setCustomer(customerData);
      fetchDashboard(customerData.phone_number).finally(() => setLoading(false));
    } catch (err) {
      localStorage.removeItem('customer');
      setLoading(false);
      navigate('/login');
    }
  }, [navigate]);

  const fetchDashboard = async (phone_number) => {
    try {
      const res = await axios.get(`http://localhost:5000/api/customer/dashboard/${phone_number}`);
      setStores(res.data.stores);
      if (res.data.stores.length > 0) {
        setSelectedStore(res.data.stores[0]);
      }
      setError('');
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || 'Error fetching dashboard. Is the backend running?';
      setError(errorMsg);
      console.error('Error fetching dashboard', err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('customer');
    navigate('/login');
  };

  if (!customer) {
    if (loading) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="w-12 h-12 mx-auto mb-4 border-4 border-indigo-200 rounded-full border-t-indigo-600 animate-spin"></div>
            <p className="text-gray-600">Loading dashboard...</p>
          </div>
        </div>
      );
    }
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-white border-b border-gray-200">
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <span className="text-2xl font-bold text-indigo-600">BalenceX</span>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right mr-4">
                <p className="text-sm font-medium text-gray-900">{customer.phone_number}</p>
                <p className="text-xs text-gray-500">Customer</p>
              </div>
              <button
                onClick={() => navigate('/settings')}
                className="p-2 text-gray-400 rounded-full hover:text-gray-500 hover:bg-gray-100"
                title="Settings"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-settings"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>
              </button>
              <button
                onClick={handleLogout}
                className="p-2 text-gray-400 rounded-full hover:text-gray-500 hover:bg-gray-100"
                title="Logout"
              >
                <LogOut className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {error && (
        <div className="px-4 py-4 mx-auto max-w-7xl sm:px-6 lg:px-8 mt-4">
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-800"><strong>Error:</strong> {error}</p>
            <p className="text-red-700 text-sm mt-2">Make sure the backend server is running on port 5000:</p>
            <code className="text-red-600 text-sm block mt-1">cd backend && npm start</code>
          </div>
        </div>
      )}

      <main className="px-4 py-8 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {/* Store List */}
          <div className="md:col-span-1 space-y-4">
            <h3 className="text-lg font-bold text-gray-800 px-1">Your Linked Stores</h3>
            {stores.length > 0 ? (
              stores.map(store => (
                <button
                  key={store.store_id}
                  onClick={() => setSelectedStore(store)}
                  className={`w-full p-4 text-left transition-all border-2 rounded-xl flex justify-between items-center ${selectedStore?.store_id === store.store_id ? 'bg-indigo-50 border-indigo-600 shadow-sm' : 'bg-white border-transparent hover:bg-gray-100 shadow-sm'}`}
                >
                  <div>
                    <h4 className="font-bold text-gray-900">{store.store_name}</h4>
                    <p className="text-xs text-gray-500">ID: {store.store_id}</p>
                  </div>
                  <ChevronRight className={`w-5 h-5 ${selectedStore?.store_id === store.store_id ? 'text-indigo-600' : 'text-gray-300'}`} />
                </button>
              ))
            ) : (
              <p className="p-4 bg-white rounded-xl text-center text-gray-500 text-sm">No stores linked to your phone.</p>
            )}
          </div>

          {/* Transaction Details */}
          <div className="md:col-span-2 space-y-6">
            {selectedStore ? (
              <>
                <div className="p-8 bg-gradient-to-br from-indigo-600 to-indigo-800 rounded-2xl shadow-xl text-white">
                  <div className="flex justify-between items-start mb-8">
                    <div>
                      <h3 className="text-2xl font-bold">{selectedStore.store_name}</h3>
                      <div className="flex items-center mt-2 text-indigo-100">
                        <Phone className="w-4 h-4 mr-2" />
                        <span className="text-sm">Owner: {selectedStore.owner_phone}</span>
                      </div>
                    </div>
                    <CreditCard className="w-10 h-10 text-indigo-200" />
                  </div>
                  <div>
                    <p className="text-indigo-200 text-sm uppercase font-bold tracking-wider">Remaining Balance</p>
                    <h2 className="text-4xl font-black mt-1">${selectedStore.balance.toFixed(2)}</h2>
                  </div>
                </div>

                <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-100">
                  <h4 className="mb-6 text-xl font-bold text-gray-800">Transaction History</h4>
                  <div className="space-y-4">
                    {selectedStore.transactions.length > 0 ? (
                      selectedStore.transactions.map(t => (
                        <div key={t.transaction_id} className="flex justify-between p-4 bg-gray-50 rounded-lg border border-gray-100 transition-all hover:shadow-sm">
                          <div>
                            <p className="font-bold text-gray-900">{t.product_name}</p>
                            <p className="text-xs text-gray-500">{new Date(t.date_time).toLocaleString()}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-red-600">${t.amount.toFixed(2)}</p>
                            <p className="text-xs text-gray-400">Paid by balance</p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="py-8 text-center text-gray-500 italic">No transactions found for this store.</p>
                    )}
                  </div>
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center h-64 bg-white rounded-xl border border-dashed border-gray-300 text-gray-400">
                <Store className="w-12 h-12 mb-4 opacity-20" />
                <p>Select a store to view your balance and transactions.</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default CustomerDashboard;
