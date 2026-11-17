import React, { useState, useEffect } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import axios from 'axios';
import { LogOut, UserPlus, List, CreditCard, Plus, ArrowRight } from 'lucide-react';

const OwnerDashboard = () => {
  const [owner, setOwner] = useState(null);
  const [customers, setCustomers] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [newCustomerPhone, setNewCustomerPhone] = useState('');
  const [newCustomerName, setNewCustomerName] = useState('');
  const [transactionForm, setTransactionForm] = useState({
    product_name: '',
    amount: ''
  });
  const [showAddCustomer, setShowAddCustomer] = useState(false);
  const [showRecordPurchase, setShowRecordPurchase] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const storedOwner = localStorage.getItem('owner');
    if (!storedOwner) {
      setLoading(false);
      return;
    }

    try {
      const ownerData = JSON.parse(storedOwner);
      setOwner(ownerData);
      fetchCustomers(ownerData.store_id).finally(() => setLoading(false));
    } catch (err) {
      localStorage.removeItem('owner');
      setLoading(false);
    }
  }, [navigate]);

  const fetchCustomers = async (store_id) => {
    try {
      const res = await axios.get(`http://localhost:5000/api/customer/${store_id}`);
      const parsedCustomers = res.data.map((customer) => ({
        ...customer,
        balance: Number(customer.balance) || 0
      }));
      setCustomers(parsedCustomers);
      setError('');
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || 'Error fetching customers. Is the backend running?';
      setError(errorMsg);
      console.error('Error fetching customers', err);
    }
  };

  const fetchTransactions = async (customer_id) => {
    try {
      const res = await axios.get(`http://localhost:5000/api/transaction/${customer_id}?store_id=${owner.store_id}`);
      const parsedTransactions = res.data.map((transaction) => ({
        ...transaction,
        amount: Number(transaction.amount) || 0
      }));
      setTransactions(parsedTransactions);
    } catch (err) {
      console.error('Error fetching transactions', err);
    }
  };

  const handleAddCustomer = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/customer/add', {
        phone_number: newCustomerPhone,
        customer_name: newCustomerName,
        store_id: owner.store_id
      });
      setNewCustomerPhone('');
      setNewCustomerName('');
      setShowAddCustomer(false);
      fetchCustomers(owner.store_id);
    } catch (err) {
      alert(err.response?.data?.message || 'Error adding customer');
    }
  };

  const handleRecordPurchase = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/transaction/add', {
        customer_id: selectedCustomer.customer_id,
        store_id: owner.store_id,
        product_name: transactionForm.product_name,
        amount: transactionForm.amount
      });
      setTransactionForm({ product_name: '', amount: '' });
      setShowRecordPurchase(false);
      fetchCustomers(owner.store_id); // Update balances
      fetchTransactions(selectedCustomer.customer_id); // Update history
    } catch (err) {
      alert(err.response?.data?.message || 'Error recording purchase');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('owner');
    navigate('/login');
  };

  if (!owner) {
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
                <p className="text-sm font-medium text-gray-900">{owner.store_name}</p>
                <p className="text-xs text-gray-500">{owner.store_id}</p>
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
          {/* Sidebar / Stats */}
          <div className="md:col-span-1 space-y-6">
            <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-100">
              <h3 className="mb-4 text-lg font-semibold text-gray-800">Quick Actions</h3>
              <div className="space-y-3">
                <button
                  onClick={() => setShowAddCustomer(!showAddCustomer)}
                  className="flex items-center w-full p-3 text-sm font-medium text-indigo-700 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-colors"
                >
                  <UserPlus className="w-5 h-5 mr-3" />
                  Add Customer
                </button>
                {showAddCustomer && (
                  <form onSubmit={handleAddCustomer} className="mt-3 space-y-2">
                    <input
                      type="text"
                      placeholder="Customer Name"
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                      value={newCustomerName}
                      onChange={(e) => setNewCustomerName(e.target.value)}
                      required
                    />
                    <input
                      type="tel"
                      placeholder="Customer Phone Number"
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                      value={newCustomerPhone}
                      onChange={(e) => setNewCustomerPhone(e.target.value)}
                      required
                    />
                    <div className="flex space-x-2">
                      <button type="submit" className="flex-1 py-2 text-xs font-bold text-white bg-indigo-600 rounded-lg">Add</button>
                      <button type="button" onClick={() => setShowAddCustomer(false)} className="flex-1 py-2 text-xs font-bold text-gray-600 bg-gray-100 rounded-lg">Cancel</button>
                    </div>
                  </form>
                )}
              </div>
            </div>

            <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-100">
              <h3 className="mb-4 text-lg font-semibold text-gray-800">Store Summary</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-500">Total Customers</span>
                  <span className="font-bold text-gray-900">{customers.length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-500">Total Balance</span>
                  <span className="font-bold text-indigo-600">
                    ${customers.reduce((acc, c) => acc + c.balance, 0).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content - Customer List */}
          <div className="md:col-span-2 space-y-6">
            <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-100">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-gray-800">Customer List</h3>
                <List className="text-gray-400 w-5 h-5" />
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-gray-100">
                      <th className="pb-3 font-semibold text-gray-600">Customer Name</th>
                      <th className="pb-3 font-semibold text-gray-600">Phone Number</th>
                      <th className="pb-3 font-semibold text-gray-600">Balance</th>
                      <th className="pb-3 font-semibold text-gray-600">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {customers.length > 0 ? customers.map(customer => (
                      <tr key={customer.customer_id} className="hover:bg-gray-50 transition-colors">
                        <td className="py-4 font-bold text-gray-900">{customer.customer_name || 'N/A'}</td>
                        <td className="py-4 font-medium text-gray-500">{customer.phone_number}</td>
                        <td className="py-4">
                          <span className={`px-3 py-1 text-sm font-bold rounded-full ${customer.balance > 0 ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>
                            ${customer.balance.toFixed(2)}
                          </span>
                        </td>
                        <td className="py-4">
                          <button
                            onClick={() => {
                              setSelectedCustomer(customer);
                              fetchTransactions(customer.customer_id);
                            }}
                            className="text-indigo-600 hover:text-indigo-800 font-semibold text-sm"
                          >
                            View Details
                          </button>
                        </td>
                      </tr>
                    )) : (
                      <tr>
                        <td colSpan="3" className="py-8 text-center text-gray-500">No customers added yet.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Selected Customer Details */}
            {selectedCustomer && (
              <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-100">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h3 className="text-xl font-bold text-gray-800">{selectedCustomer.customer_name || 'Customer Details'}</h3>
                    <p className="text-sm text-gray-500">{selectedCustomer.phone_number}</p>
                  </div>
                  <button
                    onClick={() => setShowRecordPurchase(true)}
                    className="flex items-center px-4 py-2 text-sm font-bold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Record Purchase
                  </button>
                </div>

                {showRecordPurchase && (
                  <div className="p-4 mb-6 bg-indigo-50 rounded-xl border border-indigo-100">
                    <form onSubmit={handleRecordPurchase} className="grid grid-cols-1 gap-4 sm:grid-cols-3 items-end">
                      <div>
                        <label className="block mb-1 text-xs font-bold text-indigo-700 uppercase">Product</label>
                        <input
                          type="text"
                          className="w-full px-3 py-2 text-sm border border-indigo-200 rounded-lg focus:ring-2 focus:ring-indigo-500"
                          value={transactionForm.product_name}
                          onChange={(e) => setTransactionForm({ ...transactionForm, product_name: e.target.value })}
                          required
                        />
                      </div>
                      <div>
                        <label className="block mb-1 text-xs font-bold text-indigo-700 uppercase">Amount</label>
                        <input
                          type="number"
                          step="0.01"
                          className="w-full px-3 py-2 text-sm border border-indigo-200 rounded-lg focus:ring-2 focus:ring-indigo-500"
                          value={transactionForm.amount}
                          onChange={(e) => setTransactionForm({ ...transactionForm, amount: e.target.value })}
                          required
                        />
                      </div>
                      <div className="flex space-x-2">
                        <button type="submit" className="flex-1 py-2 text-sm font-bold text-white bg-indigo-600 rounded-lg">Save</button>
                        <button type="button" onClick={() => setShowRecordPurchase(false)} className="flex-1 py-2 text-sm font-bold text-gray-600 bg-white border border-gray-200 rounded-lg">Cancel</button>
                      </div>
                    </form>
                  </div>
                )}

                <h4 className="mb-4 font-bold text-gray-700">Transaction History</h4>
                <div className="space-y-3">
                  {transactions.length > 0 ? transactions.map(t => (
                    <div key={t.transaction_id} className="flex justify-between p-4 bg-gray-50 rounded-lg border border-gray-100">
                      <div>
                        <p className="font-bold text-gray-900">{t.product_name}</p>
                        <p className="text-xs text-gray-500">{new Date(t.date_time).toLocaleString()}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-red-600">${t.amount.toFixed(2)}</p>
                      </div>
                    </div>
                  )) : (
                    <p className="py-4 text-center text-gray-500 text-sm">No transactions yet.</p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default OwnerDashboard;
