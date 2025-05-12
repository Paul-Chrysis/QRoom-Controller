import React, { useState, useEffect } from 'react';
import axios from '../../api/axios';
import  useAuth  from '../../hooks/useAuth';

const LogViewer = () => {
  const { auth } = useAuth();
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    taskId: '',
    interfaceType: '',
    success: '',
    deviceId: '',
    interactionType: '',
    userId: '',
    startDate: '',
    endDate: '',
  });

  const [analytics, setAnalytics] = useState({
    successfulInteractions: 0,
    failedInteractions: 0,
    successRate: 0,
    averageTimeElapsed: 0,
  });

  useEffect(() => {
    fetchLogs();
    fetchAnalytics();
  }, []);

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/v1/logs', {
        headers: {
          'Authorization': `${auth?.accessToken}`
        }
      });
      setLogs(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch logs: ' + (err.response?.data?.message || err.message));
      console.error('Error fetching logs:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchAnalytics = async () => {
    try {
      const response = await axios.get('/api/v1/logs/analytics', {
        headers: {
          'Authorization': `${auth?.accessToken}`
        }
      });
      setAnalytics(response.data);
    } catch (err) {
      console.error('Error fetching analytics:', err);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const applyFilters = async () => {
    try {
      setLoading(true);
      let url = '/api/v1/logs';
      
      // Apply filters based on what's set
      if (filters.taskId) {
        url = `/api/v1/logs/task/${filters.taskId}`;
      } else if (filters.interfaceType) {
        url = `/api/v1/logs/interface/${filters.interfaceType}`;
      } else if (filters.success !== '') {
        url = `/api/v1/logs/success/${filters.success === 'true'}`;
      } else if (filters.deviceId) {
        url = `/api/v1/logs/device/${filters.deviceId}`;
      } else if (filters.interactionType) {
        url = `/api/v1/logs/interaction/${filters.interactionType}`;
      } else if (filters.userId) {
        url = `/api/v1/logs/user/${filters.userId}`;
      } else if (filters.startDate && filters.endDate) {
        url = `/api/v1/logs/date-range?start=${encodeURIComponent(filters.startDate)}&end=${encodeURIComponent(filters.endDate)}`;
      }
      
      const response = await axios.get(url, {
        headers: {
          'Authorization': `${auth?.accessToken}`
        }
      });
      setLogs(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to apply filters: ' + (err.response?.data?.message || err.message));
      console.error('Error applying filters:', err);
    } finally {
      setLoading(false);
    }
  };

  const resetFilters = () => {
    setFilters({
      taskId: '',
      interfaceType: '',
      success: '',
      deviceId: '',
      interactionType: '',
      userId: '',
      startDate: '',
      endDate: '',
    });
    fetchLogs();
  };

  const exportToCSV = () => {
    if (logs.length === 0) return;
    
    // Create CSV content
    const headers = Object.keys(logs[0]).join(',');
    const rows = logs.map(log => Object.values(log).map(value => 
      typeof value === 'string' ? `"${value.replace(/"/g, '""')}"` : value
    ).join(','));
    const csvContent = [headers, ...rows].join('\n');
    
    // Create and download the file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `logs_export_${new Date().toISOString()}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Interaction Logs</h1>
      
      {/* Analytics Section */}
      <div className="bg-gray-100 p-4 rounded-lg mb-6">
        <h2 className="text-xl font-semibold mb-2">Analytics</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white p-3 rounded shadow">
            <p className="text-gray-500">Successful Interactions</p>
            <p className="text-2xl font-bold">{analytics.successfulInteractions}</p>
          </div>
          <div className="bg-white p-3 rounded shadow">
            <p className="text-gray-500">Failed Interactions</p>
            <p className="text-2xl font-bold">{analytics.failedInteractions}</p>
          </div>
          <div className="bg-white p-3 rounded shadow">
            <p className="text-gray-500">Success Rate</p>
            <p className="text-2xl font-bold">{(analytics.successRate * 100).toFixed(2)}%</p>
          </div>
          <div className="bg-white p-3 rounded shadow">
            <p className="text-gray-500">Avg. Time (ms)</p>
            <p className="text-2xl font-bold">{analytics.averageTimeElapsed.toFixed(2)}</p>
          </div>
        </div>
      </div>
      
      {/* Filters Section */}
      <div className="bg-gray-100 p-4 rounded-lg mb-6">
        <h2 className="text-xl font-semibold mb-2">Filters</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Task ID</label>
            <input
              type="text"
              name="taskId"
              value={filters.taskId}
              onChange={handleFilterChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Interface Type</label>
            <select
              name="interfaceType"
              value={filters.interfaceType}
              onChange={handleFilterChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            >
              <option value="">All</option>
              <option value="gesture">Gesture</option>
              <option value="ar">AR</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Success</label>
            <select
              name="success"
              value={filters.success}
              onChange={handleFilterChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            >
              <option value="">All</option>
              <option value="true">Success</option>
              <option value="false">Failure</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Device ID</label>
            <input
              type="text"
              name="deviceId"
              value={filters.deviceId}
              onChange={handleFilterChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Interaction Type</label>
            <input
              type="text"
              name="interactionType"
              value={filters.interactionType}
              onChange={handleFilterChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">User ID</label>
            <input
              type="text"
              name="userId"
              value={filters.userId}
              onChange={handleFilterChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Start Date</label>
            <input
              type="datetime-local"
              name="startDate"
              value={filters.startDate}
              onChange={handleFilterChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">End Date</label>
            <input
              type="datetime-local"
              name="endDate"
              value={filters.endDate}
              onChange={handleFilterChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>
        </div>
        <div className="mt-4 flex space-x-2">
          <button
            onClick={applyFilters}
            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Apply Filters
          </button>
          <button
            onClick={resetFilters}
            className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Reset
          </button>
          <button
            onClick={exportToCSV}
            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            Export to CSV
          </button>
        </div>
      </div>
      
      {/* Logs Table */}
      {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}
      
      {loading ? (
        <div className="text-center py-4">Loading...</div>
      ) : logs.length === 0 ? (
        <div className="text-center py-4">No logs found</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Task ID</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Interface</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Timestamp</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Interaction</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Success</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Device</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Widget</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Target</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actual</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time (ms)</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {logs.map((log) => (
                <tr key={log.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{log.taskId}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{log.interfaceType}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(log.timestamp).toLocaleString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{log.interactionType}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${log.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {log.success ? 'Success' : 'Failure'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{log.deviceId}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{log.widgetLabel}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{log.targetValue}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{log.actualValue}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{log.timeElapsed}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default LogViewer;
