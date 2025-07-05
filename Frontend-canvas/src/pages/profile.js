import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const [userData, setUserData] = useState(null);
  const [canvases, setCanvases] = useState([]);
  const [error, setError] = useState('');
  const [newCanvasName, setNewCanvasName] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [shareEmail, setShareEmail] = useState('');
  const [sharingCanvasId, setSharingCanvasId] = useState(null);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const handleTokenExpiration = useCallback((error) => {
    if (error.message.includes('401') || error.message.includes('token expired')) {
      localStorage.removeItem('token');
      navigate('/login');
    }
  }, [navigate]);

  const fetchProfile = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      const response = await fetch('https://backend-2-opa9.onrender.com/users/profile', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch profile');
      }

      setUserData(data.profile);
    } catch (error) {
      console.error('Profile fetch error:', error);
      setError(error.message || 'Failed to fetch profile');
      handleTokenExpiration(error);
    }
  }, [navigate,handleTokenExpiration]);

  const fetchCanvases = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      const response = await fetch('https://backend-2-opa9.onrender.com/canvas', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch canvases');
      }

      setCanvases(data);
    } catch (error) {
      console.error('Canvas fetch error:', error);
      setError(error.message);
      handleTokenExpiration(error);
    }
  }, [navigate, handleTokenExpiration]);

  const createCanvas = async (e) => {
    e.preventDefault();
    if (!newCanvasName.trim()) return;

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      const response = await fetch('https://backend-2-opa9.onrender.com/canvas', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name: newCanvasName })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Failed to create canvas');
      }

      setNewCanvasName('');
      setIsCreating(false);
      fetchCanvases(); // Refresh the canvas list
    } catch (error) {
      console.error('Create canvas error:', error);
      setError(error.message);
      handleTokenExpiration(error);
    }
  };

  const handleShare = async (canvasId) => {
    setSharingCanvasId(canvasId);
    setShareEmail('');
  };

  const submitShare = async (e) => {
    e.preventDefault();
    if (!shareEmail.trim()) return;

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      const response = await fetch(`https://backend-2-opa9.onrender.com/canvas/${sharingCanvasId}/share`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ sharedWithEmail: shareEmail })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Failed to share canvas');
      }

      setShareEmail('');
      setSharingCanvasId(null);
      fetchCanvases(); // Refresh the canvas list
    } catch (error) {
      console.error('Share canvas error:', error);
      setError(error.message);
      handleTokenExpiration(error);
    }
  };

  const handleDelete = async (canvasId) => {
    if (!window.confirm('Are you sure you want to delete this canvas?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      const response = await fetch(`https://backend-2-opa9.onrender.com/canvas/${canvasId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to delete canvas');
      }

      // Remove the deleted canvas from the state
      setCanvases(canvases.filter(canvas => canvas._id !== canvasId));
    } catch (error) {
      console.error('Delete canvas error:', error);
      setError(`${error.message} - Refreshing page in 3 seconds...`);
      
      // Start countdown
      let countdown = 3;
      const countdownInterval = setInterval(() => {
        countdown--;
        setError(`${error.message} - Refreshing page in ${countdown} seconds...`);
        
        if (countdown <= 0) {
          clearInterval(countdownInterval);
          window.location.reload();
        }
      }, 1000);

      handleTokenExpiration(error);
    }
  };

  useEffect(() => {
    fetchProfile();
    fetchCanvases();
  }, [fetchProfile, fetchCanvases]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div>Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Profile Section */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-extrabold text-gray-900">
              Profile
            </h2>
            <button
              onClick={handleLogout}
              className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              Logout
            </button>
          </div>
          <div className="text-center">
            <h3 className="text-xl font-medium text-gray-900">Hello, {userData.name}!</h3>
            <p className="mt-2 text-sm text-gray-600">{userData.email}</p>
          </div>
        </div>

        {/* Canvas Section */}
        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">My Canvases</h2>
            <button
              onClick={() => setIsCreating(true)}
              className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              Create New Canvas
            </button>
          </div>

          {/* Create Canvas Form */}
          {isCreating && (
            <form onSubmit={createCanvas} className="mb-6 p-4 border rounded-md">
              <div className="flex gap-4">
                <input
                  type="text"
                  value={newCanvasName}
                  onChange={(e) => setNewCanvasName(e.target.value)}
                  placeholder="Enter canvas name"
                  className="flex-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
                <button
                  type="submit"
                  className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  Create
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsCreating(false);
                    setNewCanvasName('');
                  }}
                  className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}

          {/* Share Canvas Form */}
          {sharingCanvasId && (
            <form onSubmit={submitShare} className="mb-6 p-4 border rounded-md">
              <div className="flex gap-4">
                <input
                  type="email"
                  value={shareEmail}
                  onChange={(e) => setShareEmail(e.target.value)}
                  placeholder="Enter email to share with"
                  className="flex-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
                <button
                  type="submit"
                  className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  Share
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setSharingCanvasId(null);
                    setShareEmail('');
                  }}
                  className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}

          {/* Canvas List */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {canvases.map((canvas) => (
              <div
                key={canvas._id}
                className="border rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <h3 className="text-lg font-semibold text-gray-900">{canvas.name}</h3>
                <p className="text-sm text-gray-500">
                  Created: {new Date(canvas.createdAt).toLocaleDateString()}
                </p>
                <div className="mt-4 flex gap-2">
                  <button
                    onClick={() => navigate(`/canvas/${canvas._id}`)}
                    className="text-indigo-600 hover:text-indigo-800"
                  >
                    Open Canvas →
                  </button>
                  <button
                    onClick={() => handleShare(canvas._id)}
                    className="text-green-600 hover:text-green-800"
                  >
                    Share
                  </button>
                  <button
                    onClick={() => handleDelete(canvas._id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>

          {canvases.length === 0 && (
            <p className="text-center text-gray-500 mt-4">No canvases found. Create your first canvas!</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
