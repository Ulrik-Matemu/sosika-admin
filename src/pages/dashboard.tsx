import { useState, useEffect } from 'react';
import {
  BarChart, LineChart, PieChart,
  Bar, Line, Pie, Cell,
  XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import {
  Users, ShoppingBag, Store, Truck, School,
  Search, Filter, ChevronDown, ChevronUp,
  RefreshCw, Download, Settings, Home
} from 'lucide-react';

export default function AdminDashboard() {
  // State for data
  interface User {
    id: number;
    full_name: string;
    email: string;
    phone_number: string;
    college_id: number;
    college_registration_number: string;
    created_at: string;
  }

  const [reviews, setReviews] = useState<Review[]>([]);
  interface Review {
    id: number;
    user_id: number;
    review_text: string;
    created_at: string;
  }

  const [users, setUsers] = useState<User[]>([]);
  interface Order {
    id: number;
    user_id: number;
    vendor_id: number;
    delivery_person_id: number;
    order_status: string;
    order_datetime: string;
    total_amount: string;
    items?: any[];
    vendor_rating?: number;
    delivery_rating?: number;
  }

  const [orders, setOrders] = useState<Order[]>([]);
  interface Vendor {
    id: number;
    name: string;
    owner_name: string;
    college_id: number;
    is_open: boolean;
  }

  const [vendors, setVendors] = useState<Vendor[]>([]);
  interface DeliveryPerson {
    id: number;
    full_name: string;
    phone_number: string;
    email?: string;
    college_id: number;
    transport_type: string;
    is_active: boolean;
    is_verified: boolean;
  }

  const [deliveryPersons, setDeliveryPersons] = useState<DeliveryPerson[]>([]);
  interface College {
    id: number;
    name: string;
    address: string;
  }

  const [colleges, setColleges] = useState<College[]>([]);

  // State for loading indicators
  const [loading, setLoading] = useState({
    users: false,
    orders: false,
    vendors: false,
    deliveryPersons: false,
    colleges: false
  });

  // State for active tab
  const [activeTab, setActiveTab] = useState('overview');

  // State for order filters
  const [orderFilters, setOrderFilters] = useState({
    user_id: '',
    vendor_id: '',
    delivery_person_id: '',
    status: '',
    from_date: '',
    to_date: ''
  });

  // State for showing filter panel
  const [showFilters, setShowFilters] = useState(false);

  // Fetch all data on component mount
  useEffect(() => {
    fetchAllData();
  }, []);

  // Function to fetch all data
  const fetchAllData = async () => {
    fetchUsers();
    fetchOrders();
    fetchVendors();
    fetchDeliveryPersons();
    fetchColleges();
    fetchReviews();
  };

  // Function to fetch users
  const fetchUsers = async () => {
    setLoading(prev => ({ ...prev, users: true }));
    try {
      const response = await fetch('https://sosika-backend.onrender.com/api/auth/users');
      if (response.ok) {
        const data = await response.json();
        setUsers(data);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(prev => ({ ...prev, users: false }));
    }
  };

  // Function to fetch review
  const fetchReviews = async () => {
    setLoading(prev => ({ ...prev, reviews: true }));
    try {
      const response = await fetch('https://sosika-backend.onrender.com/api/auth/reviews');
      if (response.ok) {
        const data = await response.json();
        setReviews(data);
      }
    }
    catch (error) {
      console.log('Error fetching reviews: ', error);
    } finally {
      setLoading(prev => ({ ...prev, reviews: true }));
    }

  }

  // Function to fetch orders with filters
  const fetchOrders = async () => {
    setLoading(prev => ({ ...prev, orders: true }));
    try {
      let url = 'https://sosika-backend.onrender.com/api/orders';

      // Add query parameters based on filters
      const params = new URLSearchParams();

      Object.entries(orderFilters).forEach(([key, value]) => {
        if (value) {
          params.append(key, value);
        }
      });

      if (params.toString()) {
        url += `?${params.toString()}`;
      }

      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        setOrders(data);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(prev => ({ ...prev, orders: false }));
    }
  };

  // Function to fetch vendors
  const fetchVendors = async () => {
    setLoading(prev => ({ ...prev, vendors: true }));
    try {
      const response = await fetch('https://sosika-backend.onrender.com/api/vendor');
      if (response.ok) {
        const data = await response.json();
        setVendors(data);
      }
    } catch (error) {
      console.error('Error fetching vendors:', error);
    } finally {
      setLoading(prev => ({ ...prev, vendors: false }));
    }
  };

  // Function to fetch delivery persons
  const fetchDeliveryPersons = async () => {
    setLoading(prev => ({ ...prev, deliveryPersons: true }));
    try {
      const response = await fetch('https://sosika-backend.onrender.com/api/deliveryPerson');
      if (response.ok) {
        const data = await response.json();
        setDeliveryPersons(data);
      }
    } catch (error) {
      console.error('Error fetching delivery persons:', error);
    } finally {
      setLoading(prev => ({ ...prev, deliveryPersons: false }));
    }
  };

  // Function to fetch colleges
  const fetchColleges = async () => {
    setLoading(prev => ({ ...prev, colleges: true }));
    try {
      const response = await fetch('https://sosika-backend.onrender.com/api/colleges');
      if (response.ok) {
        const data = await response.json();
        setColleges(data);
      }
    } catch (error) {
      console.error('Error fetching colleges:', error);
    } finally {
      setLoading(prev => ({ ...prev, colleges: false }));
    }
  };

  // Function to handle filter changes
  const handleFilterChange = (e: any) => {
    const { name, value } = e.target;
    setOrderFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Function to apply filters
  const applyFilters = () => {
    fetchOrders();
  };

  // Function to reset filters
  const resetFilters = () => {
    setOrderFilters({
      user_id: '',
      vendor_id: '',
      delivery_person_id: '',
      status: '',
      from_date: '',
      to_date: ''
    });
  };

  // Compute statistics for overview
  const statistics = {
    totalUsers: users.length,
    totalOrders: orders.length,
    totalVendors: vendors.length,
    totalDeliveryPersons: deliveryPersons.length,
    totalColleges: colleges.length,

    completedOrders: orders.filter(order => order.order_status === 'completed').length,
    pendingOrders: orders.filter(order => order.order_status === 'pending').length,
    inProgressOrders: orders.filter(order => order.order_status === 'in_progress').length,
    cancelledOrders: orders.filter(order => order.order_status === 'cancelled').length,

    totalRevenue: orders
      .filter(order => order.order_status === 'completed')
      .reduce((sum, order) => sum + parseFloat(order.total_amount), 0)
      .toFixed(2),

    avgOrderValue: orders.length > 0
      ? (orders.reduce((sum, order) => sum + parseFloat(order.total_amount), 0) / orders.length).toFixed(2)
      : '0.00',

    avgDeliveryRating: orders
      .filter(order => order.delivery_rating)
      .reduce((sum, order, _, array) => sum + (order.delivery_rating ?? 0) / array.length, 0)
      .toFixed(1),

    avgVendorRating: orders
      .filter(order => order.vendor_rating)
      .reduce((sum, order, _, array) => sum + (order.vendor_rating ?? 0) / array.length, 0)
      .toFixed(1),
  };

  // Prepare data for charts
  const orderStatusData = [
    { name: 'Completed', value: statistics.completedOrders },
    { name: 'Pending', value: statistics.pendingOrders },
    { name: 'In Progress', value: statistics.inProgressOrders },
    { name: 'Cancelled', value: statistics.cancelledOrders },
  ];

  const COLORS = ['#4ade80', '#fbbf24', '#60a5fa', '#f87171'];

  // Group orders by date for line chart
  const getOrdersByDate = () => {
    const ordersByDate: { [key: string]: number } = {};

    orders.forEach(order => {
      const date = new Date(order.order_datetime).toLocaleDateString();
      if (!ordersByDate[date]) {
        ordersByDate[date] = 0;
      }
      ordersByDate[date]++;
    });

    return Object.entries(ordersByDate)
      .map(([date, count]) => ({ date, count }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  };

  // Count users per college
  const getUsersByCollege = () => {
    interface User {
      id: number;
      full_name: string;
      email: string;
      phone_number: string;
      college_id: number;
      college_registration_number: string;
      created_at: string;
    }

    const usersByCollege: Record<number, number> = {};

    users.forEach((user: User) => {
      if (!usersByCollege[user.college_id]) {
        const college = colleges.find((c: College) => c.id === parseInt(user.college_id.toString()));
        console.log(college);
      }
      usersByCollege[user.college_id]++;
    });

    return Object.entries(usersByCollege).map(([college_id, count]) => {
      const college = colleges.find(c => c.id === parseInt(college_id));
      return {
        name: college ? college.name : `College ${college_id}`,
        count
      };
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
            <div className="flex items-center">
              <Home className="h-8 w-8 text-blue-600 mr-3" />
              <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
            </div>
            <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 sm:gap-4">
              <button
                onClick={fetchAllData}
                className="flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </button>
              <button className="flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                <Download className="h-4 w-4 mr-2" />
                Export
              </button>
              <button className="p-2 rounded-full text-gray-400 hover:text-gray-500 hover:bg-gray-100">
                <Settings className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </header>


      {/* Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex overflow-x-auto sm:overflow-visible space-x-4 sm:space-x-8 whitespace-nowrap">
            {[
              { key: 'overview', label: 'Overview' },
              { key: 'users', label: 'Users' },
              { key: 'orders', label: 'Orders' },
              { key: 'vendors', label: 'Vendors' },
              { key: 'delivery', label: 'Delivery Persons' },
              { key: 'colleges', label: 'Colleges' },
              { key: 'reviews', label: 'Reviews' }
            ].map(tab => (
              <button
                key={tab.key}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === tab.key
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                onClick={() => setActiveTab(tab.key)}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </nav>


      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Overview */}
        {activeTab === 'overview' && (
          <div>
            <h2 className="text-lg font-medium text-gray-900 mb-6">Dashboard Overview</h2>

            {/* Stats cards */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-5 mb-8">
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 bg-blue-100 rounded-md p-3">
                      <Users className="h-6 w-6 text-blue-600" />
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">Total Users</dt>
                        <dd className="flex items-baseline">
                          <div className="text-2xl font-semibold text-gray-900">{statistics.totalUsers}</div>
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 bg-green-100 rounded-md p-3">
                      <ShoppingBag className="h-6 w-6 text-green-600" />
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">Total Orders</dt>
                        <dd className="flex items-baseline">
                          <div className="text-2xl font-semibold text-gray-900">{statistics.totalOrders}</div>
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 bg-yellow-100 rounded-md p-3">
                      <Store className="h-6 w-6 text-yellow-600" />
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">Total Vendors</dt>
                        <dd className="flex items-baseline">
                          <div className="text-2xl font-semibold text-gray-900">{statistics.totalVendors}</div>
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 bg-purple-100 rounded-md p-3">
                      <Truck className="h-6 w-6 text-purple-600" />
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">Delivery Persons</dt>
                        <dd className="flex items-baseline">
                          <div className="text-2xl font-semibold text-gray-900">{statistics.totalDeliveryPersons}</div>
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 bg-indigo-100 rounded-md p-3">
                      <School className="h-6 w-6 text-indigo-600" />
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">Colleges</dt>
                        <dd className="flex items-baseline">
                          <div className="text-2xl font-semibold text-gray-900">{statistics.totalColleges}</div>
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Revenue and completion stats */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="ml-auto w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">Total Revenue</dt>
                        <dd className="flex items-baseline">
                          <div className="text-2xl font-semibold text-gray-900">${statistics.totalRevenue}</div>
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="ml-auto w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">Avg Order Value</dt>
                        <dd className="flex items-baseline">
                          <div className="text-2xl font-semibold text-gray-900">${statistics.avgOrderValue}</div>
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="ml-auto w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">Avg Delivery Rating</dt>
                        <dd className="flex items-baseline">
                          <div className="text-2xl font-semibold text-gray-900">{statistics.avgDeliveryRating}/5</div>
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="ml-auto w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">Avg Vendor Rating</dt>
                        <dd className="flex items-baseline">
                          <div className="text-2xl font-semibold text-gray-900">{statistics.avgVendorRating}/5</div>
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 mb-8">
              {/* Orders by Status */}
              <div className="bg-white shadow rounded-lg p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Orders by Status</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={orderStatusData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      >
                        {orderStatusData.map((_entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Orders Timeline */}
              <div className="bg-white shadow rounded-lg p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Orders Timeline</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={getOrdersByDate()}
                      margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="count" stroke="#3b82f6" activeDot={{ r: 8 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Users by College */}
            <div className="bg-white shadow rounded-lg p-6 mb-8">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Users by College</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={getUsersByCollege()}
                    margin={{
                      top: 5,
                      right: 30,
                      left: 20,
                      bottom: 50,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="name"
                      angle={-45}
                      textAnchor="end"
                      height={70}
                    />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill="#6366f1" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {/* Users */}
        {activeTab === 'users' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-medium text-gray-900">Users</h2>
              <div className="flex items-center space-x-2">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search users..."
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400" />
                  </div>
                </div>
              </div>
            </div>

            {/* Users table */}
            <div className="bg-white shadow overflow-hidden rounded-lg">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        ID
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Name
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Email
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Phone
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        College
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Registration #
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Created
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {loading.users ? (
                      <tr>
                        <td colSpan={7} className="px-6 py-4 text-center text-sm text-gray-500">
                          Loading users...
                        </td>
                      </tr>
                    ) : users.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="px-6 py-4 text-center text-sm text-gray-500">
                          No users found.
                        </td>
                      </tr>
                    ) : (
                      users.map(user => {
                        const college = colleges.find(c => c.id === user.college_id);
                        return (
                          <tr key={user.id}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {user.id}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              {user.full_name}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {user.email}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {user.phone_number}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {college ? college.name : `College ${user.college_id}`}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {user.college_registration_number}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {new Date(user.created_at).toLocaleString()}
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Orders */}
        {activeTab === 'orders' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-medium text-gray-900">Orders</h2>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                >
                  <Filter className="h-4 w-4 mr-2" />
                  Filters
                  {showFilters ? (
                    <ChevronUp className="h-4 w-4 ml-1" />
                  ) : (
                    <ChevronDown className="h-4 w-4 ml-1" />
                  )}
                </button>
              </div>
            </div>

            {/* Filters panel */}
            {showFilters && (
              <div className="bg-white p-4 rounded-lg shadow mb-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                  <div>
                    <label htmlFor="user_id" className="block text-sm font-medium text-gray-700 mb-1">
                      User ID
                    </label>
                    <input
                      type="text"
                      id="user_id"
                      name="user_id"
                      value={orderFilters.user_id}
                      onChange={handleFilterChange}
                      className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                  </div>
                  <div>
                    <label htmlFor="vendor_id" className="block text-sm font-medium text-gray-700 mb-1">
                      Vendor ID
                    </label>
                    <input
                      type="text"
                      id="vendor_id"
                      name="vendor_id"
                      value={orderFilters.vendor_id}
                      onChange={handleFilterChange}
                      className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                  </div>
                  <div>
                    <label htmlFor="delivery_person_id" className="block text-sm font-medium text-gray-700 mb-1">
                      Delivery Person ID
                    </label>
                    <input
                      type="text"
                      id="delivery_person_id"
                      name="delivery_person_id"
                      value={orderFilters.delivery_person_id}
                      onChange={handleFilterChange}
                      className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                  </div>
                  <div>
                    <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                      Status
                    </label>
                    <select
                      id="status"
                      name="status"
                      value={orderFilters.status}
                      onChange={handleFilterChange}
                      className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    >
                      <option value="">All</option>
                      <option value="pending">Pending</option>
                      <option value="assigned">Assigned</option>
                      <option value="vendor_confirmed">Vendor Confirmed</option>
                      <option value="in_progress">In Progress</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="from_date" className="block text-sm font-medium text-gray-700 mb-1">
                      From Date
                    </label>
                    <input
                      type="date"
                      id="from_date"
                      name="from_date"
                      value={orderFilters.from_date}
                      onChange={handleFilterChange}
                      className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                  </div>
                  <div>
                    <label htmlFor="to_date" className="block text-sm font-medium text-gray-700 mb-1">
                      To Date
                    </label>
                    <input
                      type="date"
                      id="to_date"
                      name="to_date"
                      value={orderFilters.to_date}
                      onChange={handleFilterChange}
                      className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                  </div>
                </div>
                <div className="flex justify-end space-x-2">
                  <button
                    onClick={resetFilters}
                    className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                  >
                    Reset
                  </button>
                  <button
                    onClick={applyFilters}
                    className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                  >
                    Apply Filters
                  </button>
                </div>
              </div>
            )}

            {/* Orders table */}
            <div className="bg-white shadow overflow-hidden rounded-lg">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        ID
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        User
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Vendor
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date & Time
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Amount
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Items
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Ratings
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {loading.orders ? (
                      <tr>
                        <td colSpan={8} className="px-6 py-4 text-center text-sm text-gray-500">
                          Loading orders...
                        </td>
                      </tr>
                    ) : orders.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="px-6 py-4 text-center text-sm text-gray-500">
                          No orders found.
                        </td>
                      </tr>
                    ) : (
                      orders.map(order => {
                        const user = users.find(u => u.id === order.user_id);
                        const vendor = vendors.find(v => v.id === order.vendor_id);
                        const deliveryPerson = deliveryPersons.find(d => d.id === order.delivery_person_id);
                        console.log(deliveryPerson);

                        return (
                          <tr key={order.id}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {order.id}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              {user ? user.full_name : `User #${order.user_id}`}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {vendor ? vendor.name : `Vendor #${order.vendor_id}`}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                                ${order.order_status === 'completed' ? 'bg-green-100 text-green-800' : ''}
                                ${order.order_status === 'pending' ? 'bg-yellow-100 text-yellow-800' : ''}
                                ${order.order_status === 'in_progress' ? 'bg-blue-100 text-blue-800' : ''}
                                ${order.order_status === 'cancelled' ? 'bg-red-100 text-red-800' : ''}
                                ${order.order_status === 'assigned' ? 'bg-purple-100 text-purple-800' : ''}
                                ${order.order_status === 'vendor_confirmed' ? 'bg-indigo-100 text-indigo-800' : ''}
                              `}>
                                {order.order_status.replace('_', ' ').charAt(0).toUpperCase() + order.order_status.replace('_', ' ').slice(1)}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {new Date(order.order_datetime).toLocaleString()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              ${parseFloat(order.total_amount).toFixed(2)}
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-500">
                              {order.items && Array.isArray(order.items) ? (
                                <span className="text-blue-600 cursor-pointer hover:text-blue-800">
                                  {order.items.length} items
                                </span>
                              ) : 'N/A'}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {order.vendor_rating && order.delivery_rating ? (
                                <span>
                                  V: {order.vendor_rating}/5, D: {order.delivery_rating}/5
                                </span>
                              ) : order.vendor_rating ? (
                                <span>V: {order.vendor_rating}/5</span>
                              ) : order.delivery_rating ? (
                                <span>D: {order.delivery_rating}/5</span>
                              ) : (
                                <span>Not rated</span>
                              )}
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Vendors */}
        {activeTab === 'vendors' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-medium text-gray-900">Vendors</h2>
              <div className="flex items-center space-x-2">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search vendors..."
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400" />
                  </div>
                </div>
              </div>
            </div>

            {/* Vendors table */}
            <div className="bg-white shadow overflow-hidden rounded-lg">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        ID
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Name
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Owner
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        College
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Total Orders
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Avg. Rating
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {loading.vendors ? (
                      <tr>
                        <td colSpan={7} className="px-6 py-4 text-center text-sm text-gray-500">
                          Loading vendors...
                        </td>
                      </tr>
                    ) : vendors.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="px-6 py-4 text-center text-sm text-gray-500">
                          No vendors found.
                        </td>
                      </tr>
                    ) : (
                      vendors.map(vendor => {
                        const college = colleges.find(c => c.id === vendor.college_id);
                        const vendorOrders = orders.filter(o => o.vendor_id === vendor.id);

                        // Calculate average rating
                        const ratedOrders = vendorOrders.filter(o => o.vendor_rating);
                        const avgRating = ratedOrders.length > 0
                          ? (ratedOrders.reduce((sum, o) => sum + (o.vendor_rating ?? 0), 0) / ratedOrders.length).toFixed(1)
                          : 'N/A';

                        return (
                          <tr key={vendor.id}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {vendor.id}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              {vendor.name}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {vendor.owner_name}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {college ? college.name : `College ${vendor.college_id}`}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${vendor.is_open ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                }`}>
                                {vendor.is_open ? 'Open' : 'Closed'}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {vendorOrders.length}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {avgRating === 'N/A' ? avgRating : `${avgRating}/5`}
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Delivery Persons */}
        {activeTab === 'delivery' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-medium text-gray-900">Delivery Persons</h2>
              <div className="flex items-center space-x-2">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search delivery persons..."
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400" />
                  </div>
                </div>
              </div>
            </div>

            {/* Delivery Persons table */}
            <div className="bg-white shadow overflow-hidden rounded-lg">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        ID
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Name
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Phone
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Email
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        College
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Transport
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Verification
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Avg. Rating
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {loading.deliveryPersons ? (
                      <tr>
                        <td colSpan={9} className="px-6 py-4 text-center text-sm text-gray-500">
                          Loading delivery persons...
                        </td>
                      </tr>
                    ) : deliveryPersons.length === 0 ? (
                      <tr>
                        <td colSpan={9} className="px-6 py-4 text-center text-sm text-gray-500">
                          No delivery persons found.
                        </td>
                      </tr>
                    ) : (
                      deliveryPersons.map(person => {
                        const college = colleges.find(c => c.id === person.college_id);
                        const personOrders = orders.filter(o => o.delivery_person_id === person.id);

                        // Calculate average rating
                        const ratedOrders = personOrders.filter(o => o.delivery_rating);
                        const avgRating = ratedOrders.length > 0
                          ? (ratedOrders.reduce((sum, o) => sum + (o.delivery_rating ?? 0), 0) / ratedOrders.length).toFixed(1)
                          : 'N/A';

                        return (
                          <tr key={person.id}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {person.id}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              {person.full_name}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {person.phone_number}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {person.email || 'N/A'}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {college ? college.name : `College ${person.college_id}`}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {person.transport_type.charAt(0).toUpperCase() + person.transport_type.slice(1)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${person.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                }`}>
                                {person.is_active ? 'Active' : 'Inactive'}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${person.is_verified ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                                }`}>
                                {person.is_verified ? 'Verified' : 'Pending'}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {avgRating === 'N/A' ? avgRating : `${avgRating}/5`}
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Colleges */}
        {activeTab === 'colleges' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-medium text-gray-900">Colleges</h2>
              <div className="flex items-center space-x-2">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search colleges..."
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400" />
                  </div>
                </div>
              </div>
            </div>

            {/* Colleges table */}
            <div className="bg-white shadow overflow-hidden rounded-lg">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        ID
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Name
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Address
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Users
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Vendors
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Delivery Personnel
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {loading.colleges ? (
                      <tr>
                        <td colSpan={6} className="px-6 py-4 text-center text-sm text-gray-500">
                          Loading colleges...
                        </td>
                      </tr>
                    ) : colleges.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="px-6 py-4 text-center text-sm text-gray-500">
                          No colleges found.
                        </td>
                      </tr>
                    ) : (
                      colleges.map(college => {
                        const collegeUsers = users.filter(u => u.college_id === college.id);
                        const collegeVendors = vendors.filter(v => v.college_id === college.id);
                        const collegeDeliveryPersons = deliveryPersons.filter(d => d.college_id === college.id);

                        return (
                          <tr key={college.id}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {college.id}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              {college.name}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {college.address}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {collegeUsers.length}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {collegeVendors.length}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {collegeDeliveryPersons.length}
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
        {activeTab === 'reviews' && (
          <div className="p-4">
            <h2 className="text-2xl font-bold mb-4">User Reviews</h2>
            <ul className="space-y-4">
              {reviews.map(review => (
                <li key={review.id} className="border p-4 rounded shadow-sm">
                  <p className="text-gray-700">{review.review_text}</p>
                  <p className="text-sm text-gray-400 mt-2">
                    Posted on {new Date(review.created_at).toLocaleDateString()}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        )}
      </main>
    </div>
  );
}