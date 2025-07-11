import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { showSuccessToast, showErrorToast, showWarningToast } from '../utils/toastUtils';
import { useAuth } from '../context/AuthContext';
import ToggleSwitch from '../components/ToggleSwitch';
import LoadingSpinner from '../components/LoadingSpinner';
import SearchBar from '../components/SearchBar';
import PageControlCard from '../components/PageControlCard';

export default function PageControlManagement({ fetchPageStatus }) {
  const [pages, setPages] = useState([]);
  const [filteredPages, setFilteredPages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { currentUser } = useAuth();
  
  const API_URL = import.meta.env.VITE_API_URL;

  // Format page name for display
  const formatPageName = (page) => {
    const nameMap = {
      'videos': 'YouTube Videos',
      'pdfs': 'PDF Management',
      'welcome': 'Welcome Note',
      'sitename': 'Site Name',
      'subscription-plans': 'Subscription Plans',
      'users': 'User Management',
      'pagecontrol': 'Page Control'
    };
    
    return nameMap[page] || page
      .replace(/-/g, ' ')
      .replace(/\b\w/g, char => char.toUpperCase());
  };

  // Get page category for grouping
  const getPageCategory = (page) => {
    if (['videos', 'pdfs'].includes(page)) return 'Content Management';
    if (['welcome', 'sitename'].includes(page)) return 'Site Configuration';
    if (['subscription-plans', 'users'].includes(page)) return 'Subscription System';
    if (page === 'pagecontrol') return 'System Pages';
    return 'Other';
  };

  // Load pages from API
  const loadPages = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}general?type=pagecontrol`, {
        headers: { Authorization: `Bearer ${currentUser.token}` }
      });
      
      // Add formatted name and category to each page
      const enhancedPages = response.data.map(page => ({
        ...page,
        formattedName: formatPageName(page.page),
        category: getPageCategory(page.page)
      }));
      
      setPages(enhancedPages);
      setFilteredPages(enhancedPages);
    } catch (err) {
      showErrorToast('Failed to load page controls');
      console.error('Page control error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Toggle page status
  const togglePageStatus = async (id, currentStatus, pageName) => {
    if (pageName === 'pagecontrol') {
      showWarningToast("Page Control cannot be disabled");
      return;
    }

    setSaving(true);
    try {
      await axios.put(`${API_URL}general?type=pagecontrol&id=${id}`, {
        enabled: !currentStatus
      }, {
        headers: { Authorization: `Bearer ${currentUser.token}` }
      });
      
      showSuccessToast(`"${formatPageName(pageName)}" ${currentStatus ? 'disabled' : 'enabled'}`);
      await loadPages();
      await fetchPageStatus();
    } catch (err) {
      showErrorToast('Failed to update page status');
    } finally {
      setSaving(false);
    }
  };

  // Filter pages based on search query
  useEffect(() => {
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const filtered = pages.filter(page => 
        page.formattedName.toLowerCase().includes(query) || 
        page.category.toLowerCase().includes(query)
      );
      setFilteredPages(filtered);
    } else {
      setFilteredPages(pages);
    }
  }, [searchQuery, pages]);

  // Group pages by category
  const groupPagesByCategory = () => {
    return filteredPages.reduce((groups, page) => {
      const category = page.category;
      if (!groups[category]) {
        groups[category] = [];
      }
      groups[category].push(page);
      return groups;
    }, {});
  };

  // Load pages on component mount
  useEffect(() => {
    loadPages();
  }, []);

  // Render grouped pages
  const renderPageGroups = () => {
    const groupedPages = groupPagesByCategory();
    return Object.entries(groupedPages).map(([category, pages]) => (
      <div key={category} className="page-group">
        <h3 className="group-title">{category}</h3>
        <div className="page-grid">
          {pages.map(page => (
            <PageControlCard 
              key={page._id}
              page={page}
              onToggle={togglePageStatus}
              saving={saving}
            />
          ))}
        </div>
      </div>
    ));
  };

  return (
    <div className="page-control-container">
      <div className="page-header">
        <h1>Page Visibility Control</h1>
        <p className="subtitle">
          Enable or disable sections of your admin panel. Disabled pages won't be accessible to anyone.
        </p>
      </div>
      
      <div className="controls-bar">
        <SearchBar 
          placeholder="Search pages..."
          value={searchQuery}
          onChange={setSearchQuery}
        />
        <div className="status-indicator">
          <span className="enabled-dot"></span>
          <span>Enabled</span>
          <span className="disabled-dot"></span>
          <span>Disabled</span>
        </div>
      </div>
      
      {loading ? (
        <div className="loading-container">
          <LoadingSpinner />
          <p>Loading page controls...</p>
        </div>
      ) : filteredPages.length === 0 ? (
        <div className="no-results">
          <p>No pages found matching your search</p>
          <button 
            className="clear-search-btn"
            onClick={() => setSearchQuery('')}
          >
            Clear Search
          </button>
        </div>
      ) : (
        <div className="page-groups-container">
          {renderPageGroups()}
        </div>
      )}
      
      <div className="info-box">
        <h3>Important Notes</h3>
        <ul>
          <li>Changes take effect immediately for all users</li>
          <li>Disabled pages will be hidden from navigation menus</li>
          <li>Page Control panel cannot be disabled for security reasons</li>
          <li>Changes are automatically saved</li>
        </ul>
      </div>
    </div>
  );
}
