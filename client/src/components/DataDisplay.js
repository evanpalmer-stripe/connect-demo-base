import React, { useState, useEffect } from 'react';

const DataDisplay = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/data');
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const result = await response.json();
        setData(result);
        setError(null);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleRefresh = () => {
    setLoading(true);
    setError(null);
    
    fetch('/api/data')
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then(result => {
        setData(result);
        setError(null);
      })
      .catch(err => {
        console.error('Error fetching data:', err);
        setError(err.message);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-8">
        <div className="spinner spinner-lg mb-4"></div>
        <p className="text-gray-600">Loading data from server...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <div className="card card-error card-padding-md mb-4">
          <h3 className="text-lg font-semibold text-red-800 mb-2">
            Error Loading Data
          </h3>
          <p className="text-red-600 mb-4">{error}</p>
          <button onClick={handleRefresh} className="btn btn-danger btn-md">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          Server Response
        </h2>
        
        <div className="card card-success card-padding-md mb-6">
          <div className="space-y-3">
            <div>
              <span className="font-medium text-gray-700">Message:</span>
              <p className="text-lg text-green-800 font-semibold mt-1">
                {data?.message}
              </p>
            </div>
            
            <div>
              <span className="font-medium text-gray-700">Status:</span>
              <span className="badge badge-success ml-2">
                {data?.status}
              </span>
            </div>
            
            <div>
              <span className="font-medium text-gray-700">Timestamp:</span>
              <p className="text-sm text-gray-600 mt-1">
                {data?.timestamp ? new Date(data.timestamp).toLocaleString() : 'N/A'}
              </p>
            </div>
          </div>
        </div>
        
        <button onClick={handleRefresh} className="btn btn-primary btn-lg">
          Refresh Data
        </button>
      </div>
      
      <div className="border-t pt-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-3">
          Raw JSON Response
        </h3>
        <div className="card card-padding-sm">
          <pre className="text-sm text-gray-700 overflow-x-auto">
            {JSON.stringify(data, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  );
};

export default DataDisplay;
