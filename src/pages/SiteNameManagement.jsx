import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { showSuccessToast, showErrorToast } from '../utils/toastUtils';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';
import SiteNameHistory from '../components/SiteNameHistory';
import BrandPreview from '../components/BrandPreview';
import { FaSave, FaHistory, FaUndo } from 'react-icons/fa';

export default function SiteNameManagement() {
  const [siteName, setSiteName] = useState('');
  const [originalName, setOriginalName] = useState('');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [history, setHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const [error, setError] = useState('');
  const { currentUser } = useAuth();
  
  const API_URL = import.meta.env.VITE_API_URL;

  const fetchSiteData = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}general?type=sitename`);
      if (response.data) {
        setSiteName(response.data.name);
        setOriginalName(response.data.name);
      }
      
      // Fetch history (this would require backend implementation)
      const historyResponse = await axios.get(`${API_URL}history?type=sitename`);
      setHistory(historyResponse.data);
    } catch (err) {
      showErrorToast('Failed to load site data');
      console.error('Site name error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!siteName.trim()) {
      setError('Site name cannot be empty');
      return;
    }
    
    if (siteName.length > 50) {
      setError('Site name must be less than 50 characters');
      return;
    }
    
    if (siteName === originalName) {
      showErrorToast('No changes detected');
      return;
    }

    setSaving(true);
    try {
      await axios.put(`${API_URL}general?type=sitename`, 
        { name: siteName },
        { headers: { Authorization: `Bearer ${currentUser.token}` } }
      );
      
      showSuccessToast('Site name updated successfully');
      setOriginalName(siteName);
      
      // Add to local history
      setHistory(prev => [
        {
          name: siteName,
          updatedBy: currentUser.name,
          updatedAt: new Date().toISOString()
        },
        ...prev.slice(0, 4)
      ]);
    } catch (err) {
      showErrorToast('Failed to update site name');
      console.error('Update error:', err);
    } finally {
      setSaving(false);
    }
  };

  const restorePreviousName = () => {
    setSiteName(originalName);
    setError('');
  };

  useEffect(() => {
    fetchSiteData();
  }, []);

  return (
    <div className="site-name-container">
      <div className="site-header">
        <h1>Site Identity Management</h1>
        <p className="subtitle">
          Update your site's name which will be displayed across the platform
        </p>
      </div>
      
      <div className="content-grid">
        <div className="form-section">
          <div className="form-header">
            <h2>Update Site Name</h2>
            <button 
              className="history-btn"
              onClick={() => setShowHistory(!showHistory)}
            >
              <FaHistory /> {showHistory ? 'Hide History' : 'View History'}
            </button>
          </div>
          
          <form onSubmit={handleSubmit} className="site-name-form">
            <div className="form-group">
              <label htmlFor="site-name">Site Name</label>
              <input
                id="site-name"
                type="text"
                placeholder="Enter your site name"
                value={siteName}
                onChange={(e) => setSiteName(e.target.value)}
                className={error ? 'error-input' : ''}
              />
              {error && <p className="error-message">{error}</p>}
            </div>
            
            <div className="form-actions">
              <button 
                type="button" 
                className="reset-btn"
                onClick={restorePreviousName}
                disabled={siteName === originalName || saving}
              >
                <FaUndo /> Reset
              </button>
              <button 
                type="submit" 
                className="save-btn"
                disabled={siteName === originalName || saving || !!error}
              >
                {saving ? <LoadingSpinner small white /> : <><FaSave /> Save Changes</>}
              </button>
            </div>
          </form>
          
          {showHistory && (
            <SiteNameHistory 
              history={history} 
              currentName={originalName}
              onSelectName={setSiteName}
            />
          )}
        </div>
        
        <div className="preview-section">
          <BrandPreview siteName={siteName} />
        </div>
      </div>
      
      <div className="info-card">
        <h3>Best Practices</h3>
        <ul>
          <li>Keep your site name short and memorable</li>
          <li>Avoid special characters that might cause display issues</li>
          <li>Consider how your name appears on different platforms</li>
          <li>Changes may take a few minutes to propagate everywhere</li>
        </ul>
      </div>
    </div>
  );
}
