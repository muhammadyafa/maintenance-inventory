import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Filter, 
  Plus, 
  Minus, 
  Package, 
  AlertTriangle, 
  Activity,
  LogOut,
  X,
  Save,
  Wrench,
  Zap,
  Box
} from 'lucide-react';
import { INITIAL_ITEMS } from '../constants';
import { InventoryItem, TransactionType, TransactionLog } from '../types';

interface DashboardProps {
  onLogout: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onLogout }) => {
  // State
  const [items, setItems] = useState<InventoryItem[]>(INITIAL_ITEMS);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'ALL' | 'REORDER'>('ALL');
  const [transactions, setTransactions] = useState<TransactionLog[]>([]);
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const [transactionType, setTransactionType] = useState<TransactionType>('IN');
  const [transactionAmount, setTransactionAmount] = useState<string>('');

  // Derived State (Statistics)
  const stats = useMemo(() => {
    const totalSKU = items.length;
    const reorderCount = items.filter(i => i.stock <= i.minStock).length;
    const today = new Date().toDateString();
    const todayTransactions = transactions.filter(t => t.timestamp.toDateString() === today).length;
    
    return { totalSKU, reorderCount, todayTransactions };
  }, [items, transactions]);

  // Derived State (Filtered Items)
  const filteredItems = useMemo(() => {
    return items.filter(item => {
      const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           item.id.toLowerCase().includes(searchQuery.toLowerCase());
      const isReorder = item.stock <= item.minStock;
      
      if (filterStatus === 'REORDER' && !isReorder) return false;
      return matchesSearch;
    });
  }, [items, searchQuery, filterStatus]);

  // Handlers
  const handleOpenModal = (item: InventoryItem, type: TransactionType) => {
    setSelectedItem(item);
    setTransactionType(type);
    setTransactionAmount('');
    setIsModalOpen(true);
  };

  const handleTransactionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedItem || !transactionAmount) return;

    const amount = parseInt(transactionAmount);
    if (isNaN(amount) || amount <= 0) return;

    const newStock = transactionType === 'IN' 
      ? selectedItem.stock + amount 
      : selectedItem.stock - amount;

    if (newStock < 0) {
      alert("Error: Stock cannot be negative!");
      return;
    }

    // Update Item Stock
    const updatedItems = items.map(item => 
      item.id === selectedItem.id 
        ? { ...item, stock: newStock, lastUpdated: new Date() } 
        : item
    );
    setItems(updatedItems);

    // Add Transaction Log
    const newTransaction: TransactionLog = {
      id: Math.random().toString(36).substr(2, 9),
      itemId: selectedItem.id,
      itemName: selectedItem.name,
      type: transactionType,
      amount: amount,
      timestamp: new Date()
    };
    setTransactions(prev => [newTransaction, ...prev]);

    setIsModalOpen(false);
  };

  const getCategoryIcon = (cat: string) => {
    switch (cat) {
      case 'Mechanic': return <Wrench className="w-4 h-4 text-blue-500" />;
      case 'Electric': return <Zap className="w-4 h-4 text-yellow-500" />;
      case 'Tools': return <Box className="w-4 h-4 text-purple-500" />;
      default: return <Package className="w-4 h-4 text-gray-500" />;
    }
  };

  return (
    <div className="min-h-screen bg-industrial-50 flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-industrial-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-industrial-900 p-2 rounded-lg">
              <Package className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-industrial-900 leading-none">Stock Control</h1>
              <p className="text-xs text-industrial-500 font-medium">Factory Maintenance Div.</p>
            </div>
          </div>
          <button 
            onClick={onLogout}
            className="flex items-center text-sm font-medium text-industrial-600 hover:text-red-600 transition-colors"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </button>
        </div>
      </header>

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-industrial-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-industrial-500">Total SKU</p>
                <p className="text-3xl font-bold text-industrial-900 mt-1">{stats.totalSKU}</p>
              </div>
              <div className="bg-blue-50 p-3 rounded-full">
                <Package className="w-6 h-6 text-blue-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-xs text-industrial-400">
              <span className="text-green-600 font-medium mr-1">Active</span> database record
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-industrial-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-industrial-500">Items to Reorder</p>
                <p className={`text-3xl font-bold mt-1 ${stats.reorderCount > 0 ? 'text-red-600' : 'text-industrial-900'}`}>
                  {stats.reorderCount}
                </p>
              </div>
              <div className={`p-3 rounded-full ${stats.reorderCount > 0 ? 'bg-red-50' : 'bg-green-50'}`}>
                {stats.reorderCount > 0 ? (
                  <AlertTriangle className="w-6 h-6 text-red-600" />
                ) : (
                  <Activity className="w-6 h-6 text-green-600" />
                )}
              </div>
            </div>
            <div className="mt-4 flex items-center text-xs text-industrial-400">
              {stats.reorderCount > 0 
                ? <span className="text-red-600 font-medium mr-1">Attention needed</span>
                : <span className="text-green-600 font-medium mr-1">All stocks healthy</span>
              }
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-industrial-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-industrial-500">Today's Transactions</p>
                <p className="text-3xl font-bold text-industrial-900 mt-1">{stats.todayTransactions}</p>
              </div>
              <div className="bg-purple-50 p-3 rounded-full">
                <Activity className="w-6 h-6 text-purple-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-xs text-industrial-400">
              <span className="text-purple-600 font-medium mr-1">Real-time</span> updates
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div className="relative flex-1 max-w-lg">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-industrial-400" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="block w-full pl-10 pr-3 py-2.5 border border-industrial-300 rounded-lg leading-5 bg-white placeholder-industrial-400 focus:outline-none focus:placeholder-industrial-300 focus:ring-1 focus:ring-industrial-500 focus:border-industrial-500 sm:text-sm shadow-sm transition-all"
              placeholder="Search by Part Name or ID..."
            />
          </div>
          
          <div className="flex items-center gap-2">
            <div className="bg-white rounded-lg p-1 border border-industrial-300 flex">
              <button
                onClick={() => setFilterStatus('ALL')}
                className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${
                  filterStatus === 'ALL' 
                    ? 'bg-industrial-100 text-industrial-900 shadow-sm' 
                    : 'text-industrial-500 hover:text-industrial-700'
                }`}
              >
                All Items
              </button>
              <button
                onClick={() => setFilterStatus('REORDER')}
                className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all flex items-center ${
                  filterStatus === 'REORDER' 
                    ? 'bg-red-50 text-red-700 shadow-sm' 
                    : 'text-industrial-500 hover:text-industrial-700'
                }`}
              >
                <AlertTriangle className="w-3 h-3 mr-1.5" />
                Reorder Only
              </button>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white shadow-sm rounded-xl border border-industrial-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-industrial-200">
              <thead className="bg-industrial-50">
                <tr>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-industrial-500 uppercase tracking-wider">Part Info</th>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-industrial-500 uppercase tracking-wider">Category</th>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-industrial-500 uppercase tracking-wider">Stock Level</th>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-industrial-500 uppercase tracking-wider">Status</th>
                  <th scope="col" className="px-6 py-4 text-right text-xs font-semibold text-industrial-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-industrial-200">
                {filteredItems.length > 0 ? (
                  filteredItems.map((item) => {
                    const isReorder = item.stock <= item.minStock;
                    return (
                      <tr key={item.id} className="hover:bg-industrial-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10 bg-industrial-100 rounded-lg flex items-center justify-center text-industrial-600 font-bold text-xs">
                              {item.id.split('-')[0]}
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-bold text-industrial-900">{item.name}</div>
                              <div className="text-xs text-industrial-500 font-mono">ID: {item.id}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center text-sm text-industrial-700">
                            {getCategoryIcon(item.category)}
                            <span className="ml-2">{item.category}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-bold text-industrial-900">
                            {item.stock} <span className="text-xs font-normal text-industrial-500">{item.unit}</span>
                          </div>
                          <div className="text-xs text-industrial-400">Min: {item.minStock}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {isReorder ? (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 border border-red-200 animate-pulse">
                              ⚠️ REORDER
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200">
                              ✅ AMAN
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex items-center justify-end space-x-2">
                            <button
                              onClick={() => handleOpenModal(item, 'IN')}
                              className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded text-emerald-700 bg-emerald-100 hover:bg-emerald-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-colors"
                            >
                              <Plus className="w-3 h-3 mr-1" />
                              Incoming
                            </button>
                            <button
                              onClick={() => handleOpenModal(item, 'OUT')}
                              className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded text-amber-700 bg-amber-100 hover:bg-amber-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 transition-colors"
                            >
                              <Minus className="w-3 h-3 mr-1" />
                              Outgoing
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-industrial-500">
                      <div className="flex flex-col items-center justify-center">
                        <Search className="w-12 h-12 text-industrial-300 mb-3" />
                        <p className="text-base font-medium">No items found</p>
                        <p className="text-sm">Try adjusting your search or filter</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Transaction Modal */}
      {isModalOpen && selectedItem && (
        <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            {/* Background overlay */}
            <div 
              className="fixed inset-0 bg-industrial-900 bg-opacity-75 transition-opacity" 
              aria-hidden="true"
              onClick={() => setIsModalOpen(false)}
            ></div>

            {/* Modal panel */}
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className={`mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full sm:mx-0 sm:h-10 sm:w-10 ${
                    transactionType === 'IN' ? 'bg-emerald-100' : 'bg-amber-100'
                  }`}>
                    {transactionType === 'IN' 
                      ? <Plus className={`h-6 w-6 text-emerald-600`} />
                      : <Minus className={`h-6 w-6 text-amber-600`} />
                    }
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                    <h3 className="text-lg leading-6 font-medium text-industrial-900" id="modal-title">
                      {transactionType === 'IN' ? 'Incoming Stock' : 'Outgoing Stock'}
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-industrial-500 mb-4">
                        Update stock for <span className="font-bold text-industrial-800">{selectedItem.name}</span>.
                        <br/>Current Stock: {selectedItem.stock} {selectedItem.unit}
                      </p>
                      
                      <form onSubmit={handleTransactionSubmit}>
                        <label className="block text-sm font-medium text-industrial-700 mb-1">
                          Quantity ({selectedItem.unit})
                        </label>
                        <input
                          type="number"
                          min="1"
                          autoFocus
                          value={transactionAmount}
                          onChange={(e) => setTransactionAmount(e.target.value)}
                          className="shadow-sm focus:ring-industrial-500 focus:border-industrial-500 block w-full sm:text-sm border-industrial-300 rounded-md p-2 border"
                          placeholder="0"
                        />
                      </form>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-industrial-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  onClick={handleTransactionSubmit}
                  disabled={!transactionAmount}
                  className={`w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 text-base font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm ${
                    !transactionAmount 
                      ? 'bg-industrial-300 cursor-not-allowed' 
                      : transactionType === 'IN' 
                        ? 'bg-emerald-600 hover:bg-emerald-700 focus:ring-emerald-500' 
                        : 'bg-amber-600 hover:bg-amber-700 focus:ring-amber-500'
                  }`}
                >
                  <Save className="w-4 h-4 mr-2" />
                  Confirm
                </button>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-industrial-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-industrial-700 hover:bg-industrial-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-industrial-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
