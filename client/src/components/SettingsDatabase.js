import React, { useState, useEffect } from 'react';
import { Listbox, Transition } from '@headlessui/react';
import { ChevronUpDownIcon, ChevronLeftIcon, ChevronRightIcon, PencilIcon, TrashIcon, CheckIcon, XMarkIcon } from '@heroicons/react/24/outline';

const SettingsDatabase = () => {
  const [tables, setTables] = useState([]);
  const [selectedTable, setSelectedTable] = useState(null);
  const [tableData, setTableData] = useState([]);
  const [tableSchema, setTableSchema] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0
  });
  const [editingRow, setEditingRow] = useState(null);
  const [editingData, setEditingData] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [toast, setToast] = useState(null);

  // Fetch available tables
  useEffect(() => {
    fetchTables();
  }, []);

  // Fetch table data when table is selected
  useEffect(() => {
    if (selectedTable) {
      fetchTableData(selectedTable, 1);
      fetchTableSchema(selectedTable);
    }
  }, [selectedTable]);

  const fetchTables = async () => {
    try {
      const response = await fetch('/api/database/tables');
      const data = await response.json();
      setTables(data.tables);
    } catch (error) {
      console.error('Error fetching tables:', error);
      setError('Failed to fetch tables');
    }
  };

  const fetchTableSchema = async (tableName) => {
    try {
      const response = await fetch(`/api/database/tables/${tableName}/schema`);
      const data = await response.json();
      setTableSchema(data.schema);
    } catch (error) {
      console.error('Error fetching table schema:', error);
    }
  };

  const fetchTableData = async (tableName, page) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/database/tables/${tableName}/data?page=${page}&limit=10`);
      const data = await response.json();
      setTableData(data.data);
      setPagination(data.pagination);
      setError(null);
    } catch (error) {
      console.error('Error fetching table data:', error);
      setError('Failed to fetch table data');
    } finally {
      setLoading(false);
    }
  };

  const handleTableChange = (table) => {
    setSelectedTable(table);
    setEditingRow(null);
    setEditingData({});
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      fetchTableData(selectedTable, newPage);
    }
  };

  const startEditing = (row) => {
    setEditingRow(row.id);
    setEditingData({ ...row });
  };

  const cancelEditing = () => {
    setEditingRow(null);
    setEditingData({});
  };

  const saveRow = async (rowId) => {
    try {
      const response = await fetch(`/api/database/tables/${selectedTable}/records/${rowId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editingData),
      });

      if (response.ok) {
        const data = await response.json();
        // Update the row in the current data
        setTableData(prevData => 
          prevData.map(row => row.id === rowId ? data.record : row)
        );
        setEditingRow(null);
        setEditingData({});
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Failed to save row');
      }
    } catch (error) {
      console.error('Error saving row:', error);
      setError('Failed to save row');
    }
  };

  const deleteRow = async (rowId) => {
    if (!window.confirm('Are you sure you want to delete this row?')) {
      return;
    }

    try {
      const response = await fetch(`/api/database/tables/${selectedTable}/records/${rowId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        // Remove the row from current data
        setTableData(prevData => prevData.filter(row => row.id !== rowId));
        setPagination(prev => ({ ...prev, total: prev.total - 1 }));
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Failed to delete row');
      }
    } catch (error) {
      console.error('Error deleting row:', error);
      setError('Failed to delete row');
    }
  };

  const handleFieldChange = (field, value) => {
    setEditingData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const getFieldType = (fieldName) => {
    const column = tableSchema.find(col => col.name === fieldName);
    if (!column) return 'text';
    
    const type = column.type.toLowerCase();
    if (type.includes('int')) return 'number';
    if (type.includes('text') || type.includes('varchar')) return 'text';
    if (type.includes('datetime') || type.includes('timestamp')) return 'datetime-local';
    return 'text';
  };

  const copyToClipboard = async (value) => {
    try {
      await navigator.clipboard.writeText(value);
      setToast('Added to clipboard');
      setTimeout(() => setToast(null), 2000);
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
      setToast('Failed to copy to clipboard');
      setTimeout(() => setToast(null), 2000);
    }
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toast && (
        <div className="fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50 transition-opacity duration-300">
          {toast}
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {/* Table Selection */}
    <Listbox value={selectedTable} onChange={handleTableChange}>
        <div className="relative">
        <Listbox.Button className="relative w-full cursor-default rounded-lg bg-white py-2 pl-3 pr-10 text-left shadow-md focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm">
            <span className="block truncate">
            {selectedTable || 'Choose a table...'}
            </span>
            <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
            <ChevronUpDownIcon className="h-5 w-5 text-gray-400" />
            </span>
        </Listbox.Button>
        <Transition
            as={React.Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
        >
            <Listbox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm z-10">
            {tables.map((table) => (
                <Listbox.Option
                key={table}
                className={({ active }) =>
                    `relative cursor-default select-none py-2 pl-10 pr-4 ${
                    active ? 'bg-amber-100 text-amber-900' : 'text-gray-900'
                    }`
                }
                value={table}
                >
                {({ selected }) => (
                    <>
                    <span className={`block truncate ${selected ? 'font-medium' : 'font-normal'}`}>
                        {table}
                    </span>
                    {selected ? (
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-amber-600">
                        <CheckIcon className="h-5 w-5" />
                        </span>
                    ) : null}
                    </>
                )}
                </Listbox.Option>
            ))}
            </Listbox.Options>
        </Transition>
        </div>
    </Listbox>

      {/* Table Data Display */}
      {selectedTable && (
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">
              {selectedTable} Table
            </h3>
            <p className="text-sm text-gray-600">
              Showing {tableData.length} of {pagination.total} records
            </p>
          </div>

          {loading ? (
            <div className="p-6 text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
              <p className="mt-2 text-gray-600">Loading...</p>
            </div>
          ) : (
            <>
              {/* Table */}
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      {tableSchema.map((column) => (
                        <th
                          key={column.name}
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          {column.name}
                        </th>
                      ))}
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {tableData.map((row) => (
                      <tr key={row.id} className="hover:bg-gray-50">
                        {tableSchema.map((column) => (
                          <td key={column.name} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {editingRow === row.id ? (
                              <input
                                type={getFieldType(column.name)}
                                value={editingData[column.name] || ''}
                                onChange={(e) => handleFieldChange(column.name, e.target.value)}
                                className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                disabled={column.name === 'id'}
                              />
                            ) : (
                              <span 
                                className="cursor-pointer hover:bg-gray-100 px-2 py-1 rounded transition-colors duration-150"
                                onClick={() => copyToClipboard(row[column.name] || '')}
                                title="Click to copy to clipboard"
                              >
                                {row[column.name] || '-'}
                              </span>
                            )}
                          </td>
                        ))}
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            {editingRow === row.id ? (
                              <>
                                <button
                                  onClick={() => saveRow(row.id)}
                                  className="text-green-600 hover:text-green-900"
                                  title="Save"
                                >
                                  <CheckIcon className="h-4 w-4" />
                                </button>
                                <button
                                  onClick={cancelEditing}
                                  className="text-gray-600 hover:text-gray-900"
                                  title="Cancel"
                                >
                                  <XMarkIcon className="h-4 w-4" />
                                </button>
                              </>
                            ) : (
                              <button
                                onClick={() => startEditing(row)}
                                className="text-indigo-600 hover:text-indigo-900"
                                title="Edit"
                              >
                                <PencilIcon className="h-4 w-4" />
                              </button>
                            )}
                            <button
                              onClick={() => deleteRow(row.id)}
                              className="text-red-600 hover:text-red-900"
                              title="Delete"
                            >
                              <TrashIcon className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {pagination.totalPages > 1 && (
                <div className="px-6 py-4 border-t border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-700">
                      Page {pagination.page} of {pagination.totalPages}
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handlePageChange(pagination.page - 1)}
                        disabled={pagination.page === 1}
                        className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <ChevronLeftIcon className="h-4 w-4" />
                        Previous
                      </button>
                      <button
                        onClick={() => handlePageChange(pagination.page + 1)}
                        disabled={pagination.page === pagination.totalPages}
                        className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Next
                        <ChevronRightIcon className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default SettingsDatabase;
