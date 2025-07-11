import React from 'react';
import ToggleSwitch from './ToggleSwitch';

const PageControlCard = ({ page, onToggle, saving }) => {
  const isLocked = page.page === 'pagecontrol';
  
  return (
    <div className={`page-card ${page.enabled ? 'enabled' : 'disabled'}`}>
      <div className="card-header">
        <h3>{page.formattedName}</h3>
        <div className={`status-badge ${page.enabled ? 'enabled' : 'disabled'}`}>
          {page.enabled ? 'Enabled' : 'Disabled'}
        </div>
      </div>
      
      <div className="card-body">
        <p className="page-id">ID: {page._id}</p>
        <p className="last-updated">
          Last updated: {new Date(page.updatedAt || page.createdAt).toLocaleString()}
        </p>
      </div>
      
      <div className="card-footer">
        {isLocked ? (
          <div className="locked-indicator">
            <span className="lock-icon">🔒</span>
            <span>Cannot be disabled</span>
          </div>
        ) : (
          <ToggleSwitch 
            checked={page.enabled} 
            onChange={() => onToggle(page._id, page.enabled, page.page)}
            disabled={saving}
          />
        )}
      </div>
    </div>
  );
};

export default PageControlCard;
