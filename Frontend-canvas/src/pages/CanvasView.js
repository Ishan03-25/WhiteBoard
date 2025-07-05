import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import BoardProvider from '../store/BoardProvider';
import ToolboxProvider from '../store/ToolboxProvider';
import Toolbar from '../components/Toolbar/index';
import Board from '../components/Board/index';
import Toolbox from '../components/Toolbox/index';

const CanvasView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [canvas, setCanvas] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCanvas = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/login');
          return;
        }

        const response = await fetch(`https://backend-2-opa9.onrender.com/canvas/${id}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.message || 'Failed to fetch canvas');
        }
        console.log('Canvas loaded:', data);
        setCanvas(data);
      } catch (error) {
        console.error('Canvas fetch error:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCanvas();
  }, [id, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div>Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  if (!canvas) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div>Canvas not found</div>
      </div>
    );
  }

  return (
    
        <BoardProvider initialElements={canvas}>
          <ToolboxProvider>         
              <Toolbar />      
                <Board />
            <Toolbox />
          </ToolboxProvider>
        </BoardProvider>
  );
};

export default CanvasView; 
